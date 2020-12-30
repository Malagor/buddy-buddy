import { Page } from '../../Classes/Page';
import { getFormData } from '../../Util/getFormData';
import { show } from '../../Util/show';
import { MDCTextField } from '@material/textfield';

const logo = require('../../../assets/icons/team.svg');

export class RegistrationPage extends Page {
  onSignIn: any;
  goToLoginPage: any;
  onGoogleReg: any;

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
        <label class="mdc-text-field mdc-text-field--filled name">
          <span class="mdc-text-field__ripple"></span>
          <input id="name" type="text" class="mdc-text-field__input" aria-labelledby="name-label" name="Name" required>
          <span class="mdc-floating-label" id="name-label">Name</span>
          <span class="mdc-line-ripple"></span>
        </label>
        <label class="mdc-text-field mdc-text-field--filled email">
          <span class="mdc-text-field__ripple"></span>
          <input id="email" type="email" class="mdc-text-field__input" aria-labelledby="email-label" name="email" required>
          <span class="mdc-floating-label" id="email-label">Email</span>
          <span class="mdc-line-ripple"></span>
        </label>
        <label class="mdc-text-field mdc-text-field--filled password">
          <span class="mdc-text-field__ripple"></span>
          <input id="password" type="password" class="mdc-text-field__input" aria-labelledby="password-label" name="password" required minlength="8">
          <span class="mdc-floating-label" id="password-label">Password</span>
          <span class="mdc-line-ripple"></span>
        </label>
        <div class="reg-icons__wrapper">
          <button class="reg-icon reg-icon__google" id="googleReg"></button>
        </div>
        <div class="button__wrapper">
          <div class="mdc-touch-target-wrapper">
            <button id="login" class="mdc-button mdc-button--touch" form="authForm" type="submit">
              <div class="mdc-button__ripple"></div>
              <span class="mdc-button__label">Login</span>
              <div class="mdc-button__touch"></div>
            </button>
          </div>
          <div class="mdc-touch-target-wrapper">
            <button id="signIn" class="mdc-button mdc-button--touch" form="authForm" type="button">
              <div class="mdc-button__ripple"></div>
              <span class="mdc-button__label">Sign In</span>
              <div class="mdc-button__touch"></div>
            </button>
          </div>
        </div>
      </form>
      `;

    new MDCTextField(document.querySelector('.email'));
    new MDCTextField(document.querySelector('.password'));
    new MDCTextField(document.querySelector('.name'));

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
      // const { email, password }: any = getFormData(form);
      // if (!email || !password) return;

      this.goToLoginPage();
    });

    const google: Element = document.querySelector('#googleReg');
    google.addEventListener('click', (e) => {
      console.log('Registration Google');
      e.preventDefault();

      this.onGoogleReg();
    });
  }
}
