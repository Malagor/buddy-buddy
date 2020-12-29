import { Page } from '../../Classes/Page';
import { getFormData } from '../../Util/getFormData';

const logo = require('../../../assets/icons/team.svg');

export class AuthPage extends Page {
  onSignIn: any;
  onLogin: any;

  constructor(element: string) {
    super(element);
  }

  static create(element: string): AuthPage {
    return new AuthPage(element);
  }

  public render(): void {
    this.element.innerHTML = `
      <div class="logo__wrapper">
      ${logo}
      </div>
      <div class="app__title"><h1>Buddy-Buddy</h1></div>
      <div class="app__subtitle"><p>Your assistant in mutual settlements</p></div>
      <form id="authForm" method="post" class="auth-form">
      <input id="email" type="email" name="email" placeholder="Your Email">
      <input id="password" type="password" name="password" placeholder="Your password">
      <div class="button__wrapper">
        <button class="btn" id="login" form="auth-form">Login</button>
        <button class="btn" id="signIn" type="submit" form="auth-form">Sign In</button>
      </div>
      </form>
      `;

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

      const { email, password }: any = getFormData(form);
      console.log(email, password);
      this.onSignIn(email, password);
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
