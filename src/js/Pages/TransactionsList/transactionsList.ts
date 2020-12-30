import { Page } from '../../Classes/Page';

export class TransactionsList extends Page {
  // onTransitionSignInPage: any;
  // onLogin: any;

  constructor(element: string) {
    super(element);
  }

  static create(element: string): TransactionsList {
    return new TransactionsList(element);
  }

  public render = (): void => {

    this.element.innerHTML = `
      
      `;

    // this.events();
  }

  // protected events(): void {
  //   // SIGN IN
  //   const form: HTMLFormElement = document.querySelector('#authForm');
  //   const submitBtn = document.getElementById('signIn');
  //   submitBtn.addEventListener('click', e => {
  //     e.preventDefault();

  //     const { email, password }: any = getFormData(form);
  //     this.onTransitionSignInPage(email, password);
  //   });

  //   // LOGIN
  //   const login: Element = document.querySelector('#login');
  //   login.addEventListener('click', (e) => {
  //     console.log('Event - Login');
  //     e.preventDefault();
  //     const { email, password }: any = getFormData(form);
  //     if (!email || !password) return;

  //     this.onLogin(email, password);
  //   });
  // }
}
