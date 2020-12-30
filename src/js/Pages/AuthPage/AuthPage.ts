import { Page } from '../../Classes/Page';
import { getFormData } from '../../Util/getFormData';
import { show } from '../../Util/show';

const logo = require('../../../assets/icons/team.svg');

export class AuthPage extends Page {
  onTransitionSignInPage: any;
  onLogin: any;

  constructor(element: string) {
    super(element);
  }

  static create(element: string): AuthPage {
    return new AuthPage(element);
  }

  public render = (): void => {

    this.element.innerHTML = `
      <div class="logo__wrapper">
      ${logo}
      </div>
      <div class="app__title"><h1>Buddy-Buddy</h1></div>
      <div class="app__subtitle"><p>Your assistant in mutual settlements</p></div>
      <form id="authForm" method="post" class="auth-form">
      <h2 class="form__title">Login</h2>
      <input id="email" type="email" name="email" placeholder="Your Email">
      <input id="password" type="password" name="password" placeholder="Your password">
      <div class="button__wrapper">
        <button class="btn" id="signIn" type="submit" form="auth-form">Sign In</button>
        <button class="btn" id="login" form="auth-form">Login</button>
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
