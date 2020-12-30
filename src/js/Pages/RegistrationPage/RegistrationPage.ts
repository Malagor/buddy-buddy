import { Page } from '../../Classes/Page';
import { getFormData } from '../../Util/getFormData';
import { show } from '../../Util/show';

const logo = require('../../../assets/icons/team.svg');

export class RegistrationPage extends Page {
  onSignIn: any;
  goToLoginPage: any;
  googleReg: any;

  constructor(element: string) {
    super(element);
  }

  static create(element: string) {
    return new RegistrationPage(element);
  }

  public render(): void {
    this.element.innerHTML = `
      <div class="logo__wrapper">
      ${logo}
      </div>
      <div class="app__title"><h1>Buddy-Buddy</h1></div>
      <div class="app__subtitle"><p>Your assistant in mutual settlements</p></div>
      <form id="authForm" method="post" class="auth-form">
      <h2 class="form__title">Registration</h2>
      <input id="name" type="text" name="name" placeholder="Your Name">
      <input id="email" type="email" name="email" placeholder="Your Email">
      <input id="password" type="password" name="password" placeholder="Your password">
      <div class="reg-icons__wrapper">
        <button class="reg-icon reg-icon__google" id="googleReg"></button>
      </div>
      <div class="button__wrapper">
        <button class="btn" id="login" form="auth-form">Login</button>
        <button class="btn" id="signIn" type="submit" form="auth-form">Sign In</button>
      </div>
      </form>
      `;

    const form: HTMLElement = document.querySelector('#authForm');
    show(form, false);
    show(form, true);

    this.events();
  }

  protected events(): void {
    // SIGN IN
    const form: HTMLFormElement = document.querySelector('#authForm');
    const submitBtn = document.getElementById('signIn');
    submitBtn.addEventListener('click', e => {
      console.log(form);
      console.log('Event - signIn');
      e.preventDefault();

      const { email, password, name }: any = getFormData(form);
      console.log(email, password, name);
      this.onSignIn(email, password, name);
    });

    // LOGIN
    const login: Element = document.querySelector('#login');
    login.addEventListener('click', (e) => {
      console.log('Event - Login');
      e.preventDefault();
      const { email, password }: any = getFormData(form);
      if (!email || !password) return;

      this.goToLoginPage();
    });

    const google: Element = document.querySelector('#googleReg');
    google.addEventListener('click', (e) => {
      console.log('Registration Google');
      e.preventDefault();

      this.googleReg();
    });
  }
}
