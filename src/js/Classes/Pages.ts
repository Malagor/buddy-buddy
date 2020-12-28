import { authHTML } from '../pages/auth';
import { getFormData } from '../Util/getFormData';
import { userHTML } from '../pages/user';

export class Pages {
  private content: HTMLElement;
  public onSignIn: any = null;
  public onLogin: any = null;

  constructor(el: string) {
    this.content = document.querySelector(el);
  }

  static create(el: string) {
    return new Pages(el);
  }

  auth() {
    this.content.innerHTML = authHTML();

    const form = document.querySelector('#auth-form');
    form.addEventListener('submit', e => {
      e.preventDefault();
      const { email, password } = getFormData(form);
      this.onSignIn(email, password);
    });

    const login = document.querySelector('#login');

    login.addEventListener('click', (e) => {
      e.preventDefault();
      const { email, password } = getFormData(form);

      if (!email || !password) return;

      this.onLogin(email, password);
    });
  }

  user() {
    this.content.innerHTML = userHTML();
  }

  main() {

  }
}
