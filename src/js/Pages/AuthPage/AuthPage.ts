import { Page } from '../../Classes/Page';
import { getFormData } from '../../Util/getFormData';
import { currentYear } from '../../Util/currentYear';

import { i18n } from '@lingui/core';
import { messagesRU } from '../../languages/RU/messages';
import { messagesENG } from '../../languages/ENG/messages';
import { loadLanguage } from '../../Util/saveLoadLanguage';
i18n.load('RU', messagesRU);
i18n.load('ENG', messagesENG);

const locale = loadLanguage();
i18n.activate(locale);

const logo = require('../../../assets/icons/team.svg');

export class AuthPage extends Page {
  onLoadSignInPage: any;
  onLogin: any;
  onGoogleReg: any;

  constructor(element: string) {
    super(element);
  }

  static create(element: string): AuthPage {
    const page: AuthPage = new AuthPage(element);
    page.render = page.render.bind(page);
    return page;
  }

  render(): void {
    this.element.innerHTML = `
      <form id="authForm" class="position-absolute top-50 start-50 translate-middle auth-form">
        <h1 class="h3 mb-3 fw-normal">Buddy-buddy</h1>
        <div class="logo__wrapper">
          ${logo}
        </div>
        <h2 class="h3 mb-3 fw-normal">${i18n._('Login')}</h2>
          <div class="form-floating mb-3 w-75">
            <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com" name="email">
            <label for="floatingInput">${i18n._('Email address')}</label>
          </div>
          <div class="form-floating mb-3 w-75">
            <input type="password" class="form-control" id="floatingPassword" placeholder="Password" name="password">
            <label for="floatingPassword">${i18n._('Password')}</label>
          </div>
          <div class="error-message w-75 mb-3"></div>
          <div class="d-grid gap-5 d-md-block mb-3 reg-icons__wrapper">
            <button class="reg-icon reg-icon__google" id="googleReg"></button>
          </div>
          <div class="d-grid gap-5 d-md-block">
            <button class="btn btn-lg btn-link" type="button" id="signIn">${i18n._('Sign in')}</button>
            <button class="btn btn-lg btn-primary" type="submit" id="login">${i18n._('Login')}</button>
          </div>
        <p class="mt-5 mb-3 text-muted">&copy; 2020-${currentYear().toString(10)}</p>
      </form>
    `;

    this.events();
  }

  protected events(): void {
    // SIGN IN
    const form: HTMLFormElement = document.querySelector('#authForm');
    const submitBtn = document.getElementById('signIn');

    submitBtn.addEventListener('click', e => {
      e.preventDefault();

      const { email, password }: any = getFormData(form);
      this.onLoadSignInPage(email, password);
    });

    // LOGIN
    const login: Element = document.querySelector('#login');
    login.addEventListener('click', (e) => {
      e.preventDefault();
      const { email, password }: any = getFormData(form);
      if (!email || !password) return;

      this.onLogin(email, password);
    });

    const google: Element = document.querySelector('#googleReg');
    google.addEventListener('click', (e) => {
      e.preventDefault();

      this.onGoogleReg();
    });
  }

  showErrorMessage = (message: string) => {
    const error = this.element.querySelector('.error-message');
    error.textContent = message;
  }
}
