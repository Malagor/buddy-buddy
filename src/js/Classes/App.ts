import { Database } from './Database';
import { Layout } from '../Pages/Layout/Layout';
import { AuthPage } from '../Pages/AuthPage/AuthPage';
import { RegistrationPage } from '../Pages/RegistrationPage/RegistrationPage';
import { Main } from '../Pages/Main/Main';
import { MyGroups } from '../Pages/MyGroups/MyGroups';
import { AccountPage } from '../Pages/AccountPage/AccountPage';

import {
  IGroupDataAll,
  IDataForCreateGroup,
  IDataChangeStatus,
  IDataAddMember,
  IDataCloseGroup,
} from '../Interfaces/IGroupData';
import { TransactionsList } from '../Pages/TransactionsList/transactionsList';
import { INotification, Notifications, TypeOfNotifications } from './Notifications';
import { INewMessage, Messenger } from '../Pages/Messenger/Messenger';
import { Contacts, ISearchUserData } from '../Pages/Contacts/Contacts';
import { Help } from '../Pages/Help/Help';
import { Currencies } from './Currencies';

import { i18n } from '@lingui/core';


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
  private helpPage: Help;
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
  }

  async isUserLogin(state: boolean, uid?: string) {
    if (state) {

      await this.getUserLanguage();

      // user signin
      this.layout = Layout.create('#app');
      this.layout.render();

      this.startNotification();

      // SIDEBAR
      this.layout.onSignOut = this.onSignOut.bind(this);
      this.layout.onMainPage = this.onMainPage.bind(this);
      this.layout.onGroupsPage = this.onGroupsPage.bind(this);
      this.layout.onTransactionsPage = this.onTransactionsPage.bind(this);
      this.layout.onHelpPage = this.onHelpPage.bind(this);
      this.layout.onAccountPage = this.onAccountPage.bind(this);
      this.layout.onMessagesPage = this.onMessagesPage.bind(this);
      this.layout.onContactsPage = this.onContactsPage.bind(this);

      this.userHandler = this.database.userHandler(this.layout.setSidebarData);
      this.database.userInfoListener(this.userHandler);

      this.accountPage = AccountPage.create('.main');
      this.accountPage.updateInfo = this.updateOnAccountPage.bind(this);
      this.accountPage.changeTheme = this.changeTheme.bind(this);
      this.accountPage.checkUserID = this.checkUserID.bind(this);
      this.accountPage.onAccountPageChangeLang = this.onAccountPageChangeLang.bind(this);

      this.mainPage = Main.create('.main');
      this.mainPage.getBalanceForSliderGroup = this.getBalanceForSliderGroup.bind(this);

      this.database.getUserInfo(uid, [this.layout.setSidebarData]);

      this.groups = MyGroups.create('.main');
      this.groups.onCreateNewGroup = this.onCreateNewGroup.bind(this);

      this.groups.onAddMember = this.onAddGroupMember.bind(this);
      this.groups.fillContactsList = this.fillContactsList.bind(this);
      this.groups.onAddInfoForModalDetailGroup = this.onAddInfoForModalDetailGroup.bind(this);
      this.groups.addBalanceInGroupPage = this.addBalanceInGroupPage.bind(this);
      this.groups.addUserBalanceInModalCardUser = this.addUserBalanceInModalCardUser.bind(this);
      this.groups.getUserBalanceInGroup = this.getUserBalanceInGroup.bind(this);
      this.groups.changeUserStatusInGroup = this.changeUserStatusInGroup.bind(this);
      this.groups.closeGroup = this.closeGroup.bind(this);
      this.groups.addMemberInDetailGroup = this.addMemberInDetailGroup.bind(this);


      this.transactionsList = TransactionsList.create('.main');
      this.transactionsList.onChangeState = this.onChangeState.bind(this);
      this.transactionsList.onGetTransInfo = this.onGetTransInfo.bind(this);
      this.transactionsList.onEditTransaction = this.onEditTransaction.bind(this);
      this.transactionsList.onDeleteTransaction = this.onDeleteTransaction.bind(this);
      this.transactionsList.onRenderGroupBalance = this.onRenderGroupBalance.bind(this);
      this.transactionsList.onRenderTotalBalance = this.onRenderTotalBalance.bind(this);


      this.messenger = Messenger.create('.main');
      this.messenger.onAddRecipient = this.onAddRecipientToMessage.bind(this);
      this.messenger.sendNewMessage = this.onSendNewMessage.bind(this);
      this.messenger.onAnswerMessage = this.onAnswerMessage.bind(this);
      this.messenger.fillContactsList = this.fillContactsList.bind(this);

      this.contacts = Contacts.create('.main');
      this.contacts.addUserToContacts = this.onAddUserToContacts.bind(this);
      this.contacts.onChangeContactState = this.onChangeContactState.bind(this);
      this.contacts.onDeleteContact = this.onDeleteContact.bind(this);

      this.helpPage = Help.create('.main');

      this.loadCurrentPage();
      this.changeTheme();

    } else {
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
    this.deleteHandlers();
    this.database.signOut();
    this.database.deleteUserInfoListener(this.userHandler);
    this.database.init();

    // Alternative decision

    // window.localStorage.clear();
    // window.indexedDB.deleteDatabase('firebaseLocalStorageDb');
    // window.location.reload();
  }

  onSignIn(email: string, password: string, name: string): void {
    this.database.createUserByEmail(email, password, name, this.regPage.showErrorMessage);
  }

  onLogin(email: string, password: string): void {
    this.database.loginUserByEmail(
      email,
      password,
      this.authPage.showErrorMessage,
    );
  }

  setUserLanguage(lang: string) {
    localStorage.setItem('languageCode', lang);
    i18n.activate(lang);
  }

  async getUserLanguage() {
    await this.database.getCurrentLang(this.database.uid, this.setUserLanguage);
  }

  loadCurrentPage() {
    const currentPage: string = localStorage.getItem('currentPage') || 'Main';
    this[`on${currentPage}Page`]();
  }

  setCurrentPage(name: string): void {
    localStorage.setItem('currentPage', name);
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
    this.setCurrentPage('Main');
    this.deleteHandlers();
    const uid: string = this.database.uid;
    this.mainPage.render();
    this.database.getUserInfo(uid, [this.mainPage.addUserInfo, this.mainPage.renderSlider, this.mainPage.renderSliderItems]);
    this.database.getUserGroups(uid, this.mainPage.renderAvatarsBlockForSlider, this.mainPage.renderOneGroup);
    this.database.getUserTransactions(uid, this.mainPage.renderTransactions);
    this.database.getBalanceForUserTotal(uid, this.mainPage.renderCommonBalance);
    this.database.getBalanceForUserTotal(uid, this.mainPage.renderCurrenciesTable);
  }

  getBalanceForSliderGroup(groupID: string) {
    this.database.getBalanceForUserInGroup(this.database.uid, groupID, this.mainPage.renderGroupBalance);
  }

  updateOnAccountPage(data: any) {
    const uid: string = this.database.uid;
    this.database.updateUserInfo(uid, data);
  }

  onAccountPageChangeLang() {
    this.accountPage.onlineChangingLang();
    this.layout.onlineChangingLang();
  }

  async onAccountPage() {
    this.setCurrentPage('Account');
    this.deleteHandlers();
    const uid: string = this.database.uid;
    this.accountPage.render();
    this.database.getUserInfo(uid, [this.accountPage.addUserInfo]);
    await this.database.getCurrenciesOrLangsOrThemes(uid, this.accountPage.renderCurrenciesInput, 'Currency');
    await this.database.getCurrenciesOrLangsOrThemes(uid, this.accountPage.renderLangOrTheme, 'Language');
    await this.database.getCurrenciesOrLangsOrThemes(uid, this.accountPage.renderLangOrTheme, 'Theme');

    this.accountPage.events();
  }

  checkUserID(userID: string) {
    this.database.isAccountName(userID).then(data => this.accountPage.checkUserAccountNameValidation(data.val()));
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
    this.groups.render();
    this.groupHandler = this.database.groupHandler(this.groups.createGroupList, this.groups.addUserInGroupCard);
    this.database.getGroupList(this.groupHandler);
  }

  onAddInfoForModalDetailGroup(groupId: string, userId: string) {
    this.database.getGroup(groupId, this.groups.addInfoForModalDetailGroup, this.groups.addModalUserData);
    this.database.getBalanceForGroup(groupId, userId, this.groups.addBalanceForModalGroupDetail);
    this.database.getDataForGraphGroupBalance(groupId, this.groups.renderChart());
  }

  addBalanceInGroupPage(groupId: string, userId: string) {
    this.database.getBalanceForGroup(groupId, userId, this.groups.addBalanceInGroupCard);
  }

  addUserBalanceInModalCardUser(data: any) {
    const { userId, groupId } = data;
    this.database.getBalanceForUserInGroup(userId, groupId, this.groups.addUserBalanceInModalDetailGroup);
  }

  getUserBalanceInGroup(data: any) {
    const { userId, groupId } = data;
    this.database.getBalanceForUserInGroup(userId, groupId, this.groups.deleteUserFromGroup);
  }

  changeUserStatusInGroup(data: IDataChangeStatus) {
    this.database.changeStatusUser(data);
    this.notifications.decreaseNotificationMark(TypeOfNotifications.Group);
  }

  closeGroup(data: IDataCloseGroup) {
    this.database.closeGroup(data, this.groups.answerDataBaseForClosedGroup);
  }

  addMemberInDetailGroup(data: IDataAddMember) {
    this.database.addMemberInGroup(data, this.groups.addNewUserInDetailGroup);
  }

  onTransactionsPage() {
    this.setCurrentPage('Transactions');
    this.deleteHandlers();
    this.transactionsList.render();
    this.database.getBalanceForUserTotal(this.database.uid, this.transactionsList.addTotalBalance);
    this.transactionsList.newTrans.onCreateTransaction = this.onCreateTransaction.bind(this);
    this.transactionsList.newTrans.onShowMembersOfGroup = this.onShowMembersOfGroup.bind(this);

    this.transactionsList.newTrans.onRenderGroupBalance = this.onRenderGroupBalanceNewTrans.bind(this);
    this.transactionsList.newTrans.onRenderTotalBalance = this.onRenderTotalBalanceNewTrans.bind(this);

    this.database.getCurrencyList(this.transactionsList.newTrans.addCurrencyList);
    this.database.getGroupsListForTransaction(this.transactionsList.newTrans.addGroupList);
    this.database.getMembersOfGroupFirst(this.transactionsList.newTrans.addMembersOfGroup);
    this.database.getGroupsListForTransaction(this.transactionsList.addGroupToTransList);
    this.transactionHandler = this.database.transactionHandler(this.transactionsList.addTransactionWrapper, this.transactionsList.addMyTransactions, this.transactionsList.addUserToList);
    this.database.getMyTransactionsList(this.transactionHandler);
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

  onHelpPage() {
    this.deleteHandlers();
    this.helpPage.render();
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

  onCreateTransaction(transactionData: any) {
    const toUsd = Currencies.toUSD(transactionData.currency);
    const userList = transactionData.toUserList;
    toUsd(transactionData.totalCost)
      .then(totalCost => {
        transactionData.totalCost = totalCost;
        const queryes = userList.map((user: { cost: any; }) => toUsd(user.cost));
        Promise.all(queryes)
          .then(curCost => {
            curCost.forEach((cost, index) => {
              userList[index].cost = cost;
            });
            this.database.setDataTransaction(transactionData);
          });
      });
  }

  onShowMembersOfGroup(groupID: string) {
    this.database.getMembersOfGroup(
      groupID,
      this.transactionsList.newTrans.addMembersOfGroup,
    );
  }

  onChangeState(state: string, transID: string) {
    this.database.setNewStateTransaction(state, transID);
    if (state === 'approve') {
      this.notifications.decreaseNotificationMark(TypeOfNotifications.Transaction);
    }
  }

  onGetTransInfo(transID: string, groupID: string) {
    this.database.getTransInfoModal(transID, groupID, this.transactionsList.addGroupTitle,
      this.transactionsList.addMemberOfTransaction, this.transactionsList.addOwnerInfo);
  }

  onEditTransaction(editData: any, transID: string, trans: any) {
    const toUsd = Currencies.toUSD(trans.currency);
    const queryes = editData.map((user: { cost: any; }) => toUsd(user.cost));
    Promise.all(queryes)
      .then(curCost => {
        curCost.forEach((cost, index) => {
          editData[index].cost = cost;
        });
        this.database.editTransaction(editData, transID, trans, this.transactionsList.addMyTransactions, this.transactionsList.addUserToList);
      });
  }

  onDeleteTransaction(groupID: string, transID: string) {
    this.database.deleteTransaction(groupID, transID);
  }

  onRenderGroupBalance(groupID: string) {
    this.database.getBalanceForUserInGroup(this.database.uid, groupID, this.transactionsList.addGroupBalance);
  }

  onRenderTotalBalance() {
    this.database.getBalanceForUserTotal(this.database.uid, this.transactionsList.addTotalBalance);
  }

  onRenderGroupBalanceNewTrans(groupID: string) {
    this.database.getBalanceForUserInGroup(this.database.uid, groupID, this.transactionsList.addGroupBalance);
  }

  onRenderTotalBalanceNewTrans() {
    this.database.getBalanceForUserTotal(this.database.uid, this.transactionsList.addTotalBalance);
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
    this.database.changeContactState(contactId, state);
  }

  fillContactsList(selector: string | null = null) {
    const renderContact = this.database.contactsHandler(this.contacts.addContactsToList, selector);
    this.database.getContactsList(renderContact);
  }

  onDeleteContact(contactId: string): void {
    this.database.deleteUserFromContactsList(contactId);
    this.database.deleteUserFromContactsList(this.database.uid, contactId);
    this.notifications.decreaseNotificationMark(TypeOfNotifications.Contact);
  }
}
