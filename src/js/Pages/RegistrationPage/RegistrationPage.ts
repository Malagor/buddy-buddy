import { Page } from '../../Classes/Page';
import { getFormData } from '../../Util/getFormData';
import { currentYear } from '../../Util/currentYear';
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
      <form id="authForm" class="position-absolute top-50 start-50 translate-middle auth-form">
        <h1 class="h3 mb-3 fw-normal">Buddy-buddy</h1>
        <div class="logo__wrapper">
          ${logo}
        </div>
        <h2 class="h3 mb-3 fw-normal">Registration</h2>
          <div class="form-floating mb-3 w-75">
            <input type="text" class="form-control" id="floatingInput" placeholder="name">
            <label for="floatingInput">Name</label>
          </div>
          <div class="form-floating mb-3 w-75">
            <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com">
            <label for="floatingInput">Email address</label>
          </div>
          <div class="form-floating mb-3 w-75">
            <input type="password" class="form-control" id="floatingPassword" placeholder="Password">
            <label for="floatingPassword">Password</label>
          </div>
          <div class="d-grid gap-5 d-md-block mb-3 reg-icons__wrapper">
            <button class="reg-icon reg-icon__google" id="googleReg"></button>
          </div>
          <div class="d-grid gap-5 d-md-block">
            <button class="btn btn-lg btn-link" type="button" id="login">Login</button>
            <button class="btn btn-lg btn-primary" type="submit" id="signIn">Sign in</button>
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
