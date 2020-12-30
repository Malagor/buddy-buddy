import { Page } from '../../Classes/Page';
import { getFormData } from '../../Util/getFormData';
import { show } from '../../Util/show';

const logo = require('../../../assets/icons/team.svg');

import { MDCTextField } from '@material/textfield';
import { MDCFormField } from '@material/form-field';


export class AuthPage extends Page {
  onTransitionSignInPage: any;
  onLogin: any;

  constructor(element: string) {
    super(element);
  }

  static create(element: string): AuthPage {
    return new AuthPage(element);
  }

  render = (): void => {

    this.element.innerHTML = `
      <div class="logo__wrapper">
      ${logo}
      </div>
      <div class="app__title"><h1>Buddy-Buddy</h1></div>
      <div class="app__subtitle"><p>Your assistant in mutual settlements</p></div>

      <form id="authForm" method="post" class="auth-form">
        <h2 class="form__title">Login</h2>
        <label class="mdc-text-field mdc-text-field--filled email">
          <span class="mdc-text-field__ripple"></span>
          <input type="email" class="mdc-text-field__input" aria-labelledby="email-label" name="email" required>
          <span class="mdc-floating-label" id="email-label">Email</span>
          <span class="mdc-line-ripple"></span>
        </label>
        <label class="mdc-text-field mdc-text-field--filled password">
          <span class="mdc-text-field__ripple"></span>
          <input type="password" class="mdc-text-field__input" aria-labelledby="password-label" name="password" required minlength="8">
          <span class="mdc-floating-label" id="password-label">Password</span>
          <span class="mdc-line-ripple"></span>
        </label>
        <div class="button__wrapper">
          <div class="mdc-touch-target-wrapper">
            <button id="signIn" class="mdc-button mdc-button--touch" form="authForm" type="button">
              <div class="mdc-button__ripple"></div>
              <span class="mdc-button__label">Sign In</span>
              <div class="mdc-button__touch"></div>
            </button>
          </div>
          <div class="mdc-touch-target-wrapper">
            <button id="login" class="mdc-button mdc-button--touch" form="authForm" type="submit">
              <div class="mdc-button__ripple"></div>
              <span class="mdc-button__label">Login</span>
              <div class="mdc-button__touch"></div>
            </button>
          </div>
        </div>
      </form>
      `;


    new MDCTextField(document.querySelector('.email'));
    new MDCTextField(document.querySelector('.password'));


    const form: HTMLElement = document.querySelector('#authForm');
    show(form, false);
    show(form, true);

    this.events();
  };

  protected events(): void {
    const textField = new MDCFormField(document.querySelector('.mdc-text-field'));
    console.log('textField', textField);


    // SIGN IN
    const form: HTMLFormElement = document.querySelector('#authForm');
    const submitBtn = document.getElementById('signIn');
    submitBtn.addEventListener('click', e => {
      e.preventDefault();

      const { email, password }: any = getFormData(form);
      this.onTransitionSignInPage(email, password);
    });

    // LOGIN
    const login: Element = document.querySelector('#login');
    login.addEventListener('click', (e) => {
      console.log('Event - Login');
      e.preventDefault();
      const { email, password }: any = getFormData(form);
      if (!email || !password) return;

      this.onLogin(email, password);
    });
  }
}
