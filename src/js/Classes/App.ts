import { Database } from './Database';
import { Layout } from '../Pages/Layout/Layout';
import { AuthPage } from '../Pages/AuthPage/AuthPage';
import { RegistrationPage } from '../Pages/RegistrationPage/RegistrationPage';
import { Main } from '../Pages/Main/Main';
import { MyGroups } from '../Pages/MyGroups/MyGroups';
import { AccountPage } from '../Pages/AccountPage/AccountPage';

import { IGroupDataAll, IDataForCreateGroup } from '../Interfaces/IGroupData';
import { TransactionsList } from '../Pages/TransactionsList/transactionsList';
import { dataTransList } from '../Data/dataTransList';
import {
  INotification,
  Notifications,
  TypeOfNotifications,
} from './Notifications';
import { INewMessage, Messenger } from '../Pages/Messenger/Messenger';
import { Contacts, ISearchUserData } from '../Pages/Contacts/Contacts';

export interface IHandlers {
  messages: any;
  groups: any;
  transactions: any;
  contacts: any;
}

export class App {
  private database: Database;
  private layout: Layout;
  private authPage: AuthPage;
  private regPage: RegistrationPage;
  private mainPage: Main;
  private groups: MyGroups;
  private accountPage: AccountPage;
  private transactionsList: TransactionsList;
  private notifications: Notifications;
  private messenger: Messenger;
  private contacts: Contacts;
  private contactsHandler: void;
  private messageHandler: (snapshot: any) => void;
  private transactionHandler: (snapshot: any) => void;
  private groupHandler: (snapshot: any) => void;

  constructor() {
    this.database = Database.create();
    this.init();
  }

  static create() {
    return new App();
  }

  init() {
    this.database.onUserIsLogin = this.isUserLogin.bind(this);
    this.database.init();
    // this.database.createBasicTables();
  }

  isUserLogin(state: boolean, uid?: string) {
    if (state) {
      // user signin
      this.layout = Layout.create('#app');
      this.layout.render();

      this.startNotification();

      // SIDEBAR
      this.layout.onSignOut = this.onSignOut.bind(this);
      this.layout.onStatisticsPage = this.onStatisticsPage.bind(this);
      this.layout.onMainPage = this.onMainPage.bind(this);
      this.layout.onGroupsPage = this.onGroupsPage.bind(this);
      this.layout.onTransactionsPage = this.onTransactionsPage.bind(this);
      this.layout.onSettingsPage = this.onSettingsPage.bind(this);
      this.layout.onHelpPage = this.onHelpPage.bind(this);
      this.layout.onSignOut = this.onSignOut.bind(this);
      this.layout.onAccountPage = this.onAccountPage.bind(this);
      this.layout.onMessagesPage = this.onMessagesPage.bind(this);
      this.layout.onContactsPage = this.onContactsPage.bind(this);

      this.accountPage = AccountPage.create('.main');
      this.mainPage = Main.create('.main');
      this.mainPage.onMainGetBalance = this.onMainGetBalance.bind(this);

      this.database.getUserInfo(uid, [this.layout.setSidebarData]);

      this.groups = MyGroups.create('.main');
      this.groups.onCreateNewGroup = this.onCreateNewGroup.bind(this);
      this.groups.onAddMember = this.onAddGroupMember.bind(this);
      this.groups.fillContactsList = this.fillContactsList.bind(this);


      this.transactionsList = TransactionsList.create('.main');
      this.transactionsList.onTransactionSubmit = this.onTransactionSubmit.bind(
        this,
      );

      this.messenger = Messenger.create('.main');
      this.messenger.onAddRecipient = this.onAddRecipientToMessage.bind(this);
      this.messenger.sendNewMessage = this.onSendNewMessage.bind(this);
      this.messenger.onAnswerMessage = this.onAnswerMessage.bind(this);
      this.messenger.fillContactsList = this.fillContactsList.bind(this);

      this.contacts = Contacts.create('.main');
      this.contacts.addUserToContacts = this.onAddUserToContacts.bind(this);
      this.contacts.onChangeContactState = this.onChangeContactState.bind(this);

      this.loadCurrentPage();
    } else {
      console.log(`isUserLogon = ${state}`);
      this.authPage = AuthPage.create('#app');
      this.authPage.onLoadSignInPage = this.loadSignInPage.bind(this);
      this.authPage.onGoogleReg = this.onGoogleReg.bind(this);
      this.authPage.onLogin = this.onLogin.bind(this);

      this.regPage = RegistrationPage.create('#app');
      this.regPage.onSignIn = this.onSignIn.bind(this);
      this.regPage.goToLoginPage = this.loadLoginPage.bind(this);
      this.regPage.onGoogleReg = this.onGoogleReg.bind(this);

      this.authPage.render();
    }
  }

  onSignOut(): any {
    this.database.signOut();
    this.database.init();
  }

  onSignIn(email: string, password: string, name: string): void {
    this.database.createUserByEmail(
      email,
      password,
      name,
      this.regPage.showErrorMessage,
    );
  }

  onLogin(email: string, password: string): void {
    this.database.loginUserByEmail(
      email,
      password,
      this.authPage.showErrorMessage,
    );
  }

  loadCurrentPage() {
    const currentPage: any = localStorage.getItem('currentPage') || 'Main';
    this[`on${currentPage}Page`]();
  }

  setCurrentPage(name: string): void {
    localStorage.setItem('currentPage', name);
  }

  async onMainPage() {
    this.setCurrentPage('Main');
    this.deleteHandlers();
    const uid: string = this.database.uid;
    this.mainPage.render();
    this.database.getUserInfo(uid, [this.mainPage.addUserInfo, this.mainPage.renderSlider, this.mainPage.renderSliderItems]);
    this.database.getUserCurrentCurrency(uid, this.mainPage.getDataForCurrency, this.mainPage.createCurrTable);
    this.database.getUserGroups(uid, this.mainPage.renderAvatarsBlockForSlider, this.mainPage.renderOneGroup);
    await this.database.getUserTransactions(uid, this.mainPage.renderTransactions);
    this.mainPage.checkUserCost();
  }

  onMainGetBalance(rank: number) {
    const uid: string = this.database.uid;
    this.database.getBalanceForUserTotal(uid, rank, this.mainPage.getBalance);
  }

  onAccountPage() {
    this.setCurrentPage('Account');
    this.deleteHandlers();
    const uid: string = this.database.uid;
    this.database.getUserInfo(uid, [this.accountPage.render]);
  }

  onContactsPage() {
    this.setCurrentPage('Contacts');
    this.deleteHandlers();
    this.contacts.render();
    this.contactsHandler = this.database.contactsHandler(this.contacts.addContactToList);
    this.database.getContactsList(this.contactsHandler);
  }

  onGroupsPage() {
    this.setCurrentPage('Groups');
    this.deleteHandlers();
    this.notifications.groupCount = 0;
    this.notifications.setNotificationMark(TypeOfNotifications.Group, 0);

    this.groups.render();
    this.groupHandler = this.database.groupHandler(this.groups.createGroupList);
    this.database.getGroupList(this.groupHandler);
  }

  onTransactionsPage() {
    this.setCurrentPage('Transactions');
    this.deleteHandlers();
    this.notifications.transactionCount = 0;
    this.notifications.setNotificationMark(TypeOfNotifications.Transaction, 0);

    this.transactionsList.render(dataTransList);
    this.transactionsList.newTrans.onCreateTransaction = this.onCreateTransaction.bind(this);
    this.transactionsList.newTrans.onShowMembersOfGroup = this.onShowMembersOfGroup.bind(this);
    this.database.getCurrencyList(this.transactionsList.newTrans.addCurrencyList);
    this.database.getGroupsListForTransaction(this.transactionsList.newTrans.addGroupList);
    this.database.getMembersOfGroupFirst(this.transactionsList.newTrans.addMembersOfGroup);
  }

  onMessagesPage() {
    this.setCurrentPage('Messages');
    this.deleteHandlers();
    this.notifications.messageCount = 0;
    this.notifications.setNotificationMark(TypeOfNotifications.Message, 0);

    this.messenger.render();
    this.messageHandler = this.database.messageHandler(
      this.messenger.addMessageToList,
      this.messenger.setUserDataInMessage,
    );
    this.database.getMessageList(this.messageHandler);
  }

  onStatisticsPage() {
    this.deleteHandlers();
    console.log('Load Statistics Page!');
  }

  onSettingsPage() {
    this.deleteHandlers();
    console.log('Load Settings Page!');
  }

  onHelpPage() {
    this.deleteHandlers();
    console.log('Load Help Page!');
  }

  onGoogleReg() {
    this.database.createUserByGoogle(this.regPage.showErrorMessage);
  }

  loadSignInPage() {
    this.regPage.render();
  }

  loadLoginPage() {
    this.authPage.render();
  }

  onCreateNewGroup(data: IGroupDataAll) {
    const userArray: string[] = data.userList;
    const userId = this.database.uid;
    const currentGroup = data.currentGroup;

    // check self in Users List
    if (!userArray.includes(userId)) {
      userArray.push(userId);
    }

    const dataForCreateGroup: IDataForCreateGroup = {
      groupData: data.groupData,
      userList: userArray,
      currentGroup: currentGroup,
      userId: userId,
    };
    this.database.createNewGroup(dataForCreateGroup);
  }

  onTransactionSubmit(i: number) {
    dataTransList.transactions[i].submit = true;
    console.log('submit transaction');
  }

  onAddGroupMember(userId: string) {
    this.database.findUserById(userId, this.groups.addMembersGroup);
  }

  onCreateTransaction(data: any) {
    this.database.setDataTransaction(data);
  }

  onShowMembersOfGroup(groupID: string) {
    this.database.getMembersOfGroup(
      groupID,
      this.transactionsList.newTrans.addMembersOfGroup,
    );
  }

  onAddRecipientToMessage(accountName: string) {
    this.database.findUserByName(
      accountName,
      this.messenger.addUserForSendMessage,
      this.messenger.errorAddUserForSendMessage,
    );
  }

  onSendNewMessage(data: INewMessage): void {
    this.database.createNewMessage(data);
  }

  onAnswerMessage(userId: string) {
    this.database.getUserInfo(userId, [this.messenger.callAnswerModal]);
  }

  startNotification(): void {
    const groupsEl: NodeListOf<Element> = document.querySelectorAll('.sidebarGroupsLink .badge');
    const transactionsEl: NodeListOf<Element> = document.querySelectorAll('.sidebarTransactionsLink .badge');
    const messagesEl: NodeListOf<Element> = document.querySelectorAll('.sidebarMessagesLink .badge');
    const contactsEl: NodeListOf<Element> = document.querySelectorAll('.sidebarContactsLink .badge');

    const notificationElements: INotification = {
      groupsEl,
      transactionsEl,
      messagesEl,
      contactsEl,
    };
    this.notifications = Notifications.create(notificationElements);

    this.database.countNewMessage(this.notifications.setNotificationMark);
    this.database.countGroupsInvite(this.notifications.setNotificationMark);
    this.database.countTransactionInvite(this.notifications.setNotificationMark);
    this.database.countContactsInvite(this.notifications.setNotificationMark);
  }

  deleteHandlers() {
    const handlers: IHandlers = {
      messages: this.messageHandler,
      groups: this.groupHandler,
      transactions: this.transactionHandler,
      contacts: this.contactsHandler,
    };

    this.database.deleteHandlers(handlers);
  }

  onAddUserToContacts(userData: ISearchUserData, errorHandler: (message: string) => void): void {
    this.database.addUserToContacts(userData, errorHandler);
  }

  onChangeContactState(contactId: string, state: string): void {
    if (state === 'approve') {
      this.notifications.decreaseNotificationMark(TypeOfNotifications.Contact);
    }
    if (state === 'decline') {
      this.database.deleteContact(this.database.uid, contactId);
    } else {
      this.database.changeContactState(contactId, state);
    }
  }

  fillContactsList() {

    const renderContact = this.database.contactsHandler(this.contacts.addContactsToList);

    this.database.getContactsList(renderContact);
  }

  // createUser(uid: string) {
  //   const form: HTMLFormElement = document.querySelector('#my-form');
  //   const formData: { [k: string]: any } = getFormData(form);
  //
  //   const storageRef = firebase.storage().ref();
  //   const userRef = firebase.database().ref(`User/${uid}`);
  //   const file = document.querySelector('#avatar').files[0];
  //
  //   const metadata = {
  //     'contentType': file.type,
  //   };
  //
  //   storageRef.child('images/' + file.name).put(file, metadata).then(function(snapshot) {
  //     snapshot.ref.getDownloadURL()
  //       .then((url) => {
  //         formData['avatar'] = url;
  //       })
  //       .then(formData => {
  //         console.log('formData', formData);
  //         userRef.set(formData);
  //       })
  //       .catch(error => {
  //         console.log(error.code);
  //         console.log(error.message);
  //       });
  //   });
  // }


}
