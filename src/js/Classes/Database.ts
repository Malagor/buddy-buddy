import firebase from 'firebase';
import 'firebase/auth';
import { default as CyrillicToTranslit } from 'cyrillic-to-translit-js/CyrillicToTranslit';
import { IDataForCreateGroup } from '../Interfaces/IGroupData';
import { ISearchUserData } from '../Pages/Contacts/Contacts';
import { IMessage, INewMessage } from '../Pages/Messenger/Messenger';
import { IHandlers } from './App';
import { TypeOfNotifications } from './Notifications';

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
        console.log('Current user.uid = ', this.uid);
        this.onUserIsLogin(true, this.uid);
      } else {
        // No user is signed in.
        this.uid = null;
        console.log('No user');
        this.onUserIsLogin(false);
      }
    });
  }

  createUserByEmail(email: string, password: string, nameUser: string = '', errorHandleFunction: any) {
    console.log(email + ' : ' + password + ' : ' + nameUser);
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
      .catch(function (error: { code: any; message: any }) {
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
        console.log('createUserByGoogle => result:', result);

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
      .catch(function (error) {
        console.log(error.code);
        console.log(error.message);
        errorHandleFunction(error.message);
      });
  }

  loginUserByEmail(email: string, password: string, errorHandleFunction: any): void {
    this.firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(function (error) {
        console.log(error.code);
        console.log(error.message);
        errorHandleFunction(error.message);
      });
  }

  protected _registrationUser(uid: string, data: object) {
    this.firebase.database().ref(`User/${uid}`).set(data);
  }

  async getUserInfo(uid: string, callbacks: any[]) {
    await this.firebase
      .database()
      .ref(`User/${uid}`)
      .once(
        'value',
        (snapshot) => {
          const dataUser = snapshot.val();
          dataUser.key = uid;
          callbacks.forEach((fn) => fn(dataUser));
        },
        (error: { code: string }) => {
          console.log('Error: ' + error.code);
        },
      );
  }

  async getUserTransactions(uid: string, callback: any) {
    const dat: any = await this.firebase
      .database()
      .ref(`User/${uid}/transactionList`)
      .once('value', (snapshot) => snapshot);
    const dataUser: any = dat.val();
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
      const value: any = await data.filter((item: any) => item[0] !== null || item[1].state === 'approve')
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
        callback(data);
      });
    });
  }

  async getUserGroups(uid: string, callback: any, callback2: any) {
    const dat: any = await this.firebase
      .database()
      .ref(`User/${uid}/groupList`)
      .once('value', (snapshot) => snapshot);
    const dataUser: any = dat.val();
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
          const elem: any = await item.userList.map(async (it: any) => {
            const res: any = await this.firebase
              .database()
              .ref(`User/${it[0]}`)
              .once('value', (snapshot) => snapshot);
            it = res.val().avatar;
            return it;
          });
          await Promise.all(elem).then((userList: any) => {
            if (userList.length) callback2(callback(userList), index, item.title, value.length, item.icon, item.groupID, currentUserGroup);
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
        },
      );
  }

  signOut() {
    this.firebase
      .auth()
      .signOut()
      .then(function () {
          console.log('Signout Succesfull');
      }, function (error) {
          console.log('Signout Failed');
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
        console.log(key, snapshot.val()[`${key}`]);

        const data = {
          name: snapshot.val()[`${key}`].name,
          avatar: snapshot.val()[`${key}`].avatar,
          account: snapshot.val()[`${key}`].account,
          key: key,
        };
        handlerFunc(data);
      })
      .catch((error) => {
        console.log('Error retrieving user data');
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
    const currentGroup: boolean = data.currentGroup;
    const userId: string = data.userId;

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
          .then(data => {
            this.firebase
              .database()
              .ref('Groups')
              .push(data.groupData)
              .then(group => {

                data.userList.forEach((userId: string) => {
                  this.firebase
                    .database()
                    .ref(`Groups/${group.key}/userList/${userId}`)
                    .set({ state: 'pending' });
                });

                return group;
              })
              .then(group => {
                const groupKey = group.key;
                this.firebase
                  .database()
                  .ref(`Groups/${groupKey}`)
                  .on('value', (group) => {
                    const users: any = group.val().userList;

                    Object.keys(users).forEach((userId: any) => {

                      this.firebase.database()
                        .ref(`User/${userId}/groupList/${groupKey}`)
                        .set({ state: 'pending' });

                    });
                  });
                return group;
              })
              .then(data => {
                const dataForAddCurrentGroup = {
                  groupKey: data.key,
                  userId: userId,
                };
                if (currentGroup) {
                  this.addCurrentGroup(dataForAddCurrentGroup);
                }
              });

          })
          .catch(error => {
            console.log(error.code);
            console.log(error.message);
          });
      });
  }

  getGroupList(handlerFunc: any): void {
    this.firebase
      .database()
      .ref('Groups')
      .on('child_added', handlerFunc,
        (error: { code: string; message: any; }) => {
          console.log('Error:\n ' + error.code);
          console.log(error.message);
        });
  }

  groupHandler = (createGroupList: any) => {
    const base = this.firebase.database();

    return ((snapshot: any) => {

      const users: string[] = Object.keys(snapshot.val().userList); // по каждой группе список  юзеров
      // при создании новой группы не доходит userList // разобраться
      if (users.includes(this.uid)) {
        const dataGroup = snapshot.val();
        const dataUserListGroup: any[] = Object.keys(snapshot.val().userList);

        base
          .ref('User')
          .once('value', (snapshot) => {
            const snapshotUser = snapshot.val();
            const userList = Object.keys(snapshotUser); // all users in DB

            // const arrayUserImg: string[] = userList.filter(user => dataUserListGroup.includes(user));
            const arrayUsers: any[] = [];
            userList.forEach(user => {
              if (dataUserListGroup.includes(user)) {
                arrayUsers.push(snapshotUser[user]);
              }
            });

            const dataForGroup = {
              'dataGroup': dataGroup,
              'arrayUsers': arrayUsers,
            };
            createGroupList(dataForGroup);
          });
      }
    });
  }

  addCurrentGroup(data: any) {
    const userId: string = data.userId;
    const groupKey = data.groupKey;

    this.firebase
      .database()
      .ref(`User/${userId}/currentGroup`)
      .set(groupKey);
  }

  countGroupsInvite(setNotificationMark: { (type: TypeOfNotifications, num: number): void; (arg0: TypeOfNotifications, arg1: number): void; }): void {
    this.firebase
      .database()
      .ref('Groups')
      .on('child_added', snapshot => {
        const userList = snapshot.val().userList;
        // console.log('countGroupsInvite', userList);
        Object.keys(userList).forEach(user => {
          if (user === this.uid && userList[user].state !== 'approve') {
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
        // const hasUserId = userList.find((user: { userID: string; state: string; }) => {
        //   return (user.userID === this.uid && user.state !== 'approve');
        // });
        // if (hasUserId) {
        //   setNotificationMark(TypeOfNotifications.Transaction, 1);
        // } else {
        //   setNotificationMark(TypeOfNotifications.Transaction, 0);
        // }
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
      base.ref('Messages').off('child_added', handlers.messages);
    }

    if (handlers.groups) {
      base.ref('Groups').off('child_added', handlers.groups);
    }

    if (handlers.transactions) {
      base.ref('Transactions').off('child_added', handlers.transactions);
    }

    if (handlers.contacts) {
      base.ref('Transactions')
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
        },
      );
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
            },
          );

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
  };

  contactsHandler = (renderContact: any): any => {
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
            // if (state !== 'decline') {
            renderContact(userData);
            // }
          });
      } else {
        console.log('No Contacts');
      }
    };
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

  deleteContact(userId: string, contactId: string) {
    this.changeContactState(contactId, 'decline');
    this.changeContactState(userId, 'decline', contactId);

    // this.firebase
    //   .database()
    //   .ref(`User/${userId}/contacts/${contactId}`)
    //   .remove(error => {
    //     if (error) {
    //       console.log(error.message);
    //     } else {
    //       console.log('Delete contact successful');
    //     }
    //   });
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

  getCurrencyList(renderCurrencyList: { (currID: string, icon: string): void; (arg0: string, arg1: any): void; }): void {
    this.firebase
      .database()
      .ref('Currency')
      .on('child_added', (snapshot) => {
          renderCurrencyList(snapshot.key, snapshot.val().icon);
        }, (error: { code: string; message: any }) => {
          console.log('Error:\n ' + error.code);
          console.log(error.message);
        });
  }

  getGroupsListForTransaction(renderGroupList: { (groupID: string, groupTitle: string, currentGroup: string): void; (arg0: any, arg1: any, arg2: any): void; }): void {
    this.firebase
      .database()
      .ref(`User/${this.uid}`)
      .once(
        'value',
        (snapshot) => {
          const groupsIDList = snapshot.val().groupList;
          const currGroup = snapshot.val().currentGroup;
          groupsIDList.forEach((groupID: any) => {
            this.firebase
              .database()
              .ref(`Groups/${groupID}`)
              .once('value', (snapshot) => {
                renderGroupList(groupID, snapshot.val().title, currGroup);
              });
          });
        },
        (error: { code: string; message: any }) => {
          console.log('Error:\n ' + error.code);
          console.log(error.message);
        },
      );
  }

  getMembersOfGroupFirst(renderMembers: {
    (userID: string, userName: string, userAvatar: string): void;
    (arg0: string, arg1: any, arg2: any): void;
  }) {
    this.firebase
      .database()
      .ref(`User/${this.uid}`)
      .once(
        'value',
        (snapshot) => {
          const currentGroup = snapshot.val().currentGroup;
          this.firebase
            .database()
            .ref(`Groups/${currentGroup}`)
            .once('value', (snapshot) => {
              const memberList: string[] = snapshot.val().userList;
              memberList.forEach((userID) => {
                this.firebase
                  .database()
                  .ref(`User/${userID}`)
                  .once('value', (snapshot) => {
                    renderMembers(
                      snapshot.key,
                      snapshot.val().name,
                      snapshot.val().avatar,
                    );
                  });
              });
            });
        },
        (error: { code: string; message: any }) => {
          console.log('Error:\n ' + error.code);
          console.log(error.message);
        },
      );
  }

  getMembersOfGroup(groupID: string, renderMembers: any) {
    this.firebase
      .database()
      .ref(`Groups/${groupID}`)
      .once(
        'value',
        (snapshot) => {
          const memberList: string[] = snapshot.val().userList;
          memberList.forEach((userID) => {
            this.firebase
              .database()
              .ref(`User/${userID}`)
              .once('value', (snapshot) => {
                renderMembers(
                  snapshot.key,
                  snapshot.val().name,
                  snapshot.val().avatar,
                );
              });
          });
        },
        (error: { code: string; message: any }) => {
          console.log('Error:\n ' + error.code);
          console.log(error.message);
        },
      );
  }

  setDataTransaction(data: any) {
    data.userID = this.uid;
    const transRef = this.firebase.database().ref('Transactions');
    const transKey = transRef.push().key;
    transRef
      .child(transKey)
      .set(data)
      .catch((error) => {
        console.log('Error: ' + error.code);
      });

    const groupRef = this.firebase
      .database()
      .ref(`Groups/${data.groupID}/transactions`);
    groupRef
      .transaction((list) => {
        if (list) {
          list.push(transKey);
          return list;
        } else {
          let arrTrans: string[] = [];
          arrTrans.push(transKey);
          return arrTrans;
        }
      })
      .catch((error) => {
        console.log('Error: ' + error.code);
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

  getBalanceInGroup(groupId: string, currencyRate: number = 1, funcForRender: (balance: number) => void, errorHandler?: (message: string) => void) {
    const base = this.firebase.database();

    base.ref(`Groups/${groupId}`)
      .once('value', snapshot => {
        const usersList = snapshot.val().userList;
        const transactionsId: string[] = snapshot.val().transactions;

        if (transactionsId.length) {
          transactionsId.forEach(transID => {
            base.ref(`Transactions/${transID}`)
              .once('value', snapshot => {
                const transactionData = snapshot.val();
                if (transactionData) {
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
                }                
              });
          });
        }        

        // Total group Balances
        const userListArray: { state: string, sum: number }[] = usersList.length ? Object.values(usersList) : [];
        let balance: number = userListArray.length ? userListArray.reduce((sum: number, userData: { sum: number }) => {
          if (userData.sum > 0) {
            sum += userData.sum;
          }
          return sum;
        }, 0) : 0;

        balance *= currencyRate;
        funcForRender(balance);
      })
      .catch(error => {
        console.log(error.code);
        console.log(error.message);
        if (errorHandler) {
          errorHandler(error.message);
        }
      });
  }

  getBalanceForUserInGroup(userId: string, groupId: string, currencyRate: number = 1, funcForRender: (balance: number) => void, errorHandler?: (message: string) => void) {
    const base = this.firebase.database();

    base.ref(`Groups/${groupId}/`)
      .child(`transactions`)
      .once('value', snapshot => {
        const transId: string[] = snapshot.val();
        let balance: number = 0;

        if (transId.length) {
          transId.forEach(key => {
            base.ref(`Transactions/${key}`)
              .once('value', snapshot => {
                const transData = snapshot.val();
                if (transData) {
                  if (transData.userID === userId) {
                    balance += transData.totalCost;
                  } else {
                    balance -= transData.toUserList[userId].cost;
                  }
                }                
              });
          });
        }        

        balance *= currencyRate;
        funcForRender(balance);
      })
      .catch(error => {
        console.log(error.code);
        console.log(error.message);
        if (errorHandler) {
          errorHandler(error.message);
        }
      });
  }

  getBalanceForUserTotal(userId: string, currencyRate: number = 1, funcForRender: (balance: number) => void, errorHandler?: (message: string) => void) {
    console.log('getBalanceForUserTotal ...');
    const base = this.firebase.database();

    base.ref(`User/${userId}`)
      .child('transactionList')
      .once('value', snapshot => {
        const transactionList = snapshot.val();
        const transId = Object.keys(transactionList);
        let balance: number = 0;

        if (transId.length) {
          transId.forEach(key => {
            base.ref(`Transactions/${key}`)
              .once('value', snapshot => {
                const transData = snapshot.val();
                if (transData) {
                  if (transData.userID === userId) {
                    balance += transData.totalCost;
                  } else {
                    balance -= transData.toUserList[userId].cost;
                  }
                }                
              });
          });
        }

        balance *= currencyRate;
        funcForRender(balance);
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

  getUserCurrentCurrency(uid: string, callback: any, innerCallback: any) {
    this.firebase.database()
    .ref(`User/${uid}/currency`)
    .once('value', async snapshot => {
      const data = snapshot.val();
      callback(innerCallback, data);
    })
  }

  createBasicTables() {
    //   // THEMES
    //   const themeData1 = {
    //     name: 'Light',
    //   };
    //   const themeData2 = {
    //     name: 'Dark',
    //   };
    //   const themeBase1 = firebase.database().ref(`Theme/Light`);
    //   const themeBase2 = firebase.database().ref(`Theme/Dark`);
    //   themeBase1.set(themeData1);
    //   themeBase2.set(themeData2);
    //
    //  CURRENCY
    // const currencyArray = [
    //   {
    //     code: 'USD',
    //     name: 'United States Dollar',
    //   },
    //   {
    //     code: 'EUR',
    //     name: 'Euro',
    //   },
    //   {
    //     code: 'BYN',
    //     name: 'Belarusian Ruble',
    //   },
    //   {
    //     code: 'RUB',
    //     name: 'Russian Ruble',
    //   },
    // ];
    // currencyArray.forEach(cur => {
    //   this.firebase.database()
    //     .ref(`Currency/${cur.code}`)
    //     .set({ name: cur.name })
    //     .catch(error => {
    //       console.log(error);
    //     });
    // });

    // Currencies.getCurrenciesList(this.addCurrencyToBase);


    //   //
    //   // LANGUAGE
    //   const lang1 = {
    //     name: 'ENG',
    //   };
    //   const lang2 = {
    //     name: 'RU',
    //   };
    //   const lang3 = {
    //     name: 'BEL',
    //   };
    //   const langBase1 = firebase.database().ref(`Language/ENG`);
    //   const langBase2 = firebase.database().ref(`Language/RU`);
    //   const langBase3 = firebase.database().ref(`Language/BEL`);
    //   langBase1.set(lang1);
    //   langBase2.set(lang2);
    //   langBase3.set(lang3);
  }

  addCurrencyToBase = (data: any): void => {
    console.log(data);
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
