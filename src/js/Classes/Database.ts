import firebase from 'firebase';
import 'firebase/auth';
import { default as CyrillicToTranslit } from 'cyrillic-to-translit-js/CyrillicToTranslit';
import { IGroupData } from '../Interfaces/IGroupData';
import { INewMessage } from '../Pages/Messenger/Messenger';

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

  findUserByName(accountName: string, func: any, errorFunc?: any) {
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
        func(data);
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

  _createAccountName(name: string): string {
    let accountName: string = cyrillicToTranslit.transform(name).toLowerCase();
    accountName += (Math.floor(Math.random() * (999 + 1)) + 1).toString();
    accountName = accountName.replace(' ', '');
    return accountName;
  }

  createNewGroup(data: IGroupData) {
    console.log('createNewGroup - data\n', data);
    this.firebase
      .database()
      .ref('Groups')
      .push(data)
      .then(group => {
        const groupKey = group.key;
        const users = data.userList;
        users.forEach(userId => {
          const user = this.firebase.database().ref('User').child(userId);
          const userGroup = user.child('groupList');
          userGroup.transaction(groupList => {
            if (groupList) {
              groupList.push(groupKey);
              return groupList;
            } else {
              let arrGroup: string[] = [];
              arrGroup.push(groupKey);
              return arrGroup;
            }
          });
        });
      })
      .catch(error => {
        console.log(error.code);
        console.log(error.message);
      });
  }

  getGroupList(callbacks: any): void {
    const arrayUsersInfo: any = [];

    this.firebase
      .database()
      .ref('Groups')
      .on('child_added', (snapshot) => {
        const users: string[] = snapshot.val().userList;

        if (users.includes(this.uid)) {
          const dataGroup = snapshot.val();
          const dataUserListGroup = dataGroup.userList;

          this.firebase
            .database()
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
              callbacks(dataForGroup);
            });

        }
      }, (error: { code: string; message: any; }) => {
        console.log('Error:\n ' + error.code);
        console.log(error.message);
      });
  }

  countGroupsInvite(callback: any): void {
    this.firebase
      .database()
      .ref('Groups')
      .on('child_added', snapshot => {
        // console.log(`countGroupsInvite`, snapshot.val());

      }, (error: { code: string; message: any; }) => {
        console.log('Error:\n ' + error.code);
        console.log(error.message);
      });
  }

  countTransactionInvite(callback: any): void {
    console.log('Start Transactions Counts...');
    this.firebase
      .database()
      .ref('Transactions')
      .on('child_added', snapshot => {
        const userList = snapshot.val().toUserList;
        const hasUserId = userList.find((user: { userID: string; state: string; }) => {
          return (user.userID === this.uid && user.state !== 'approve');
        });
        if (hasUserId) {
          callback(1);
        } else {
          callback(0);
        }
      }, (error: { code: string; message: any; }) => {
        console.log('Error:\n ' + error.code);
        console.log(error.message);
      });

  }

  countNewMessage(callback: any): void {
    this.firebase
      .database()
      .ref('Messages')
      .on('child_added', (snapshot) => {
        const toUser: string = snapshot.val().toUser;
        const status: boolean = snapshot.val().isRead;

        if (toUser === this.uid && status === false) {
          callback(1);
        } else {
          callback(0);
        }
      });
  }

  getMessageList(renderMessage: any, setUserData: any): void {
    this.firebase
      .database()
      .ref('Messages')
      .on('child_added', (snapshot) => {
        const messageObj = snapshot.val();
        const messageId = snapshot.key;
        const { fromUser, toUser } = messageObj;

        if (fromUser === this.uid || toUser === this.uid) {
          let isReceive: boolean = toUser === this.uid;

          const messageData = {
            messageId,
            message: messageObj.message,
            date: messageObj.date,
            isRead: messageObj.isRead,
            isReceive,
          };
          renderMessage(messageData);

          const secondUserId = isReceive ? fromUser : toUser;

          this.firebase
            .database()
            .ref(`User/${secondUserId}`)
            .once('value', userData => {
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
            this.firebase
              .database()
              .ref(`Messages/${messageId}`)
              .child('isRead')
              .transaction(curStatus => {
                curStatus = true;
                return curStatus;
              });
          }
        }
      }, (error: { code: string; message: any; }) => {
        console.log('Error:\n ' + error.code);
        console.log(error.message);
      });
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


  // addTheme(nameTheme: string) {
  //
  // }
  //
  // getThemeList() {
  //
  // }
  //
  // getThemeByID(themeID: string) {
  //
  // }
  //
  // getThemeByName(themeName: string) {
  //
  // }
  //
  // addCurrency() {
  //
  // }
  //
  // getCurrency(curID?: string, curAbbreviation?: string) {
  //
  // }

  getCurrencyList(renderCurrencyList: any): void {
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

  getGroupsListForTransaction(renderGroupList: any): void {
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

  getMembersOfGroupFirst(renderMembers: any) {
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
}
