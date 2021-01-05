import firebase from 'firebase';
import { Main } from '../Pages/Main/Main';
// import { saveUID, loadUID } from '../Util/saveLoadUid';

const defaultAvatar: string = require('../../assets/images/default-user-avatar.jpg');

export class Database {
  private DBase: firebase.app.App;
  public uid: string;
  private mainPage: Main;

  constructor(dbConfig: Object) {
    this.DBase = firebase.initializeApp(dbConfig);
    // this.init();
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

  init(isUserFuncs: any[], noUserFuncs: any[]) {
    this.DBase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        this.uid = user.uid;
        // console.log('Current user.uid = ', user.uid);
        this.getUserInfo(user.uid, isUserFuncs);
      } else {
        // No user is signed in.
        // console.log('No user');
        noUserFuncs.forEach(fn => fn());
        // noUserFunc();
      }
    });

    this.mainPage = Main.create('main.main');
  }

  createUserByEmeil(email: string, password: string, nameUser: string = '') {

    const userData = {
      name: nameUser,
      avatar: defaultAvatar,
      theme: 'Light',
      groupList: JSON.stringify([]),
      currentGroup: '',
      language: 'RU',
      currency: 'BYN',
    };

    this.DBase.auth().createUserWithEmailAndPassword(email, password)
      .then((data: { user: { uid: string; }; }) => {
        const uid: string = data.user.uid;
        // saveUID(uid);
        this._registrationUser(uid, userData);
      })
      .catch(function(error: { code: any; message: any; }) {
        console.log(error.code);
        console.log(error.message);
      });
  }

  createUserByGoogle(): void {
    let provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');

    this.DBase.auth().signInWithPopup(provider).then((result) => {
      // console.log('result', result);

      const profile: any = result.additionalUserInfo.profile;
      const uid = result.user.uid;
      // saveUID(uid);

      const userData = {
        name: profile.name,
        avatar: profile.picture,
        groupList: JSON.stringify([]),
        language: profile.locale.toUpperCase(),
        currentGroup: '',
        theme: 'Light',
        currency: 'BYN',
      };

      this._registrationUser(uid, userData);

    }).catch(function(error) {
      console.log(error.code);
      console.log(error.message);
    });
  }

  protected _registrationUser(uid: string, data: object) {
    const userRef = firebase.database().ref(`User/${uid}`);
    userRef.set(data);
  }

  getUserInfo(uid: string, callbacks: any[]): any {
    const ref = this.DBase.database().ref(`User/${uid}`);

    ref.on('value', (snapshot) => {
      // console.log(snapshot.val());
      callbacks.forEach(fn => fn(snapshot.val()));
      // callback(snapshot.val());
    }, (error: { code: string; }) => {
      console.log('Error: ' + error.code);
    });
  }

  signOut(callback?: any, arg?: any[]) {
    this.DBase.auth().signOut()
      .then(function() {
        console.log('Signout Succesfull');
        if (callback) {
          if (arg) {
            callback(arg);
          } else {
            callback();
          }
        }
      }, function(error) {
        console.log('Signout Failed');
        console.log(error.code);
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
}
