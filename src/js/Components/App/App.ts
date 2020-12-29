import firebase from 'firebase';
// import { getFormData } from '../../Util/getFormData';
import { getFormData } from '../../Util/getFormData';
import { AuthPage } from '../../Pages/AuthPage/AuthPage';

export class App {
  private DB: any;
  private authPage: AuthPage;

  constructor() {
    this.authPage = AuthPage.create('main.main');
    this.init();
  }

  static create() {
    return new App();
  }

  init() {
    // Handlers
    this.authPage.onSignIn = this.onSignIn.bind(this);
    this.authPage.onLogin = this.onLogin.bind(this);

    const firebaseConfig = {
      apiKey: 'AIzaSyCkKjHtqY5-St5y701m0MRByEzExRkga44',
      authDomain: 'buddy-buddy-8e497.firebaseapp.com',
      databaseURL: 'https://buddy-buddy-8e497-default-rtdb.firebaseio.com',
      projectId: 'buddy-buddy-8e497',
      storageBucket: 'buddy-buddy-8e497.appspot.com',
      messagingSenderId: '76694259219',
      appId: '1:76694259219:web:df287b978a199c54f2e1e6',
    };

    this.DB = firebase.initializeApp(firebaseConfig);

    this.authPage.render();
  }

  loginPage(uid: string) {
    const page: HTMLElement = document.querySelector('main.main');

    page.innerHTML = '' +
      '<form class="list" id="my-form">\n' +
      '        <ul>\n' +
      '          <li>\n' +
      '            <div class="item-content item-input">\n' +
      '              <div class="item-inner">\n' +
      '                <div class="item-title item-label">Name</div>\n' +
      '                <div class="item-input-wrap">\n' +
      '                  <input type="text" name="name" placeholder="Your name">\n' +
      '                </div>\n' +
      '              </div>\n' +
      '            </div>\n' +
      '          </li>\n' +
      '           <li>\n' +
      '            <div class="item-content item-input">\n' +
      '              <div class="item-inner">\n' +
      '                <div class="item-title item-label">Avatar</div>\n' +
      '                <div class="item-input-wrap">\n' +
      '                  <input type="file" name="avatar" placeholder="Your avatar" id="avatar">\n' +
      '                </div>\n' +
      '              </div>\n' +
      '            </div>\n' +
      '          </li>\n' +
      '          <li>\n' +
      '            <div class="item-content item-input">\n' +
      '              <div class="item-inner">\n' +
      '                <div class="item-title item-label">Language</div>\n' +
      '                <div class="item-input-wrap">\n' +
      '                  <select name="language">\n' +
      '                    <option value="ru">Русский</option>\n' +
      '                    <option value="eng">English</option>\n' +
      '                  </select>\n' +
      '                </div>\n' +
      '              </div>\n' +
      '            </div>\n' +
      '          </li>\n' +
      '          <li>\n' +
      '          <div class="item-content item-input">\n' +
      '            <div class="item-inner">\n' +
      '              <div class="item-title item-label">Currency</div>\n' +
      '              <div class="item-input-wrap">\n' +
      '                <select name="currency">\n' +
      '                  <option value="BYN">BYN</option>\n' +
      '                  <option value="RUB">RUB</option>\n' +
      '                  <option value="USD">USD</option>\n' +
      '                  <option value="EUR">EUR</option>\n' +
      '                </select>\n' +
      '              </div>\n' +
      '            </div>\n' +
      '          </div>\n' +
      '        </li>\n' +
      '          <li>\n' +
      '            <div class="item-content item-input">\n' +
      '              <div class="item-inner">\n' +
      '                <div class="item-title item-label">Theme</div>\n' +
      '                <div class="item-input-wrap">\n' +
      '                  <select name="theme">\n' +
      '                    <option value="light">Light</option>\n' +
      '                    <option value="dark">Dark</option>\n' +
      '                  </select>\n' +
      '                </div>\n' +
      '              </div>\n' +
      '            </div>\n' +
      '          </li>\n' +
      '        </ul>\n' +
      '      </form>\n' +
      '      <div class="block block-strong row">\n' +
      '        <div class="col"><a class="button convert-form-to-data" href="#">Save Data</a></div>\n' +
      '      </div>';

    document.querySelector('.convert-form-to-data').addEventListener('click', ()  => {
        this.createUser(uid);
      });
  }

  createUser(uid: string) {
    const form: HTMLFormElement = document.querySelector('#my-form');
    const formData: {[k: string]: any} = getFormData(form);

    const storageRef = firebase.storage().ref();
    const userRef = firebase.database().ref(`User/${uid}`);
    const file = document.querySelector('#avatar').files[0];

    const metadata = {
      'contentType': file.type,
    };

    storageRef.child('images/' + file.name).put(file, metadata).then(function(snapshot) {
      snapshot.ref.getDownloadURL()
        .then((url) => {
          formData['avatar'] = url;
        })
        .then(formData => {
          console.log('formData', formData);
          userRef.set(formData);
        })
        .catch(error => {
          console.log(error.code);
          console.log(error.message);
        });
    });
  }

  userPage(userData: { avatar: any; name: any; language: any; currency: any; theme: any; }) {
    const { avatar, name, language, currency, theme } = userData;
    document.querySelector('.page').innerHTML = `
           <img src="${avatar}" alt="${name}">
            <p>${name}</p>
            <p>${language}</p>
            <p>${currency}</p>
            <p>${theme}</p>`;

    console.log('userData from userPage()', userData);
  }

  onSignIn(email: string, password: string) {
    console.log('onSignIn');
    this.DB.auth().createUserWithEmailAndPassword(email, password)
      .then((data: { user: { uid: string; }; }) => {
        const uid: string = data.user.uid;

        localStorage.setItem('uid', uid);
        // this.loginPage.render(uid);


      })
      .catch(function(error: { code: any; message: any; }) {
        console.log(error.code);
        console.log(error.message);
      });
  }

  onLogin(email: string, password: string) {
    console.log('onLogin');
    this.DB.auth().signInWithEmailAndPassword(email, password)
      .then((data: { user: { uid: string; }; }) => {
        localStorage.setItem('uid', data.user.uid);
        const userRef = firebase.database().ref(`User/${data.user.uid}`);

        userRef.on('value', (snapshot) => {

          const userData = snapshot.val();
          console.dir('Data from DB: ', snapshot.val());
          this.userPage(userData);
        }, function(error: { code: string; }) {
          console.log('Error: ' + error.code);
        });
      })
      .catch(function(error: { code: any; message: any; }) {
        console.log(error.code);
        console.log(error.message);
      });
  }
}


