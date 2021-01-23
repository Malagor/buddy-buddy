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
        // console.log('Current user.uid = ', this.uid);
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
      .then((data: { user: { uid: string; }; }) => {
        const uid: string = data.user.uid;
        // saveUID(uid);
        this._registrationUser(uid, userData);
      })
      .catch(function(error: { code: any; message: any; }) {
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

  updateUserInfo(uid: string, data: any) {
    const userRef = this.firebase.database().ref(`User/${uid}`);
    const file = data['avatar'];

    if (typeof file === 'string') {
      userRef.update(data);
      return;
    }
    const fileExtension = file.name.slice(file.name.indexOf('.'));
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

  getUserInfo(uid: string, callbacks: any[]): any {
    this.firebase
      .database()
      .ref(`User/${uid}`)
      .once('value', (snapshot) => {
        // console.log('snapshot "getUserInfo" -  User Data:', snapshot.val());
        const dataUser = snapshot.val();
        dataUser.key = uid;
        callbacks.forEach(fn => fn(dataUser));
        // callback(snapshot.val());
      }, (error: { code: string; }) => {
        console.log('Error: ' + error.code);
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
      .then(function() {
        console.log('Signout Succesfull');
      }, function(error) {
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
      .catch(error => {
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
    const userIdAuthor: string = data.userId;

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
            .on('value', (group) => {
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
      .on('child_added', (snapshot) => {
        const userLIstInGroup =  Object.keys(snapshot.val().userList);

        if (userLIstInGroup.includes(this.uid)) {
          handlerFunc(snapshot);
        }
      },
        (error: { code: string; message: any; }) => {
          console.log('Error:\n ' + error.code);
          console.log(error.message);
        });
  }

  groupHandler = (createGroupList: any, addUserInGroupCard: any) => {
    const base = this.firebase.database();

    return ((snapshot: any) => {
      const dataUserListGroup: any[] = Object.keys(snapshot.val().userList);
      const groupKey = snapshot.key;
      const data: any = {
        dataGroup: snapshot.val(),
        groupKey: groupKey,
      };

      createGroupList(data);

      base
        .ref('User')
        .once('value', (snapshot) => {

          const snapshotUser = snapshot.val();
          const userList = Object.keys(snapshotUser);

          const arrayUsers: any[] = [];
          userList.forEach(user => {
            if (dataUserListGroup.includes(user)) {
              arrayUsers.push(snapshotUser[user]);
            }
          });
          data.arrayUsers = arrayUsers;

          addUserInGroupCard(data);
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

  removeGroup(groupId: string) {
    this.firebase
      .database()
      .ref(`Groups/${groupId}`)
      .once('value', (snapshot) => {
        console.log('snapshot', snapshot.val());
        if (snapshot.val()) {
          const userList = Object.keys(snapshot.val().userList);
          userList.forEach((user) => {
            this.firebase
            .database()
            .ref(`User/${user}/groupList/${groupId}`)
            .remove(error => {
              if (error) {
                console.log(error.message);
              } else {
                console.log('Delete group in user successful');
              }
            });
          });
        } else {
          console.log('Group not found, delete users unsuccessful');
        }
        return snapshot.val();
      }).then((snapshot) => {
        if (snapshot.val()) {
          this.firebase
          .database()
          .ref(`Groups/${groupId}`)
          .remove(error => {
            if (error) {
              console.log(error.message);
            } else {
              console.log('Delete group successful');
            }
          });
        } else {
          console.log('Group not found');
        }
      });
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
      base.ref(`User/${this.uid}`)
        .off('child_added', handlers.contacts);
    }
  }

  getMessageList(addMessageToListFunc: { (snapshot: any): void; (a: firebase.database.DataSnapshot, b?: string): any; }): void {
    this.firebase
      .database()
      .ref('Messages')
      .on('child_added', addMessageToListFunc,
        (error: { code: string; message: any; }) => {
          console.log('Error:\n ' + error.code);
          console.log(error.message);
        });
  }

  messageHandler = (renderMessage: (arg0: IMessage) => void,
                    setUserData: (arg0: { messageId: any; key: any; name: any; avatar: any; isReceive: boolean; }) => void) => {

    const uid = this.uid;
    const base = this.firebase.database();

    return (snapshot: { val: () => any; key: any; }) => {
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
            if (state !== 'decline') {
              renderContact(userData);
            }
          });
      } else {
        console.log('No Contacts');
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
    console.log('UserInfoListener ...');
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
        } else {
          console.log('User deleted');
        }
      });

  }

  createNewMessage(data: INewMessage): void {
    data.fromUser = this.uid;

    this.firebase
      .database()
      .ref('Messages')
      .push(data)
      .catch((error: { code: string; message: any; }) => {
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
    const values = Object.entries(curr.val()).map((item: any) => item[0]);
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
          .on('value', (snapshot) => {
            const currList: string[] = Object.keys(snapshot.val());
            currList.forEach((curr: string) => {
              renderCurrencyList(curr, currCurrency);
            });
          });
      }, (error: { code: string; message: any; }) => {
        console.log('Error:\n ' + error.code);
        console.log(error.message);
      });
  }

  getGroupsListForTransaction(renderGroupList: { (groupID: string, groupTitle: string, currentGroup: string): void; (arg0: any, arg1: any, arg2: any): void; }): void {
    this.firebase
      .database()
      .ref(`User/${this.uid}`)
      .once('value', (snapshot) => {
        const groupsIDList: string[] = Object.keys(snapshot.val().groupList);
        let currGroup = snapshot.val().currentGroup;
        if (!currGroup) {
          currGroup = groupsIDList[0];
        }
        groupsIDList.forEach((groupID: any) => {
          this.firebase
            .database()
            .ref(`Groups/${groupID}`)
            .once('value', (snapshot) => {
              renderGroupList(groupID, snapshot.val().title, currGroup);
            });
        });
      }, (error: { code: string; message: any; }) => {
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
        if (!currGroup) {
          currGroup = Object.keys(snapshot.val().groupList)[0];
        }

        this.firebase
          .database()
          .ref(`Groups/${currGroup}`)
          .once('value', (snapshot) => {
            const memberList: string[] = Object.keys(snapshot.val().userList);
            // console.log('memberlist', memberList);
            memberList.forEach((userID) => {
              this.firebase
                .database()
                .ref(`User/${userID}`)
                .once('value', (snapshot) => {
                  renderMembers(snapshot.key, snapshot.val().name, snapshot.val().avatar);
                });
            });
          });
      }, (error: { code: string; message: any; }) => {
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
        memberList.forEach((userID) => {
          this.firebase
            .database()
            .ref(`User/${userID}`)
            .once('value', (snapshot) => {
              renderMembers(snapshot.key, snapshot.val().name, snapshot.val().avatar);
            });
        });
      }, (error: { code: string; message: any; }) => {
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
    const setData = {
      userID: this.uid,
      date: data.date,
      totalCost: data.totalCost,
      description: data.description,
      currency: data.currency,
      groupID: data.groupID,
    };

    const transKey = transRef.push().key;
    transRef.child(transKey)
      .set(setData)
      .catch(error => {
        console.log('Error: ' + error.code);
      });

    data.toUserList.forEach((user: any) => {
      const obj = {
        cost: user.cost,
        comment: user.comment,
        state: user.state,
        costFix: user.costFix,
      };

      transRef.child(`${transKey}/toUserList/${user.userID}`)
        .set(obj)
        .catch(error => {
          console.log('Error: ' + error.code);
        });


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
      storageRef.child('transactions/' + file.name)
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
          const userList: string[] = Object.keys(snapshot.val().toUserList);
          if (snapshot.val().userID === this.uid) {
            userRef.child(`${this.uid}`)
              .once('value', (snapshot) => {
                let currGroup = snapshot.val().currentGroup;
                if (!currGroup) {
                  currGroup = Object.keys(snapshot.val().groupList)[0];
                }
                renderTransaction(transID, trans, currGroup, true, this.uid);
                const numbOfUsers = userList.length;
                userList.forEach((userID: any) => {
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
          } else if (Object.keys(snapshot.val().toUserList).some((user: any) => user === this.uid)) {
            userRef.child(`${this.uid}`)
              .once('value', (snapshot) => {
                let currGroup = snapshot.val().currentGroup;
                if (!currGroup) {
                  currGroup = Object.keys(snapshot.val().groupList)[0];
                }
                renderTransaction(transID, trans, currGroup, false, this.uid);
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
          } else return;
        })
        .catch(error => {
          console.log('Error: ' + error.code);
        });
    };
  }

  setNewStateTransaction(state: string, transID: string): void {
    const refTrans = this.firebase.database().ref(`Transactions/${transID}/toUserList/${this.uid}/state`);
    refTrans.set(state)
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

  getTransInfoModal(trans: any, transID: string, groupID: string, renderGroupTitle: any, renderUser: any, renderOwner: any) {
    this.firebase
      .database()
      .ref(`Groups/${groupID}`)
      .once('value', (snapshot) => {
        const title = snapshot.val().title;
        renderGroupTitle(transID, title);
        const userList: any[] = Object.keys(snapshot.val().userList);
        userList.forEach((userID: string) => {
          this.firebase
            .database()
            .ref(`User/${userID}`)
            .once('value', (snapshot) => {
              const dataUser = snapshot.val();
              dataUser.key = userID;
              renderUser(transID, trans, dataUser);
            });

        });

      }, (error: { code: string; }) => {
        console.log('Error: ' + error.code);
      });

    this.firebase
      .database()
      .ref(`User/${trans.userID}`)
      .once('value', (snapshot) => {
        renderOwner(transID, snapshot.val());
      }, (error: { code: string; }) => {
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

  getBalanceInGroup(groupId: string, currencyRate: number = 1, funcForRender: (data: any) => void, errorHandler?: (message: string) => void) {

    const base = this.firebase.database();

    base.ref(`Groups/${groupId}`)
      .once('value', snapshot => {
        const usersList = snapshot.val().userList || [];
        const transactionsId: string[] = snapshot.val().transactions || [];

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
        const data = {
          balance: balance,
          groupId: groupId
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

  getBalanceForUserInGroup(userId: string, groupId: string, currencyRate: number = 1, funcForRender: (data: any) => void, errorHandler?: (message: string) => void) {
    const base = this.firebase.database();

    base.ref(`Groups/${groupId}/`)
      .child(`transactions`)
      .once('value', snapshot => {
        const transId: string[] = snapshot.val() || [];
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
        const data = {
          balance: balance,
          groupId: groupId,
          userId: userId

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

  getBalanceForUserTotal(userId: string, currencyRate: number = 1, funcForRender: (balance: number) => void, errorHandler?: (message: string) => void) {
    console.log('getBalanceForUserTotal ...');
    const base = this.firebase.database();

    base.ref(`User/${userId}`)
      .child('transactionList')
      .once('value', snapshot => {
        const transactionList = snapshot.val() || [];
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
