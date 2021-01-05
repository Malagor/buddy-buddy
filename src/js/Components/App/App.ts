import { AuthPage } from '../../Pages/AuthPage/AuthPage';
import { RegistrationPage } from '../../Pages/RegistrationPage/RegistrationPage';
import { Database } from '../../Classes/Database';
import { Main } from '../../Pages/Main/Main';
import { Sidebar } from '../../Pages/Sidebar/Sidebar';
import { MyGroups } from '../../Pages/MyGroups/MyGroups';

export class App {
  private authPage: AuthPage;
  private regPage: RegistrationPage;
  private database: Database;
  private mainPage: Main;
  private sidebar: Sidebar;
  private groups: MyGroups;

  constructor() {
    // DATA BASE
    this.database = Database.create();

    // PAGES
    this.authPage = AuthPage.create('.main');
    this.regPage = RegistrationPage.create('.main');
    this.mainPage = Main.create('.main');
    this.sidebar = Sidebar.create('aside');
    this.groups = MyGroups.create('.main');

    // COMPONENTS
    this.init();
  }

  static create() {
    return new App();
  }

  init() {
    // Handlers
    this.authPage.onTransitionSignInPage = this.registrationUserPage.bind(this);
    // this.authPage.onLogin = this.onLogin.bind(this);

    this.regPage.onSignIn = this.onSignIn.bind(this);
    this.regPage.goToLoginPage = this.loadLoginPage.bind(this);
    this.regPage.onGoogleReg = this.onGoogleReg.bind(this);

    this.sidebar.onSignOut = this.onSignOut.bind(this);

    this.database.init([this.mainPage.render, this.sidebar.render], [this.authPage.render]);
  }

  onSignOut(): any {
    this.database.signOut(this.authPage.render);
  }

  onSignIn(email: string, password: string, name: string) {
    this.database.createUserByEmeil(email, password, name);
  }

  onGoogleReg() {
    this.database.createUserByGoogle();
  }

  registrationUserPage() {
    this.regPage.render();
  }

  loadLoginPage() {
    this.authPage.render();
  }

  loadMainPage() {
    this.mainPage.render();
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

  // createBasicTables() {
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
  //   //  CURRENCY
  //   const currency1 = {
  //     name: 'Доллар США',
  //   };
  //   const currency2 = {
  //     name: 'Беларусский Рубль',
  //   };
  //   const currencyBase1 = firebase.database().ref(`Currency/USD`);
  //   const currencyBase2 = firebase.database().ref(`Currency/BYN`);
  //   currencyBase1.set(currency1);
  //   currencyBase2.set(currency2);
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
  // }
}


