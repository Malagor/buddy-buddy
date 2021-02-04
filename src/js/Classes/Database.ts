import firebase from 'firebase';
import 'firebase/auth';
import { default as CyrillicToTranslit } from 'cyrillic-to-translit-js/CyrillicToTranslit';
import { IDataForCreateGroup, IDataChangeStatus, IDataAddMember, IDataCloseGroup } from '../Interfaces/IGroupData';
import { ISearchUserData } from '../Pages/Contacts/Contacts';
import { IMessage, INewMessage } from '../Pages/Messenger/Messenger';
import { IHandlers } from './App';
import { TypeOfNotifications } from './Notifications';
import { Currencies } from './Currencies';

const defaultAvatar: string = require('../../assets/images/default-user-avatar.jpg');

const cyrillicToTranslit = new CyrillicToTranslit();

export class Database {
  public uid: string;
  onUserIsLogin: any;
  private firebase: firebase.app.App;

  constructor(dbConfig: Object) {
    this.firebase = firebase.initializeApp(dbConfig);
  }

  static create(obj?: object) {
    const firebaseConfig = {
      apiKey: 'AIzaSyCkKjHtqY5-St5y701m0MRByEzExRkga44',
      authDomain: 'buddy-buddy-8e497.firebaseapp.com',
      databaseURL: 'https://buddy-buddy-8e497-default-rtdb.firebaseio.com',
      projectId: 'buddy-buddy-8e497',
      storageBucket: 'buddy-buddy-8e497.appspot.com',
      messagingSenderId: '76694259219',
      appId: '1:76694259219:web:df287b978a199c54f2e1e6',
      ...obj,
    };

    return new Database(firebaseConfig);
  }

  init() {
    this.firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        this.uid = user.uid;
        this.onUserIsLogin(true, this.uid);
      } else {
        // No user is signed in.
        this.uid = null;
        this.onUserIsLogin(false);
      }
    });
  }

  createUserByEmail(email: string, password: string, nameUser: string = '', errorHandleFunction: any) {
    const userData = {
      name: nameUser,
      avatar: defaultAvatar,
      account: this._createAccountName(nameUser),
      theme: 'Light',
      language: 'RU',
      currency: 'BYN',
    };

    this.firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((data: { user: { uid: string } }) => {
        const uid: string = data.user.uid;
        // saveUID(uid);
        this._registrationUser(uid, userData);
      })
      .catch(function(error: { code: any; message: any }) {
        console.log(error.code);
        console.log(error.message);
        errorHandleFunction(error.message);
      });
  }

  createUserByGoogle(errorHandleFunction: any): void {
    let provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');

    this.firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {

        const profile: any = result.additionalUserInfo.profile;
        const uid = result.user.uid;
        // saveUID(uid)
        const userData = {
          name: profile.name,
          account: this._createAccountName(profile.name),
          avatar: profile.picture,
          language: profile.locale.toUpperCase(),
          theme: 'Light',
          currency: 'BYN',
        };

        this.hasUser(uid, userData);
        // this._registrationUser(uid, userData);
      })
      .catch(function(error) {
        console.log(error.code);
        console.log(error.message);
        errorHandleFunction(error.message);
      });
  }

  loginUserByEmail(email: string, password: string, errorHandleFunction: any): void {
    this.firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(function(error) {
        console.log(error.code);
        console.log(error.message);
        errorHandleFunction(error.message);
      });
  }

  protected _registrationUser(uid: string, data: object) {
    this.firebase
      .database()
      .ref(`User/${uid}`)
      .set(data);
  }

  getUserInfo(uid: string, callbacks: any[]) {
    this.firebase
      .database()
      .ref(`User/${uid}`)
      .once('value', (snapshot) => {
          const dataUser = snapshot.val();
          dataUser.key = uid;
          callbacks.forEach((fn) => fn(dataUser));
        },
        (error: { code: string }) => {
          console.log('Error: ' + error.code);
        });
  }

  updateUserInfo(uid: string, data: any) {
    const userRef = this.firebase.database().ref(`User/${uid}`);
    const file = data['avatar'];

    if (typeof file === 'string') {
      userRef.update(data);
      return;
    }
    const fileExtension = file.name.slice(file.name.lastIndexOf('.'));
    const storageRef = this.firebase.storage().ref(`avatars/${uid}${fileExtension}`);


    const metadata = {
      'contentType': file.type,
    };

    storageRef.put(file, metadata).then((snapshot) => {
      snapshot.ref.getDownloadURL()
        .then((url) => {
          data['avatar'] = url;
          userRef.update(data);
        })
        .catch(error => {
          console.log(error.code);
          console.log(error.message);
        });
    });
  }

  async getUserTransactions(uid: string, callback: any) {
    const dat: any = await this.firebase
      .database()
      .ref(`User/${uid}/transactionList`)
      .once('value', (snapshot) => snapshot);
    const dataUser: any = dat.val() || [];
    const keyList: any = Object.entries(dataUser)
      .map(async (item: any) => {
        const trans: any = await this.firebase
          .database()
          .ref(`Transactions/${item[0]}`)
          .once('value', (snapshot) => snapshot);
        item[0] = trans.val();
        return item;
      });

    await Promise.all(keyList).then(async (data) => {
      const value: any = await data.filter((item: any) => item[0] !== null && item[1].state === 'approve')
        .map((item: any) => item[0])
        .map(async (item: any) => {
          item.uid = uid;
          item.toUserList = Object.entries(item.toUserList);
          const request: any = await this.firebase
            .database()
            .ref(`Groups/${item.groupID}`)
            .once('value', (snapshot) => snapshot);
          item.groupTitle = request.val().title;
          return item;
        });

      await Promise.all(value).then((data) => {
        data.reverse();
        callback(data, this.uid);
      });
    });
  }

  async getUserGroups(uid: string, callback: any, callback2: any) {
    const dat: any = await this.firebase
      .database()
      .ref(`User/${uid}/groupList`)
      .once('value', (snapshot) => snapshot);
    const dataUser: any = dat.val() || [];
    const keyList: any = Object.entries(dataUser)
      .map(async (item: any) => {
        const groups: any = await this.firebase
          .database()
          .ref(`Groups/${item[0]}`)
          .once('value', (snapshot) => snapshot);
        item[2] = groups.val();
        return item;
      });
    const currentGroups: any = await this.firebase
      .database()
      .ref(`User/${uid}`)
      .once('value', (snapshot) => snapshot);

    keyList.push(currentGroups.val().currentGroup);

    await Promise.all(keyList).then(async (data) => {
      const currentUserGroup = data.slice(-1)[0];
      const value: any = data.slice(0, -1)
        .filter((item: any) => item[1].state === 'approve')
        .map((item: any) => {
          item[2].userList = Object.entries(item[2].userList);
          item[2].groupID = item[0];
          return item[2];
        })
        .map(async (item: any, index: number) => {
          const elem: any = await item.userList
            .filter((item: any[]) => item[1].state === 'approve')
            .map(async (it: any) => {
              const res: any = await this.firebase
                .database()
                .ref(`User/${it[0]}`)
                .once('value', (snapshot) => snapshot);
              it = res.val().avatar;
              return it;
            });
          await Promise.all(elem).then((userList: any) => {
            if (userList.length) callback2(callback(userList), index, item, value.length, currentUserGroup);
          });
        });
    });
  }

  hasUser(uid: string, callback: any) {
    this.firebase
      .database()
      .ref(`User/${uid}`)
      .once('value', (snapshot) => {
        if (!snapshot.key) {
          callback(snapshot.val());
        }
      }, (error: { code: string; message: string }) => {
        console.log('Error: ' + error.code);
        console.log('Message: ' + error.message);
      });
  }

  signOut() {
    this.firebase
      .auth()
      .signOut()
      .then(function() {}, function(error) {
        console.log(error.code);
        console.log(error.message);
      });
  }

  findUserByName(accountName: string, handlerFunc: any, errorFunc?: any) {
    this.firebase
      .database()
      .ref(`User`)
      .orderByChild('account')
      .equalTo(accountName)
      .once('value')
      .then((snapshot) => {
        const key = Object.keys(snapshot.val());

        const data = {
          name: snapshot.val()[`${key}`].name,
          avatar: snapshot.val()[`${key}`].avatar,
          account: snapshot.val()[`${key}`].account,
          key: key,
        };
        handlerFunc(data);
      })
      .catch((error) => {
        console.log(error.code);
        console.log(error.message);
        if (errorFunc) {
          errorFunc(`Error retrieving user data.`);
        }
      });
  }

  findUserById(userId: string, handlerFunc: any, errorFunc?: any) {
    this.firebase
      .database()
      .ref(`User/${userId}`)
      .once('value', (snapshot) => {
        const key = snapshot.key;

        const data = {
          name: snapshot.val().name,
          avatar: snapshot.val().avatar,
          account: snapshot.val().account,
          key: key,
        };
        handlerFunc(data);
      })
      .catch(error => {
        console.log(error.code);
        console.log(error.message);
        if (errorFunc) {
          errorFunc(`Error retrieving user data.`);
        }
      });
  }

  _createAccountName(name: string): string {
    let accountName: string = cyrillicToTranslit.transform(name).toLowerCase();
    accountName += (Math.floor(Math.random() * (999 + 1)) + 1).toString();
    accountName = accountName.replace(' ', '');
    return accountName;
  }

  createNewGroup(data: IDataForCreateGroup) {
    const file: File = data.groupData.icon;
    let currentGroup: boolean = data.currentGroup;
    const userIdAuthor: string = data.userId;

    this.firebase
      .database()
      .ref(`User/${data.userId}/groupList`)
      .once('value', (snapshot) => {
        if (!snapshot.val()) {
          currentGroup = true;
        }
      });

    const sendDataInDB = (data: any) => {
      const userObj: any = {};

      data.userList.forEach((userId: string) => {

        if (userId === userIdAuthor) {
          data.groupData.author = userIdAuthor;
          userObj[userId] = { state: 'approve' };
        } else {
          userObj[userId] = { state: 'pending' };
        }
      });

      data.groupData['userList'] = userObj;

      this.firebase
        .database()
        .ref('Groups')
        .push(data.groupData)
        .then(group => {
          const groupKey = group.key;
          this.firebase
            .database()
            .ref(`Groups/${groupKey}`)
            .once('value', (group) => {
              const users: any = group.val().userList;

              Object.keys(users).forEach((userId: any) => {
                if (userId === userIdAuthor) {
                  this.firebase.database()
                    .ref(`User/${userId}/groupList/${groupKey}`)
                    .set({ state: 'approve' });
                } else {
                  this.firebase.database()
                    .ref(`User/${userId}/groupList/${groupKey}`)
                    .set({ state: 'pending' });
                }

              });
            });
          return group;
        })
        .then(data => {
          const dataForAddCurrentGroup = {
            groupKey: data.key,
            userId: userIdAuthor,
          };
          if (currentGroup) {
            this.addCurrentGroup(dataForAddCurrentGroup);
          }
        })
        .catch(error => {
          console.log(error.code);
          console.log(error.message);
        });
    };

    if (file) {
      const metadata = {
        'contentType': file.type,
      };

      this.firebase.storage()
        .ref()
        .child('groups/' + file.name)
        .put(file, metadata)
        .then((snapshot) => {
          snapshot.ref.getDownloadURL()
            .then((url) => {
              data.groupData['icon'] = url;
              return data;
            })
            .then((data) => {
              sendDataInDB(data);
            });
        });
    } else {
      sendDataInDB(data);
    }
  }

  getGroup(groupId: string, addModalGroupData: any, addModalUserData: any) {
    const data: any = {};
    data.thisUid = this.uid;

    this.firebase
      .database()
      .ref(`Groups/${groupId}`)
      .once('value', (snapshot) => {
        data.dataGroup = snapshot.val();
        data.groupId = snapshot.key;
        addModalGroupData(data);
      }).then(() => {
      const userList = Object.keys(data.dataGroup.userList);

      userList.forEach((user: string) => {
        this.firebase
          .database()
          .ref(`User/${user}`)
          .once('value', (snapshot) => {
            data.user = snapshot.val();
            data.userId = snapshot.key;
            addModalUserData(data);
          });
      });
    });
  }

  getGroupList(handlerFunc: any): void {
    this.firebase
      .database()
      .ref('Groups')
      .on('child_added', (handlerFunc));
  }

  groupHandler = (createGroupList: any, addUserInGroupCard: any) => {
    const base = this.firebase.database();

    return ((snapshot: any) => {
      const userLIstInGroup = Object.keys(snapshot.val().userList);

      if (userLIstInGroup.includes(this.uid)) {
        const groupKey = snapshot.key;
        const data: any = {
          dataGroup: snapshot.val(),
          groupKey: groupKey,
          thisUid: this.uid
        };

        createGroupList(data);

        base
          .ref('User')
          .once('value', (snapshot) => {
            const snapshotUser = snapshot.val();
            const userList = Object.keys(snapshotUser);

            const arrayUsers: any[] = [];
            userList.forEach(user => {
              if (userLIstInGroup.includes(user)) {
                const userInfoObj = snapshotUser[user];
                userInfoObj.userId = user;
                arrayUsers.push(userInfoObj);
              }
            });
            data.arrayUsers = arrayUsers;

            addUserInGroupCard(data);
          }, (error: { code: string; message: any; }) => {
            console.log('Error:\n ' + error.code);
            console.log(error.message);
          });
      }
    });
  }

  getBalanceForGroup(groupId: string, userId: string, renderFn: any) {
    const base = this.firebase.database();

    base.ref(`User/${userId}/currency`)
    .once('value', (snapshot) => {
      const curr = snapshot.val();

      Currencies.getCurrencyRateByCode(curr).then(coefficientCurr => {
        this.getBalanceInGroup(groupId, coefficientCurr, renderFn, null, curr);
      });
    });
  }

  getBalanceForUser(data: any, fn: any) {
    const { userId, groupId, thisUid } = data;
    const base = this.firebase.database();

    base.ref(`User/${thisUid}/currency`)
    .once('value', (snapshot) => {
      const curr = snapshot.val();

      Currencies.getCurrencyRateByCode(curr).then(coefficientCurr => {
        const getDataBalance = (data: any) => {
          data.currency = curr;
          data.balance = coefficientCurr *  data.balance;
          fn(data);
        };
        this.getBalanceForUserInGroup(userId, groupId, getDataBalance);
      });
    });
  }

  addCurrentGroup(data: any) {
    const userIdAuthor: string = data.userId;
    const groupKey = data.groupKey;

    this.firebase
      .database()
      .ref(`User/${userIdAuthor}/currentGroup`)
      .set(groupKey);
  }

  changeStatusUser(data: IDataChangeStatus) {
    console.log('changeStatusUser');
    const { userId, groupId, state } = data;

    const updates = {};
    updates[`Groups/${groupId}/userList/${userId}/state/`] = state;
    updates[`User/${userId}/groupList/${groupId}/state/`] = state;

    return firebase.database().ref().update(updates);
  }

  clearCurrentGroup(userId: string, groupId: string) {
    const dataBase =  this.firebase.database();

    dataBase
    .ref(`User/${userId}/currentGroup/`)
    .once('value', (snapshot) => {
      const currentGroup = snapshot.val();

      if (currentGroup === groupId) {
        dataBase
          .ref(`User/${userId}/currentGroup/`)
          .remove();
      }
    });
  }

  closeGroup(data: IDataCloseGroup, renderFunction: any) {
    const {userList, groupId} = data;
    const dataBase =  this.firebase.database();

    const changeStatusUserAndGroupListToClosed = (userList: string[]) => {
      userList.forEach((userId) => {
        const dataForChangeStatusUser = {
          userId: userId,
          groupId: groupId,
          state: 'closed'
        };
        this.changeStatusUser(dataForChangeStatusUser);
      });
    };

    const addDateClosedForGroup = (groupId: string) => {
      dataBase
        .ref(`Groups/${groupId}/dateClose/`)
        .set(Date.now());
    };

    const closeTransactions = (groupId: string) => {
      dataBase
        .ref(`Groups/${groupId}/transactions/`)
        .once('value', (transactionsList) => {
          const transactionsListArray = transactionsList.val();

          if (transactionsListArray) {
            transactionsListArray.forEach((transaction: string) => {
              dataBase
                .ref(`Transactions/${transaction}/state`)
                .set('closed');

              dataBase
              .ref(`Transactions/${transaction}/`)
              .once('value', (transactions) => {
                const transactionId = transactions.key;
                const transactionInfo = transactions.val();

                const transactionUserList = Object.keys(transactionInfo.toUserList);
                transactionUserList.forEach((userId: string) => {
                  dataBase
                    .ref(`User/${userId}/transactionList/${transactionId}/state`)
                    .set('closed');
                });

              });
            });
          }

        });
    };

    const closeGroupChangeDataBase = (data: any, fn = renderFunction) => {
      const { balance, groupId } = data;

      if (balance === 0) {
        changeStatusUserAndGroupListToClosed(userList);
        addDateClosedForGroup(groupId);
        closeTransactions(groupId);

        fn(true, groupId);
      } else {
        fn(false);
      }
    };

    this.getBalanceInGroup(groupId, 1, closeGroupChangeDataBase);
  }

  addMemberInGroup(data: IDataAddMember, addNewUserInDetailGroup: any) {
    const base = this.firebase.database();
    const userTable = base.ref('User');
    let errorData: string | null = null;

    const addUserInPageAndBD = (userKey: string) => {
      const dataForChangeStatusUser: IDataChangeStatus = {
        userId: userKey,
        groupId: data.groupId,
        state: 'pending',
      };
      this.changeStatusUser(dataForChangeStatusUser);

      base
        .ref(`User/${userKey}/`)
        .once('value', (userInfo) => {
          const userDetainInfo = {
            userId: userInfo.key,
            user: userInfo.val(),
            groupId: data.groupId,
          };
          addNewUserInDetailGroup(userDetainInfo, errorData);
        });
    };

    userTable
      .once('value', (userList) => {
        const userObj = userList.val();
        const keysList = Object.keys(userObj);
        const ArrayUserKey: string[] = keysList.filter(key => {
          if (userObj[key].account === data.account) return key;

          return false;
        });

        const userKey = ArrayUserKey[0]; // id user

        if (!userKey) {
          errorData = 'User is missing';
          addNewUserInDetailGroup(data, errorData);
        } else {
          base
            .ref(`Groups/${data.groupId}/userList/`)
            .once('value', (userList) => {
              const userListObj = userList.val();
              const arrUsersId = Object.keys(userListObj);
              const userInfo = userListObj[userKey];

              if (arrUsersId.includes(userKey)) {
                const stateUser = userInfo.state;
                if (stateUser === 'approve' || stateUser === 'pending') {
                  errorData = 'The user is in the group';
                  addNewUserInDetailGroup(userInfo, errorData);
                } else {
                  addUserInPageAndBD(userKey);
                }
              } else {
                addUserInPageAndBD(userKey);
              }
            });
        }
      });
  }

  countGroupsInvite(setNotificationMark: { (type: TypeOfNotifications, num: number): void; (arg0: TypeOfNotifications, arg1: number): void; }): void {
    this.firebase
      .database()
      .ref('Groups')
      .on('child_added', snapshot => {
        const userList = snapshot.val().userList;
        Object.keys(userList).forEach(user => {
          if (user === this.uid && userList[user].state === 'pending') {
            setNotificationMark(TypeOfNotifications.Group, 1);
          }
        });
      }, (error: { code: string; message: any; }) => {
        console.log('Error:\n ' + error.code);
        console.log(error.message);
      });
  }

  countTransactionInvite(setNotificationMark: { (type: TypeOfNotifications, num: number): void; (arg0: TypeOfNotifications, arg1: number): void; }): void {
    this.firebase
      .database()
      .ref('Transactions')
      .on('child_added', snapshot => {
        const userList = snapshot.val().toUserList;
        Object.keys(userList).forEach(user => {
          if (user === this.uid && userList[user].state !== 'approve') {
            // if (user === this.uid) {
            setNotificationMark(TypeOfNotifications.Transaction, 1);
          }
        });
      }, (error: { code: string; message: any; }) => {
        console.log('Error:\n ' + error.code);
        console.log(error.message);
      });
  }

  countContactsInvite(setNotificationMark: { (type: TypeOfNotifications, num: number): void; (arg0: TypeOfNotifications, arg1: number): void; }): void {
    this.firebase.database()
      .ref(`User/${this.uid}/contacts`)
      .on('child_added', snapshot => {
        if (snapshot.val().state === 'pending') {
          setNotificationMark(TypeOfNotifications.Contact, 1);
        }
      }, (error: { code: string; message: any; }) => {
        console.log('Error:\n ' + error.code);
        console.log(error.message);
      });
  }

  countNewMessage(setNotificationMark: { (type: TypeOfNotifications, num: number): void; (arg0: TypeOfNotifications, arg1: number): void; }): void {
    this.firebase
      .database()
      .ref('Messages')
      .on('child_added', (snapshot) => {
        const toUser: string = snapshot.val().toUser;
        const status: boolean = snapshot.val().isRead;

        if (toUser === this.uid && status === false) {
          setNotificationMark(TypeOfNotifications.Message, 1);
        } else {
          setNotificationMark(TypeOfNotifications.Message, 0);
        }
      });
  }

  deleteHandlers(handlers: IHandlers) {
    const base = this.firebase.database();

    if (handlers.messages) {
      base.ref('Messages')
        .off('child_added', handlers.messages);
    }

    if (handlers.groups) {
      base.ref('Groups')
        .off('child_added', handlers.groups);
    }

    if (handlers.transactions) {
      base.ref('Transactions')
        .off('child_added', handlers.transactions);
    }

    if (handlers.contacts) {
      base.ref(`User/${this.uid}/contacts`)
        .off('child_added', handlers.contacts);
    }
  }

  getMessageList(addMessageToListFunc: { (snapshot: any): void; (a: firebase.database.DataSnapshot, b?: string): any; }): void {
    this.firebase
      .database()
      .ref('Messages')
      .on('child_added', addMessageToListFunc,
        (error: { code: string; message: any }) => {
          console.log('Error:\n ' + error.code);
          console.log(error.message);
        });
  }

  messageHandler = (renderMessage: (arg0: IMessage) => void,
                    setUserData: (arg0: { messageId: any; key: any; name: any; avatar: any; isReceive: boolean; }) => void) => {

    const uid = this.uid;
    const base = this.firebase.database();

    return (snapshot: { val: () => any; key: any }) => {
      const messageObj = snapshot.val();
      const messageId = snapshot.key;
      const { fromUser, toUser } = messageObj;

      if (fromUser === uid || toUser === uid) {
        let isReceive: boolean = toUser === uid;

        const messageData: IMessage = {
          messageId,
          message: messageObj.message,
          date: messageObj.date,
          isRead: messageObj.isRead,
          isReceive,
        };

        renderMessage(messageData);

        const secondUserId = isReceive ? fromUser : toUser;

        base.ref(`User/${secondUserId}`)
          .once('value', (userData: { key: any; val: () => { (): any; new(): any; name: any; avatar: any; }; }) => {
            const userDataForMessage = {
              messageId,
              key: userData.key,
              name: userData.val().name,
              avatar: userData.val().avatar,
              isReceive,
            };
            setUserData(userDataForMessage);
          });

        // if user get and read message, status is toggle to "true"
        if (isReceive) {
          base.ref(`Messages/${messageId}`)
            .child('isRead')
            .transaction((curStatus: boolean) => {
              curStatus = true;
              return curStatus;
            });
        }
      }
    };
  }

  contactsHandler = (renderContact: any, selector?: string | null): any => {
    return (snapshot: any): void => {
      if (snapshot) {
        const key: string = snapshot.key;
        const state = snapshot.val().state;

        this.firebase
          .database()
          .ref(`User/${key}`)
          .once('value', snapshot => {
            const userData = snapshot.val();
            userData.key = key;
            userData.state = state;
            if (selector) {
              userData.selector = selector;
            }
            if (state !== 'decline') {
              renderContact(userData);
            }
          });
      }
    };
  }

  userHandler = (renderUserInfo: any): (snapshot: any) => void => {

    return (snapshot: any): void => {
      if (!snapshot) return;
      const key = snapshot.key;
      const value = snapshot.val();
      const userData = {
        [key]: value,
      };
      renderUserInfo(userData);
    };
  }

  userInfoListener(userHandler: (snapshot: any) => void, errorHandler?: (message: string) => void): void {
    this.firebase.database()
      .ref(`User/${this.uid}`)
      .on('child_changed', userHandler,
        (error: { message: string; code: any; }) => {
          if (errorHandler) {
            errorHandler(error.message);
          } else {
            console.log(error.code);
            console.log(error.message);
          }
        });
  }

  deleteUserInfoListener(userHandler: (snapshot: any) => void): void {
    this.firebase.database()
      .ref(`User/${this.uid}`)
      .off('child_changed', userHandler);
  }


  getContactsList(renderContact: any): void {
    const base = this.firebase.database();
    const uid = this.uid;

    base
      .ref(`User/${uid}`)
      .child('contacts')
      .on('child_added', renderContact,
        (error: { code: string; message: any; }) => {
          console.log('Error:\n ' + error.code);
          console.log(error.message);
        });
  }

  changeContactState(contsctId: string, newState: string, userId?: string): void {
    let uid: string;
    if (userId) {
      uid = userId;
    } else {
      uid = this.uid;
    }
    this.firebase.database()
      .ref(`User/${uid}/contacts/${contsctId}`)
      .transaction(state => {
        state = { state: newState };
        return state;
      });
  }

  deleteUserFromContactsList(contactId: string, userId?: string) {
    let user: string;

    if (userId) {
      user = userId;
    } else {
      user = this.uid;
    }

    this.firebase.database()
      .ref(`User/${user}/contacts/${contactId}`)
      .remove(error => {
        if (error) {
          console.log(error.message);
        }
      });

  }

  createNewMessage(data: INewMessage): void {
    data.fromUser = this.uid;

    this.firebase
      .database()
      .ref('Messages')
      .push(data)
      .catch((error: { code: string; message: any }) => {
        console.log('Error:\n ' + error.code);
        console.log(error.message);
      });
  }

  async getCurrenciesOrLangsOrThemes(uid: string, callback: any, elem: string) {
    const neededField = elem.toLowerCase();
    const curr: any = await this.firebase
      .database()
      .ref(elem)
      .once('value', (snapshot) => {
        return snapshot;
      }, (error: { code: string; message: any }) => {
        console.log('Error:\n ' + error.code);
        console.log(error.message);
      });
    const values = Object.entries(curr.val());
    const current: any = await this.firebase
      .database()
      .ref(`User/${uid}`)
      .once('value', (snapshot) => {
        return snapshot;
      }, (error: { code: string; message: any }) => {
        console.log('Error:\n ' + error.code);
        console.log(error.message);
      });
    const currentCurrency = current.val()[neededField];
    callback(values, currentCurrency);
  }

  async getCurrentLang(uid: string, callback: (lang: string) => void) {
    await this.firebase
      .database()
      .ref(`User/${uid}/language`)
      .once('value', (snapshot) => {
        const lang: string = snapshot.val();
        callback(lang);
      }, (error: { code: string; message: any }) => {
        console.log('Error:\n ' + error.code);
        console.log(error.message);
      });
  }

  // запросы по транзакциям
  getCurrencyList(renderCurrencyList: any): void {
    this.firebase
      .database()
      .ref(`User/${this.uid}`)
      .once('value', (snapshot) => {
        const currCurrency = snapshot.val().currency;
        this.firebase
          .database()
          .ref('Currency')
          .once('value', (snapshot) => {
            const currList: string[] = Object.keys(snapshot.val());
            renderCurrencyList(currList, currCurrency);
          });
      }, (error: { code: string; message: any; }) => {
        console.log('Error:\n ' + error.code);
        console.log(error.message);
      });
  }

  getGroupsListForTransaction(renderGroupList: any): void {
    this.firebase
      .database()
      .ref(`User/${this.uid}`)
      .once('value', (snapshot) => {
        if (!snapshot.val().groupList) return;
        const groupsIDList: string[] = Object.keys(snapshot.val().groupList);
        const groupsState: any[] = Object.values(snapshot.val().groupList);
        let currGroup = snapshot.val().currentGroup;
        if (!currGroup) {
          currGroup = groupsIDList[0];
        }
        groupsIDList.forEach((groupID: any, index: number) => {
          if (groupsState[index].state === 'approve') {
            this.firebase
              .database()
              .ref(`Groups/${groupID}`)
              .once('value', (snapshot) => {
                if (!snapshot.val().dateClose) {
                  renderGroupList(groupID, snapshot.val().title, currGroup);
                }
              });
          }
        });
      }, (error: { code: string; message: any }) => {
        console.log('Error:\n ' + error.code);
        console.log(error.message);
      });
  }

  getMembersOfGroupFirst(renderMembers: { (userID: string, userName: string, userAvatar: string): void; (arg0: string, arg1: any, arg2: any): void; }) {
    this.firebase
      .database()
      .ref(`User/${this.uid}`)
      .once('value', (snapshot) => {
        let currGroup = snapshot.val().currentGroup;
        if (!snapshot.val().groupList) return;
        if (!currGroup) {
          currGroup = Object.keys(snapshot.val().groupList)[0];
        }
        this.firebase
          .database()
          .ref(`Groups/${currGroup}`)
          .once('value', (snapshot) => {
            const memberList: string[] = Object.keys(snapshot.val().userList);
            const memberState: any[] = Object.values(snapshot.val().userList);
            memberList.forEach((userID, index) => {
              if (memberState[index].state === 'approve') {
                this.firebase
                  .database()
                  .ref(`User/${userID}`)
                  .once('value', (snapshot) => {
                    renderMembers(snapshot.key, snapshot.val().name, snapshot.val().avatar);
                  });
              }
            });
          });
      }, (error: { code: string; message: any }) => {
        console.log('Error:\n ' + error.code);
        console.log(error.message);
      });
  }

  getMembersOfGroup(groupID: string, renderMembers: any) {
    this.firebase
      .database()
      .ref(`Groups/${groupID}`)
      .once('value', (snapshot) => {
        const memberList: string[] = Object.keys(snapshot.val().userList);
        const memberState: any[] = Object.values(snapshot.val().userList);
        memberList.forEach((userID, index) => {
          if (memberState[index].state === 'approve') {
            this.firebase
              .database()
              .ref(`User/${userID}`)
              .once('value', (snapshot) => {
                renderMembers(snapshot.key, snapshot.val().name, snapshot.val().avatar);
              });
          }
        });
      }, (error: { code: string; message: any }) => {
        console.log('Error:\n ' + error.code);
        console.log(error.message);
      });
  }

  setDataTransaction(data: any) {
    const base = this.firebase.database();
    const userRef = base.ref('User');
    const transRef = base.ref('Transactions');
    const groupRef = base.ref('Groups');
    const storageRef = this.firebase.storage().ref();

    data.toUserList.forEach((user: any) => {
      if (user.userID === this.uid) {
        user.state = 'approve';
      }
    });

    const toUserList: { [k: string]: any } = {};
    data.toUserList.forEach((user: { cost: any; comment: any; state: any; costFix: any; userID: string; }) => {
      const userId: string = user.userID;
      toUserList[userId] = {
        cost: user.cost,
        comment: user.comment,
        state: user.state,
        costFix: user.costFix,
      };
    });

    const setData = {
      userID: this.uid,
      date: data.date,
      totalCost: data.totalCost,
      description: data.description,
      currency: data.currency,
      groupID: data.groupID,
      state: 'opened',
      toUserList,
    };
    const transKey = transRef.push(setData).key;

    data.toUserList.forEach((user: any) => {
      userRef.child(`${user.userID}/transactionList/${transKey}/state`)
        .set(user.state)
        .catch(error => {
          console.log('Error: ' + error.code);
        });
    });

    userRef.child(`${this.uid}/transactionList/${transKey}/state`)
          .set('approve')
          .catch(error => {
            console.log('Error: ' + error.code);
      });

    groupRef.child(`${data.groupID}/transactions`)
      .transaction(list => {
        if (list) {
          list.push(transKey);
          return list;
        } else {
          let arrTrans: string[] = [];
          arrTrans.push(transKey);
          return arrTrans;
        }
      })
      .catch(error => {
        console.log('Error: ' + error.code);
      });

    const files: any[] = data.photo;
    files.forEach((file, i) => {
      const metadata = {
        'contentType': file.type,
      };
      const hashName = Date.now().toString();
      const extension = file.name.slice(file.name.lastIndexOf('.'));
      storageRef.child(`transactions/${hashName}${extension}`)
        .put(file, metadata)
        .then((snapshot) => {
          snapshot.ref.getDownloadURL()
            .then((url) => {
              transRef.child(`${transKey}/photo/${i}`)
                .set(url);
            });
        })
        .catch(error => {
          console.log('Error: ' + error.code);
        });
    });
  }

  getMyTransactionsList(addFunction: any): void {
    const base = this.firebase.database();
    const userRef = base.ref('User');
    userRef.child(`${this.uid}/transactionList`)
      .on('child_added', addFunction, (error: { code: string; message: any; }) => {
        console.log('Error:\n ' + error.code);
        console.log(error.message);
      });
  }

  transactionHandler = (renderWrapper: any, renderTransaction: any, renderUser: any) => {
    const base = this.firebase.database();
    const userRef = base.ref('User');
    const transRef = base.ref('Transactions');
    return (snapshot: any) => {
      const transID = snapshot.key;
      renderWrapper(transID);
      transRef.child(`${transID}`)
        .once('value', (snapshot) => {
          const trans = snapshot.val();
          if (trans.state !== 'opened') return;
          const userIDList: string[] = Object.keys(snapshot.val().toUserList);
          const userList: any[] = Object.values(snapshot.val().toUserList);
          const fromUsd = Currencies.fromUSD(trans.currency);
          if (snapshot.val().userID === this.uid) {
            fromUsd(trans.totalCost)
              .then(totalCost => {
                trans.totalCost = totalCost;
                const queryes = userList.map((user: any) => fromUsd(user.cost));
                Promise.all(queryes)
                  .then(curCost => {
                    curCost.forEach((cost, index) => {
                      trans.toUserList[userIDList[index]].cost = cost;
                    });
                    renderTransaction(transID, trans, true, this.uid);
                    const numbOfUsers = userIDList.length;
                    userIDList.forEach((userID: any) => {
                      userRef.child(`${userID}`)
                        .once('value', (snapshot) => {
                          const user = {
                            id: snapshot.key,
                            userName: snapshot.val().name,
                            avatar: snapshot.val().avatar,
                          };
                          renderUser(transID, user, numbOfUsers, true);
                        });
                    });
                  });
              });
          } else if (Object.keys(snapshot.val().toUserList).some((user: any) => user === this.uid)) {
            fromUsd(trans.totalCost)
              .then(totalCost => {
                trans.totalCost = totalCost;
                const queryes = userList.map((user: any) => fromUsd(user.cost));
                Promise.all(queryes)
                  .then(curCost => {
                    curCost.forEach((cost, index) => {
                      trans.toUserList[userIDList[index]].cost = cost;
                    });
                    renderTransaction(transID, trans, false, this.uid);
                    const userID = trans.userID;
                    userRef.child(`${userID}`)
                      .once('value', (snapshot) => {
                        const user = {
                          id: snapshot.key,
                          userName: snapshot.val().name,
                          avatar: snapshot.val().avatar,
                        };
                        renderUser(transID, user, 0, false);
                      });
                  });
              });
          } else return;
        })
        .catch(error => {
          console.log('Error: ' + error.code);
        });
    };
  }

  setNewStateTransaction(state: string, transID: string): void {
    const base = this.firebase.database();
    const userRef = base.ref('User');
    const refTrans = base.ref(`Transactions/${transID}/toUserList/${this.uid}/state`);
    refTrans.set(state)
      .catch(error => {
        console.log('Error: ' + error.code);
      });

    userRef.child(`${this.uid}/transactionList/${transID}/state`)
    .set(state)
      .catch(error => {
        console.log('Error: ' + error.code);
      });
  }

  getUserInfoTrans(uid: string, callback: any): any {
    this.firebase
      .database()
      .ref(`User/${uid}`)
      .once('value', (snapshot) => {
        const dataUser = snapshot.val();
        dataUser.key = uid;
        callback(dataUser);
      }, (error: { code: string; }) => {
        console.log('Error: ' + error.code);
      });
  }

  getTransInfoModal(transID: string, groupID: string, renderGroupTitle: any, renderUser: any, renderOwner: any) {

    this.firebase.database().ref(`Transactions/${transID}/`)
      .once('value', (snapshot) => {
        const trans: any = snapshot.val();
        const userIDList: string[] = Object.keys(snapshot.val().toUserList);
        const userListTrans: any[] = Object.values(snapshot.val().toUserList);
        const fromUsd = Currencies.fromUSD(trans.currency);
        fromUsd(trans.totalCost)
            .then(totalCost => {
              trans.totalCost = totalCost;
              const queryes = userListTrans.map((user: any) => fromUsd(user.cost));
              Promise.all(queryes)
                .then(curCost => {
                  curCost.forEach((cost, index) => {
                    trans.toUserList[userIDList[index]].cost = cost;
                  });
                  this.firebase.database().ref(`Groups/${groupID}`)
                  .once('value', (snapshot) => {
                    const title = snapshot.val().title;
                    renderGroupTitle(groupID, title);
                    const userList: any[] = Object.keys(snapshot.val().userList);
                    const userState: any[] = Object.values(snapshot.val().userList);
                    userList.forEach((userID: string, index: number) => {
                      if (userState[index].state === 'approve') {
                        this.firebase
                        .database()
                        .ref(`User/${userID}`)
                        .once('value', (snapshot) => {
                          const dataUser = snapshot.val();
                          dataUser.key = userID;
                          renderUser(trans, dataUser);
                        });
                      }
                    });
                  }, (error: { code: string; }) => {
                    console.log('Error: ' + error.code);
                  });
                  this.firebase
                    .database()
                    .ref(`User/${trans.userID}`)
                    .once('value', (snapshot) => {
                        renderOwner(snapshot.val());
                    }, (error: { code: string; }) => {
                      console.log('Error: ' + error.code);
                    });
                });
            });
      }, (error: { code: string; }) => {
        console.log('Error: ' + error.code);
      });
  }

  editTransaction = (editData: any, transID: string, trans: any, renderTransaction: any, renderUser: any) => {
    const base = this.firebase.database();
    const userRef = base.ref('User');
    const transRef = base.ref('Transactions');
    const oldUsersID = Object.keys(trans.toUserList);
    const newUsers = editData.map((user: any) => user.userID);
    editData.forEach((newUser: any) => {
      const newData = {
        cost: newUser.cost,
        comment: newUser.comment,
        state: newUser.state,
        costFix: newUser.costFix,
      };
      if (newUser.userID === this.uid) {
        newData.state = 'approve';
      }
      transRef.child(`${transID}/toUserList/${newUser.userID}`)
        .set(newData)
        .catch(error => {
          console.log('Error: ' + error.code);
        });

      userRef.child(`${newUser.userID}/transactionList/${transID}/state`)
        .set(newUser.state)
        .catch(error => {
          console.log('Error: ' + error.code);
        });
    });

    oldUsersID.forEach((oldUser: string) => {
      if (!newUsers.includes(oldUser)) {
        transRef.child(`${transID}/toUserList/${oldUser}`)
          .remove(error => {
            if (error) {
              console.log(error.message);
            }
          });

        userRef.child(`${oldUser}/transactionList/${transID}`)
          .remove(error => {
            if (error) {
              console.log(error.message);
            }
          });
      }
    });

    setTimeout(() => {
      base.ref(`Transactions/${transID}`)
      .once('value', (snapshot) => {
        const newTrans = snapshot.val();
        const userIDList: string[] = Object.keys(snapshot.val().toUserList);
        const userList: any[] = Object.values(snapshot.val().toUserList);
        const fromUsd = Currencies.fromUSD(newTrans.currency);
        fromUsd(newTrans.totalCost)
        .then(totalCost => {
          newTrans.totalCost = totalCost;
          const queryes = userList.map((user: any) => fromUsd(user.cost));
          Promise.all(queryes)
            .then(curCost => {
              curCost.forEach((cost, index) => {
                newTrans.toUserList[userIDList[index]].cost = cost;
              });
              renderTransaction(transID, newTrans, true, this.uid);
              const numbOfUsers = userIDList.length;
              userIDList.forEach((userID: any) => {
                userRef.child(`${userID}`)
                .once('value', (snapshot) => {
                  const user = {
                    id: snapshot.key,
                    userName: snapshot.val().name,
                    avatar: snapshot.val().avatar,
                  };
                  renderUser(transID, user, numbOfUsers, true);
                });
              });
            });
        });
      });
    }, 500);
  }

  deleteTransaction(groupID: string, transID: string) {
    const base = this.firebase.database();
    const userRef = base.ref('User');
    const transRef = base.ref('Transactions');
    const groupRef = base.ref('Groups');
    transRef.child(`${transID}/toUserList`)
      .once('value', (snapshot) => {
        const users = Object.keys(snapshot.val());
        users.forEach((userID) => {
          userRef.child(`${userID}/transactionList/${transID}`)
            .remove()
            .catch(error => {
              if (error) {
                console.log(error.message);
              }
            });
        });
      });

    transRef.child(`${transID}`)
      .remove()
      .catch(error => {
        if (error) {
          console.log(error.message);
        }
      });

    userRef.child(`${this.uid}/transactionList/${transID}`)
      .remove()
      .catch(error => {
        if (error) {
          console.log(error.message);
        }
      });

    groupRef.child(`${groupID}/transactions`)
      .transaction(list => {
        const i = list.indexOf(transID);
        list.splice(i, 1);
        return list;
      })
      .catch(error => {
        console.log(error.message);
      });
  }

  addUserToContacts(userData: ISearchUserData, errorHandler: (message: string) => void) {
    const userTable = this.firebase.database().ref('User');
    userTable
      .once('value', (userList) => {
        const userObjs = userList.val();
        const keysList = Object.keys(userObjs);
        const userKey: string[] = keysList.filter(key => {
          if (userObjs[key].account === userData.account) return key;
          if (userObjs[key].name === userData.name) return key;

          return false;
        });

        if (userKey.length) {
          this.addNewContactToContactList(this.uid, userKey[0], 'approve', errorHandler);
          this.addNewContactToContactList(userKey[0], this.uid, 'pending', errorHandler);
        } else {
          errorHandler('The user is not found.');
        }
      })
      .catch(error => {
        errorHandler(error.message);
      });
  }

  addNewContactToContactList(userId: string, newContactId: string, state: string, errorHandler?: (message: string) => void) {
    this.firebase.database()
      .ref(`User/${userId}/contacts/${newContactId}`)
      .set({ state: state })
      .catch(error => {
        console.log(error.code);
        console.log(error.message);
        if (errorHandler) {
          errorHandler(error.message);
        }
      })
      .catch(error => {
        errorHandler(error.message);
      });
  }


  getBalanceInGroup(groupId: string, currencyRate: number = 1, funcForRender: (data: any) => void, errorHandler?: (message: string) => void, currencyName?: string) {
    const base = this.firebase.database();
    base.ref(`Groups/${groupId}`)
      .once('value', snapshot => {
        const usersList = snapshot.val().userList || [];
        const transactionsId: string[] = snapshot.val().transactions || [];

        if (transactionsId.length) {
          const transQueries = transactionsId.map(transId => {
            return this.getTransactionById(transId);
          });

          Promise.all(transQueries)
            .then(data => data.map(transSnapshot => transSnapshot.val()))
            .then(transactionArray => {
              transactionArray.forEach(transactionData => {
                const fromUserId = transactionData.userID;
                const fromCost = transactionData.totalCost;

                // increase balance "User FROM"
                if (usersList[fromUserId].sum == null) {
                  usersList[fromUserId].sum = 0;
                }
                usersList[fromUserId].sum += fromCost;

                // decrease balances "Users TO"
                const toUserList = transactionData.toUserList;
                const toUserIdList = Object.keys(toUserList);

                toUserIdList.forEach(userId => {
                  if (usersList[userId].sum == null) {
                    usersList[userId].sum = 0;
                  }
                  usersList[userId].sum -= toUserList[userId].cost;
                });
              });
            })
            .then(() => {
              const userListArray: { state: string, sum: number }[] = Object.values(usersList) || [];

              let balance: number = userListArray.length ? userListArray.reduce((sum: number, userData: { sum: number }) => {
                if (userData.sum > 0) {
                  sum += userData.sum;
                }
                return sum;
              }, 0) : 0;

              balance *= currencyRate;
              return {
                balance: balance,
                groupId: groupId,
                currencyName: currencyName ? currencyName : null
              };
            })
            .then(data => {
              funcForRender(data);
            })
          ;
        } else {
          const dataForBalance = {
            balance: 0,
            groupId: groupId,
            currencyName: currencyName ? currencyName : null
          };
          funcForRender(dataForBalance);
        }
      })
      .catch(error => {
        console.log(error.code);
        console.log(error.message);
        if (errorHandler) {
          errorHandler(error.message);
        }
      });
  }

  getDataForGraphGroupBalance(groupId: string, funcHandler: (graphData: any) => void, uid: string, errorHandler?: (message: string) => void) {
    this.firebase
      .database()
      .ref(`Groups/${groupId}`)
      .once('value', snapshot => {
        const userList: any = snapshot.val().userList;

        const usersQuery = Object.keys(userList)
          .map(userId => (userList[userId].state === 'approve') ? userId : null)
          .filter(userId => userId)
          .map(userId => this.getUserById(userId));

        Promise.all(usersQuery)
          .then(userInfoArray => {
            const graphData: { [key: string]: any; } = {};
            const groupData: { [key: string]: string } = { groupTitle: snapshot.val().title };

            userInfoArray.forEach((userInfo) => {
              graphData[userInfo.key] = {
                key: userInfo.key,
                name: userInfo.val().name,
                account: userInfo.val().account,
                avatar: userInfo.val().avatar,
                userBalance: 0,
              };
              if (userInfo.key === uid) {
                groupData.currency = userInfo.val().currency;
              }
            });

            return [graphData, groupData];
          })
          .then(graphData => {
            const transactionList: string[] = snapshot.val().transactions || [];
            const transQuery = transactionList.map(transId => this.getTransactionById(transId));

            Promise.all(transQuery)
              .then(transInfoArray => {
                return transInfoArray.map(transData => transData.val());
              })
              .then(transArray => {
                transArray.forEach(trans => {
                  graphData[0][trans.userID].userBalance += trans.totalCost;

                  const toUserList = trans.toUserList;
                  Object.keys(toUserList).forEach((userId) => {
                    graphData[0][userId].userBalance -= toUserList[userId].cost;
                  });
                });
                return [Object.keys(graphData[0]).map(userId => graphData[0][userId]), graphData[1]];
              })
              .then(data => {
                funcHandler(data);
              })
              .catch(error => {
                if (errorHandler) {
                  errorHandler(error.message);
                } else {
                  console.log(error);
                }
              });
          });
      });
  }

  getUserById(userId: string) {
    return this.firebase.database()
      .ref(`User/${userId}`)
      .once('value', snapshot => snapshot);
  }

  getGroupById(groupID: string): any {
    return this.firebase.database()
      .ref(`Groups/${groupID}`)
      .once('value', snapshot => {
        return snapshot;
      });
  }

  getTransactionById(transactionID: string): any {
    return this.firebase.database()
      .ref(`Transactions/${transactionID}`)
      .once('value', snapshot => snapshot);
  }

  getBalanceForUserInGroup(userId: string, groupId: string, funcForRender: (data: any) => void, errorHandler?: (message: string) => void, ) {
    const base = this.firebase.database();
    let balance: number = 0;
    base.ref(`Groups/${groupId}/`)
      .child(`transactions`)
      .once('value', snapshot => {
        const transId: string[] = snapshot.val() || [];
        if (transId.length) {
          transId.forEach(key => {
            base.ref(`Transactions/${key}`)
              .once('value', snapshot => {
                const transData = snapshot.val();
                if (transData && transData.state === 'opened') {
                  if (transData.userID === userId) {
                    balance += transData.totalCost;
                  }
                  if (transData.toUserList[userId]) {
                    balance -= transData.toUserList[userId].cost;
                  }
                }
              });
          });
        }
      })
      .catch(error => {
        console.log(error.code);
        console.log(error.message);
        if (errorHandler) {
          errorHandler(error.message);
        }
      });

    base.ref(`User/${userId}/currency`)
      .once('value', (snapshot) => {
        const curr = snapshot.val();
        const data = {
          balance: balance,
          groupId: groupId,
          userId: userId,
          currency: curr,
        };
        funcForRender(data);
      })
      .catch(error => {
        console.log(error.code);
        console.log(error.message);
        if (errorHandler) {
          errorHandler(error.message);
        }
      });
  }

  getBalanceForUserTotal(userID: string, funcForRender: (balance: number, currency: string) => void, errorHandler?: (message: string) => void) {
    const base = this.firebase.database();
    let balance: number = 0;
    base.ref(`User/${userID}`)
      .child('transactionList')
      .once('value', snapshot => {
        const transactionList = snapshot.val() || [];
        const transId = Object.keys(transactionList);
        if (transId.length) {
          transId.forEach(key => {
            base.ref(`Transactions/${key}`)
              .once('value', snapshot => {
                const transData = snapshot.val();
                if (transData && transData.state === 'opened') {
                  if (transData.userID === userID) {
                    balance += transData.totalCost;
                  }
                  if (transData.toUserList[userID]) {
                    balance -= transData.toUserList[userID].cost;
                  }
                }
              });
          });
        }
        base.ref(`User/${userID}/currency`)
          .once('value', (snapshot) => {
            const curr = snapshot.val();
            funcForRender(balance, curr);
          });
      })
      .catch(error => {
        console.log(error.code);
        console.log(error.message);
        if (errorHandler) {
          errorHandler(error.message);
        }
      });
  }

  _calcBalance = (transId: string[], userId: string) => {
    let balance: number = 0;

    transId.forEach(key => {
      this.firebase.database()
        .ref(`Transactions/${key}`)
        .once('value', async snapshot => {
          const transData = snapshot.val();
          if (transData) {
            if (transData.userID === userId) {
              balance += await transData.totalCost;
            } else {
              balance -= await transData.toUserList[userId].cost;
            }
          }
        });
    });

    return balance;
  }

  isAccountName(accountName: string) {
    return this.firebase.database()
      .ref('User')
      .orderByChild('account')
      .equalTo(accountName)
      .once('value', snapshot => snapshot);
  }

  getUserCurrentCurrency(uid: string, callback: any, innerCallback: any) {
    this.firebase.database()
      .ref(`User/${uid}/currency`)
      .once('value', async snapshot => {
        const data = snapshot.val();
        callback(innerCallback, data);
      });
  }

  getUserTheme(callback: (theme: string) => void): void {
    this.firebase.database()
      .ref(`User/${this.uid}/theme`)
      .once('value', async snapshot => {
        callback(snapshot.val().toLowerCase());
      });
  }

  createBasicTables() {
      // THEMES
      const themeData1 = {
        name: 'Light',
      };
      const themeData2 = {
        name: 'Dark',
      };
      const themeBase1 = firebase.database().ref(`Theme/Light`);
      const themeBase2 = firebase.database().ref(`Theme/Dark`);
      themeBase1.set(themeData1);
      themeBase2.set(themeData2);

    //  CURRENCY
      Currencies.getCurrenciesList(this.addCurrencyToBase);

      // LANGUAGE
      const lang1 = {
        name: 'ENG',
      };
      const lang2 = {
        name: 'RU',
      };
      const lang3 = {
        name: 'BEL',
      };
      const langBase1 = firebase.database().ref(`Language/ENG`);
      const langBase2 = firebase.database().ref(`Language/RU`);
      const langBase3 = firebase.database().ref(`Language/BEL`);
      langBase1.set(lang1);
      langBase2.set(lang2);
      langBase3.set(lang3);
  }

  addCurrencyToBase = (data: any): void => {
    const keys = Object.keys(data);

    keys.forEach(key => {
      this.firebase.database()
        .ref(`Currency/${key}`)
        .set({ name: data[key] })
        .catch(error => {
          console.log(error);
        });
    });
  }
}
