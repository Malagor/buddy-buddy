import firebase from 'firebase';
import 'firebase/auth';
import { default as CyrillicToTranslit } from 'cyrillic-to-translit-js/CyrillicToTranslit';
import { IDataForCreateGroup } from '../Interfaces/IGroupData';
import { ISearchUserData } from '../Pages/Contacts/Contacts';
import { IMessage, INewMessage } from '../Pages/Messenger/Messenger';
import { IHandlers } from './App';
import { TypeOfNotifications } from './Notifications';
import { resolve } from '../../../webpack.config';
import { rejects } from 'assert';

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

  getUserInfo(uid: string, callbacks: any[]): any {
    this.firebase
      .database()
      .ref(`User/${uid}`)
      .once('value', (snapshot) => {
        console.log('snapshot "getUserInfo" -  User Data:', snapshot.val());
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
      const userObj: any = {}

      data.userList.forEach((userId: string) => {
            
        if(userId === userIdAuthor) {
          data.groupData.author = userIdAuthor;
          userObj[userId] = { state: 'approve' };
        } else {
          userObj[userId] = { state: 'pending' };
        }
      })
        
      data.groupData['userList'] = userObj;
      console.log('!!!!!!!!!!!!!!!data', data)

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
                if(userId === userIdAuthor) {
                  this.firebase.database()
                  .ref(`User/${userId}/groupList/${groupKey}`)
                  .set({state: 'approve'});
                } else {
                  this.firebase.database()
                  .ref(`User/${userId}/groupList/${groupKey}`)
                  .set({state: 'pending'});
                }

              });
            });
            return group;
          })
          .then(data => {
            const dataForAddCurrentGroup = {
              groupKey: data.key,
              userId: userIdAuthor
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

    if(file) {
      console.log('isFile')
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
              console.log("foto- data", data)
              sendDataInDB(data)
            })
        });
    } else {
      console.log('no File')
      sendDataInDB(data) 
    }
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
      const users: string[] = Object.keys(snapshot.val().userList);
      if (users.includes(this.uid)) {
        const dataGroup = snapshot.val();
        const dataUserListGroup: any[] = Object.keys(snapshot.val().userList);

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
    const userIdAuthor: string = data.userId;
    const groupKey = data.groupKey;

    this.firebase
    .database()
    .ref(`User/${userIdAuthor}/currentGroup`)
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
            setNotificationMark(TypeOfNotifications.Group, 1);
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
        const state = snapshot.val().state;

        if (state === 'pending') {
          setNotificationMark(TypeOfNotifications.Contact, 1);
        } else {
          setNotificationMark(TypeOfNotifications.Contact, 0);
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
      base.ref('Transactions')
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
      console.log('contactsHandler', snapshot);
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
    console.log('createNewMessage', data);
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

  getCurrencyList(renderCurrencyList: { (currID: string, icon: string): void; (arg0: string, arg1: any): void; }): void {
    this.firebase
      .database()
      .ref('Currency')
      .on('child_added', (snapshot) => {
        renderCurrencyList(snapshot.key, snapshot.val().icon);
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
        const memberList: string[] = snapshot.val().userList;
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
    data.userID = this.uid;
    const transRef = this.firebase.database().ref('Transactions');
    const transKey = transRef.push().key;
    transRef.child(transKey)
      .set(data)
      .catch(error => {
        console.log('Error: ' + error.code);
      });

    const groupRef = this.firebase.database().ref(`Groups/${data.groupID}/transactions`);
    groupRef.transaction(list => {
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
}
