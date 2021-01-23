import { Database } from './Database';
import { Layout } from '../Pages/Layout/Layout';
import { AuthPage } from '../Pages/AuthPage/AuthPage';
import { RegistrationPage } from '../Pages/RegistrationPage/RegistrationPage';
import { Main } from '../Pages/Main/Main';
import { MyGroups } from '../Pages/MyGroups/MyGroups';
import { AccountPage } from '../Pages/AccountPage/AccountPage';

import { IGroupDataAll, IDataForCreateGroup } from '../Interfaces/IGroupData';
import { TransactionsList } from '../Pages/TransactionsList/transactionsList';
import { INotification, Notifications, TypeOfNotifications } from './Notifications';
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
  private userHandler: (snapshot: any) => void;

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
      this.layout.onAccountPage = this.onAccountPage.bind(this);
      this.layout.onMessagesPage = this.onMessagesPage.bind(this);
      this.layout.onContactsPage = this.onContactsPage.bind(this);

      this.userHandler = this.database.userHandler(this.layout.setSidebarData);
      this.database.userInfoListener(this.userHandler);

      this.accountPage = AccountPage.create('.main');
      this.accountPage.updateInfo = this.updateOnAccountPage.bind(this);
      this.accountPage.changeTheme = this.changeTheme.bind(this);

      this.mainPage = Main.create('.main');

      this.database.getUserInfo(uid, [
        this.mainPage.render,
        this.layout.setSidebarData,
      ]);

      this.groups = MyGroups.create('.main');
      this.groups.onCreateNewGroup = this.onCreateNewGroup.bind(this);
      this.groups.deleteGroup = this.deleteGroup.bind(this);
      this.groups.deleteMemberFromGroup = this.deleteMemberFromGroup.bind(this);
      this.groups.onAddMember = this.onAddGroupMember.bind(this);
      this.groups.fillContactsList = this.fillContactsList.bind(this);
      this.groups.onAddInfoForModalDetailGroup = this.onAddInfoForModalDetailGroup.bind(this);
      this.groups.addBalanceInGroupPage = this.addBalanceInGroupPage.bind(this);
      this.groups.addUserBalanceInModalCardUser = this.addUserBalanceInModalCardUser.bind(this);


      this.transactionsList = TransactionsList.create('.main');
      this.transactionsList.onChangeState = this.onChangeState.bind(this);
      this.transactionsList.onGetTransInfo = this.onGetTransInfo.bind(this);
      // this.transactionsList.onGetMembers = this.onGetMembers.bind(this);

      this.messenger = Messenger.create('.main');
      this.messenger.onAddRecipient = this.onAddRecipientToMessage.bind(this);
      this.messenger.sendNewMessage = this.onSendNewMessage.bind(this);
      this.messenger.onAnswerMessage = this.onAnswerMessage.bind(this);
      this.messenger.fillContactsList = this.fillContactsList.bind(this);

      this.contacts = Contacts.create('.main');
      this.contacts.addUserToContacts = this.onAddUserToContacts.bind(this);
      this.contacts.onChangeContactState = this.onChangeContactState.bind(this);
      this.contacts.onDeleteContact = this.onDeleteContact.bind(this);

      this.changeTheme();
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
    this.database.deleteUserInfoListener(this.userHandler);
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

  changeTheme(theme: string = 'light'): void {
    const bodyClassList: any = document.querySelector('body').classList;
    if (!bodyClassList.length) {
      bodyClassList.add(`theme--${theme}`);
    } else {
      const themeClass: any = [...bodyClassList].find((item: any) => item.slice(0, 7) === 'theme--');
      bodyClassList.remove(themeClass);
      bodyClassList.add(`theme--${theme}`);
    }
  }

  onMainPage() {
    this.deleteHandlers();
    const uid: string = this.database.uid;
    this.database.getUserInfo(uid, [this.mainPage.render]);

  }

  updateOnAccountPage(data: any) {
    const uid: string = this.database.uid;
    this.database.updateUserInfo(uid, data);
  }

  async onAccountPage() {
    this.deleteHandlers();
    const uid: string = this.database.uid;
    this.accountPage.render();
    this.database.getUserInfo(uid, [this.accountPage.addUserInfo]);
    await this.database.getCurrenciesOrLangsOrThemes(uid, this.accountPage.renderCurrenciesInput, 'Currency');
    await this.database.getCurrenciesOrLangsOrThemes(uid, this.accountPage.renderLangOrTheme, 'Language');
    await this.database.getCurrenciesOrLangsOrThemes(uid, this.accountPage.renderLangOrTheme, 'Theme');

    this.accountPage.events();
  }

  onContactsPage() {
    this.deleteHandlers();
    this.contacts.render();
    this.contactsHandler = this.database.contactsHandler(this.contacts.addContactToList);
    this.database.getContactsList(this.contactsHandler);
  }

  onGroupsPage() {
    this.deleteHandlers();
    this.groups.render();
    this.groupHandler = this.database.groupHandler(this.groups.createGroupList, this.groups.addUserInGroupCard);
    this.database.getGroupList(this.groupHandler);
  }

  onAddInfoForModalDetailGroup(idGroup: string) {
    this.database.getGroup(idGroup, this.groups.addInfoForModalDetailGroup, this.groups.addModalUserData);
    this.database.getBalanceInGroup(idGroup, 1, this.groups.addBalanceForModalGroupDetail);
  }

  addBalanceInGroupPage(idGroup: string) {
    this.database.getBalanceInGroup(idGroup, 1, this.groups.addBalanceInGroupCard);
  }

  addUserBalanceInModalCardUser(data: any) {
    console.log('APP______addUserBalanceInModalCardUser');

    const { userId, groupId } = data;
    this.database.getBalanceForUserInGroup(userId, groupId, 1, this.groups.addUserBalanceInModalDetailGroup);
  }

  onTransactionsPage() {
    this.transactionsList.render();
    this.deleteHandlers();

    this.transactionsList.newTrans.onCreateTransaction = this.onCreateTransaction.bind(this);
    this.transactionsList.newTrans.onShowMembersOfGroup = this.onShowMembersOfGroup.bind(this);
    this.database.getCurrencyList(this.transactionsList.newTrans.addCurrencyList);
    this.database.getGroupsListForTransaction(this.transactionsList.newTrans.addGroupList);
    this.database.getMembersOfGroupFirst(this.transactionsList.newTrans.addMembersOfGroup);
    this.database.getGroupsListForTransaction(this.transactionsList.addGroupToTransList);
    this.transactionHandler = this.database.transactionHandler(this.transactionsList.addTransactionWrapper, this.transactionsList.addMyTransactions, this.transactionsList.addUserToList);
    this.database.getMyTransactionsList(this.transactionHandler);
  }

  onMessagesPage() {
    this.deleteHandlers();
    this.notifications.messageCount = 0;
    this.notifications.setNotificationMark(TypeOfNotifications.Message, 0);

    this.messenger.render();
    this.messageHandler = this.database.messageHandler(this.messenger.addMessageToList, this.messenger.setUserDataInMessage);
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

  onAddGroupMember(userId: string) {
    this.database.findUserById(userId, this.groups.addMembersGroup);
  }

  onCreateTransaction(data: any) {
    this.database.setDataTransaction(data);
  }

  onShowMembersOfGroup(groupID: string) {
    this.database.getMembersOfGroup(groupID, this.transactionsList.newTrans.addMembersOfGroup);
  }

  onChangeState(state: string, transID: string) {
    this.database.setNewStateTransaction(state, transID);
  }

  onGetTransInfo(trans: any, transID: string, groupID: string) {
    console.log('ongettransinfo');
    this.database.getTransInfoModal(trans, transID, groupID, this.transactionsList.addGroupTitle,
      this.transactionsList.addMemberOfTransaction, this.transactionsList.addOwnerInfo);
  }

  onAddRecipientToMessage(accountName: string) {
    this.database.findUserByName(accountName, this.messenger.addUserForSendMessage, this.messenger.errorAddUserForSendMessage);
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

  deleteGroup(idGroup: string) {
    this.database.removeGroup(idGroup);
  }

  deleteMemberFromGroup(idGroup: string, userId: string) {
    this.database.removeMemberGroup(idGroup, userId);
  }

  onAddUserToContacts(userData: ISearchUserData, errorHandler: (message: string) => void): void {
    this.database.addUserToContacts(userData, errorHandler);
  }

  onChangeContactState(contactId: string, state: string): void {
    if (state === 'approve') {
      this.notifications.decreaseNotificationMark(TypeOfNotifications.Contact);
    }
    this.database.changeContactState(contactId, state);
  }

  fillContactsList() {
    const renderContact = this.database.contactsHandler(this.contacts.addContactsToList);
    this.database.getContactsList(renderContact);
  }

  onDeleteContact(contactId: string): void {
    this.database.deleteUserFromContactsList(contactId);
    this.database.deleteUserFromContactsList(this.database.uid, contactId);
    this.notifications.decreaseNotificationMark(TypeOfNotifications.Contact);
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
