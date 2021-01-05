import { Page } from '../../Classes/Page';
import { getFormData } from '../../Util/getFormData';
import { show } from '../../Util/show';

const logo = require('../../../assets/icons/team.svg');
//
// import { MDCTextField } from '@material/textfield';
// import { MDCFormField } from '@material/form-field';


export class AuthPage extends Page {
  onLoadSignInPage: any;
  onLogin: any;

  constructor(element: string) {
    super(element);
  }

  static create(element: string): AuthPage {
    return new AuthPage(element);
  }

  render = (): void => {

    // this.element.innerHTML = `
    //   <div class="logo__wrapper">
    //   ${logo}
    //   </div>
    //   <div class="app__title"><h1>Buddy-Buddy</h1></div>
    //   <div class="app__subtitle"><p>Your assistant in mutual settlements</p></div>
    //
    //   <form id="authForm" method="post" class="auth-form">
    //     <h2 class="form__title">Login</h2>
    //     <label class="mdc-text-field mdc-text-field--filled email">
    //       <span class="mdc-text-field__ripple"></span>
    //       <input type="email" class="mdc-text-field__input" aria-labelledby="email-label" name="email" required>
    //       <span class="mdc-floating-label" id="email-label">Email</span>
    //       <span class="mdc-line-ripple"></span>
    //     </label>
    //     <label class="mdc-text-field mdc-text-field--filled password">
    //       <span class="mdc-text-field__ripple"></span>
    //       <input type="password" class="mdc-text-field__input" aria-labelledby="password-label" name="password" required minlength="8">
    //       <span class="mdc-floating-label" id="password-label">Password</span>
    //       <span class="mdc-line-ripple"></span>
    //     </label>
    //     <div class="button__wrapper">
    //       <div class="mdc-touch-target-wrapper">
    //         <button id="signIn" class="mdc-button mdc-button--touch" form="authForm" type="button">
    //           <div class="mdc-button__ripple"></div>
    //           <span class="mdc-button__label">Sign In</span>
    //           <div class="mdc-button__touch"></div>
    //         </button>
    //       </div>
    //       <div class="mdc-touch-target-wrapper">
    //         <button id="login" class="mdc-button mdc-button--touch" form="authForm" type="submit">
    //           <div class="mdc-button__ripple"></div>
    //           <span class="mdc-button__label">Login</span>
    //           <div class="mdc-button__touch"></div>
    //         </button>
    //       </div>
    //     </div>
    //   </form>
    //   `;

    this.element.innerHTML = `
      <form id="authForm" class="position-absolute top-50 start-50 translate-middle auth-form">
        <h1 class="h3 mb-3 fw-normal">Buddy-buddy</h1>
        <div class="logo__wrapper">
          ${logo}
        </div>
        <h2 class="h3 mb-3 fw-normal">Login</h2>
          <div class="form-floating mb-3 w-75">
            <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com">
            <label for="floatingInput">Email address</label>
          </div>
          <div class="form-floating mb-3 w-75">
            <input type="password" class="form-control" id="floatingPassword" placeholder="Password">
            <label for="floatingPassword">Password</label>
          </div>
          <div class="d-grid gap-5 d-md-block">
            <button class="btn btn-lg btn-link" type="button" id="signIn">Sign in</button>
            <button class="btn btn-lg btn-primary" type="submit" id="login">Login</button>
          </div>
        <p class="mt-5 mb-3 text-muted">&copy; 2020-2021</p>
      </form>
    `;
    //
    // new MDCTextField(document.querySelector('.email'));
    // new MDCTextField(document.querySelector('.password'));


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
      console.log('SignIn');
      e.preventDefault();

      const { email, password }: any = getFormData(form);
      this.onLoadSignInPage(email, password);
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
