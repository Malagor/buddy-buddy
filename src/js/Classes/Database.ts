import firebase from 'firebase';
import 'firebase/auth';
import { default as CyrillicToTranslit } from 'cyrillic-to-translit-js/CyrillicToTranslit';
import { IGroupData } from '../Interfaces/IGroupData';
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

  getGroupList(handlerFunc: any): void {
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
              handlerFunc(dataForGroup);
            });

        }
      }, (error: { code: string; message: any; }) => {
        console.log('Error:\n ' + error.code);
        console.log(error.message);
      });
  }

  countGroupsInvite(setNotificationMark: { (type: TypeOfNotifications, num: number): void; (arg0: TypeOfNotifications, arg1: number): void; }): void {
    this.firebase
      .database()
      .ref('Groups')
      .on('child_added', snapshot => {
        let count: number = 0;
        console.log(`countGroupsInvite`, snapshot.val());

        setNotificationMark(TypeOfNotifications.Group, count);
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
        const hasUserId = userList.find((user: { userID: string; state: string; }) => {
          return (user.userID === this.uid && user.state !== 'approve');
        });
        if (hasUserId) {
          setNotificationMark(TypeOfNotifications.Transaction, 1);
        } else {
          setNotificationMark(TypeOfNotifications.Transaction, 0);
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
        let currGroup = snapshot.val().currentGroup;
        if (!currGroup) {
          currGroup = snapshot.val().groupList[0];
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
          currGroup = snapshot.val().groupList[0];
        }

        this.firebase
          .database()
          .ref(`Groups/${currGroup}`) 
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

  // setDataTransaction(data: any) {
  //   data.userID = this.uid; 
  //   data.toUserList.forEach((user: any) => {
  //     if(user.userID === this.uid) {
  //       user.state = 'approve';
  //     }
  //   });

  //   const transRef = this.firebase.database().ref('Transactions');    
  //   const transKey = transRef.push().key;
  //   transRef.child(transKey)
  //     .set(data)
  //     .catch(error => {
  //       console.log('Error: ' + error.code);
  //     });

  //   const groupRef = this.firebase.database().ref(`Groups/${data.groupID}/transactions`);
  //   groupRef.transaction(list => {
  //     if (list) {
  //       list.push(transKey);
  //       return list;
  //     } else {
  //       let arrTrans: string[] = [];
  //       arrTrans.push(transKey);
  //       return arrTrans;
  //     }
  //   })
  //   .catch(error => {
  //     console.log('Error: ' + error.code);
  //   });

  //   const files: any[] = data.photo;
  //   files.forEach((file, i) => {
  //     const metadata = {
  //       'contentType': file.type,
  //     };
  //     this.firebase.storage()
  //       .ref()
  //       .child('transactions/' + file.name)
  //       .put(file, metadata)
  //       .then((snapshot) => {
  //         snapshot.ref.getDownloadURL()
  //           .then((url) => {
  //             this.firebase.database().ref(`Transactions/${transKey}/photo/${i}`)
  //             .set(url); 
  //           })
  //         })
  //         .catch(error => {
  //           console.log('Error: ' + error.code);
  //         });
  //   })      
  // }

  setDataTransaction(data: any) {
    data.toUserList.forEach((user: any) => {
      if(user.userID === this.uid) {
        user.state = 'approve';
      }
    });
    const setData = {
      userID: data.userID,
      date: data.date,
      totalCost: data.totalCost,
      description: data.description,
      currency: data.currency,
    }

    const transRef = this.firebase.database().ref('Transactions');    
    const transKey = transRef.push().key;
    transRef.child(transKey)
      .set(setData)
      .catch(error => {
        console.log('Error: ' + error.code);
      });

    data.toUserList.forEach((user: any) => {
      const obj = {
        cost:user.cost,
        comment:user.comment,
        state:user.state,
      }
      const base = this.firebase.database().ref(`Transactions/${transKey}/toUserList/${user.userID}`);    
      base.set(obj)
      .catch(error => {
        console.log('Error: ' + error.code);
      });

      const userRef = this.firebase.database().ref(`User/${user.userID}/transactionList/${transKey}`);
      userRef.set(user.state);
    })
    
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

    const files: any[] = data.photo;
    files.forEach((file, i) => {
      const metadata = {
        'contentType': file.type,
      };
      this.firebase.storage()
        .ref()
        .child('transactions/' + file.name)
        .put(file, metadata)
        .then((snapshot) => {
          snapshot.ref.getDownloadURL()
            .then((url) => {
              this.firebase.database().ref(`Transactions/${transKey}/photo/${i}`)
              .set(url); 
            })
          })
          .catch(error => {
            console.log('Error: ' + error.code);
          });
    })      
  }

  getMyTransactionsList(renderTransaction: any, renderUser:any):void {
    this.firebase
      .database()
      .ref(`User/${this.uid}`)
      .once('value', (snapshot) => {
         
        let currGroup = snapshot.val().currentGroup;
        if (!currGroup) {
          currGroup = snapshot.val().groupList[0];
        }
        this.firebase
        .database()
        .ref('Transactions')
        .on('child_added', (snapshot) => {          
          if (snapshot.val().userID === this.uid) { 
            renderTransaction(snapshot.key, snapshot.val(), currGroup, true, this.uid); 
            const transID = snapshot.key;
            const userList:string[] = snapshot.val().toUserList;
            userList.forEach((user: any, i: number) => {
              this.firebase
                .database()
                .ref(`User/${user.userID}`)
                .once('value', (snapshot) => {
                  const user = {
                    id: snapshot.key,
                    userName: snapshot.val().name,
                    avatar: snapshot.val().avatar,
                  }
                  renderUser(transID, user, i, true);                        
                });
            });      

          } else if (snapshot.val().toUserList.some((user:any) => user.userID === this.uid)){
            renderTransaction(snapshot.key, snapshot.val(), currGroup, false, this.uid); 
            const userID = snapshot.val().userID;
            const transID = snapshot.key;
            this.firebase
                .database()
                .ref(`User/${userID}`)
                .once('value', (snapshot) => {
                  const user = {
                    id: snapshot.key,
                    userName: snapshot.val().name,
                    avatar: snapshot.val().avatar,
                  }
                  renderUser(transID, user, 0, false);                        
                });
          } else return;          
        });   
      }, (error: { code: string; message: any; }) => {
        console.log('Error:\n ' + error.code);
        console.log(error.message);
      });  
  }

  // getMyTransactionsList(addFunction: any):void {
  //   this.firebase
  //     .database()
  //     .ref(`User/${this.uid}`)
  //     .once('value', (snapshot) => {
         
  //       let currGroup = snapshot.val().currentGroup;
  //       if (!currGroup) {
  //         currGroup = snapshot.val().groupList[0];
  //       }
  //       this.firebase
  //       .database()
  //       .ref('Transactions')
  //       .on('child_added', addFunction, (error: { code: string; message: any; }) => {
  //       console.log('Error:\n ' + error.code);
  //       console.log(error.message);
  //     });  
  // }

  // transactionHandler = (renderTransaction: any, renderUser:any ) => {
  //   return (snapshot: any) => {         
  //     let currGroup = snapshot.val().currentGroup;
  //     if (!currGroup) {
  //       currGroup = snapshot.val().groupList[0];
  //     }
  //     this.firebase
  //     .database()
  //     .ref('Transactions')
  //     .on('child_added', (snapshot) => {          

  //       if (snapshot.val().userID === this.uid) { 
  //         renderTransaction(snapshot.key, snapshot.val(), currGroup, true, this.uid); 
  //         const transID = snapshot.key;
  //         const userList:string[] = snapshot.val().toUserList;
  //         userList.forEach((user: any, i: number) => {
  //           this.firebase
  //             .database()
  //             .ref(`User/${user.userID}`)
  //             .once('value', (snapshot) => {
  //               const user = {
  //                 id: snapshot.key,
  //                 userName: snapshot.val().name,
  //                 avatar: snapshot.val().avatar,
  //               }
  //               renderUser(transID, user, i, true);                        
  //             });
  //         });      
  //       } else if (snapshot.val().toUserList.some((user:any) => user.userID === this.uid)){
  //         renderTransaction(snapshot.key, snapshot.val(), currGroup, false, this.uid); 
  //         const userID = snapshot.val().userID;
  //         const transID = snapshot.key;
  //         this.firebase
  //             .database()
  //             .ref(`User/${userID}`)
  //             .once('value', (snapshot) => {
  //               const user = {
  //                 id: snapshot.key,
  //                 userName: snapshot.val().name,
  //                 avatar: snapshot.val().avatar,
  //               }
  //               renderUser(transID, user, 0, false);                        
  //             });
  //       } else return;          
  //     });   
  //   }
  // }  






  setNewStateTransaction(state: string, transID: string):void {
    const refTrans =  this.firebase.database().ref(`Transactions/${transID}`);
    refTrans.once('value', (snapshot) => {
       const userList = snapshot.val().toUserList;
       userList.forEach((user: any, i:number) => {
          if (user.userID === this.uid) {
            refTrans.child(`toUserList/${i}/state`).set(state);
            
          }
       });
    },
    (error: { code: string; message: any; }) => {
      console.log('Error:\n ' + error.code);
      console.log(error.message);
    });
  }


  getUserInfoTrans(uid: string, callback: any): any {
    this.firebase
      .database()
      .ref(`User/${uid}`)
      .once('value', (snapshot) => {
        // console.log('snapshot "getUserInfo" -  User Data:', snapshot.val());
        const dataUser = snapshot.val();
        dataUser.key = uid;
        callback(dataUser);
        // callback(snapshot.val());
      }, (error: { code: string; }) => {
        console.log('Error: ' + error.code);
      });
  }


  getTransInfoModal(trans:any, transID:string, groupID: string, renderGroupTitle: any, renderUser: any) {
    this.firebase
      .database()
      .ref(`Groups/${groupID}`)
      .once('value', (snapshot) => {
        console.log('snapshot group in DB', snapshot.val());
        const title = snapshot.val().title;
        renderGroupTitle(transID, title);
        const userList: any[] = snapshot.val().userList;
        userList.forEach ((userID: string) => {
          this.firebase
            .database()
            .ref(`User/${userID}`)
            .once('value', (snapshot) => {
              // console.log('snapshot "getUserInfo" -  User Data:', snapshot.val());
              const dataUser = snapshot.val();
              dataUser.key = userID;
              renderUser(transID, trans, dataUser);
              // callback(snapshot.val());
            });
            
        });


        
      }, (error: { code: string; }) => {
        console.log('Error: ' + error.code);
      });
  }

}



