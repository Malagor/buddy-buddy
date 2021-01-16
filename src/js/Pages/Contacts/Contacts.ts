import { Page } from '../../Classes/Page';
import { getFormData } from '../../Util/getFormData';

export interface ISearchUserData {
  name?: string;
  account?: string;
}

export class Contacts extends Page {
  addUserToContacts: any;

  static create(element: string): Contacts {
    return new Contacts(element);
  }

  render(): void {
    this.element.innerHTML = `
      <div class="block__wrapper d-flex align-items-center flex-column">
        <div class="block__content d-flex align-items-center flex-column w-100">
          <div class="block__header account__header--main d-flex align-items-center">
            <p class="block__nick">Contacts</p>
          </div>
          <form id="contactForm" class="search-form">
            <div class="input-group">
              <span class="input-group-text" id="basic-addon1">@</span>
              <input type="text" class="form-control" placeholder="Account" aria-label="Account contact" aria-describedby="basic-addon1" name="account">
            </div>
            <div class="input-group">
              <span class="input-group-text" id="basic-addon2">Name</span>
              <input type="text" class="form-control" placeholder="Contact\`s name" aria-label="Contact\`s name" aria-describedby="basic-addon2" name="name">
            </div>
            <button type="submit" class="btn btn-primary" form="contactForm">Add</button>
            <div class="contact__message error-message"></div>
          </form>
          <div class="contacts-list block--width-85"></div>
      </div>
    `;

    this.events();
  }


  addContactToList = (data: any): void => {
    if (data) {
      const list = this.element.querySelector('.contacts-list');
      if (!list) return;

      let htmlContact = `
    <div class="contact" data-user-id="${data.key}">
      <div class="contact__avatar-wrapper">
        <img src="${data.avatar}" alt="${data.name}">
      </div>
      <div class="contact__name">${data.name}</div>
      <div class="contact__account">${data.account}</div>
      <div class="contact__buttons">
        <button type="button" class="btn btn-secondary contact__button">Button</button>
      </div>
    </div>
    `;

      list.insertAdjacentHTML('afterbegin', htmlContact);

      const formInputs: NodeListOf<HTMLInputElement> = this.element.querySelectorAll('#contactForm input');
      formInputs.forEach(input => {
        input.value = '';
      });
    }

  }

  protected events(): void {
    const form: HTMLFormElement = this.element.querySelector('#contactForm');

    form.onsubmit = (ev) => {
      ev.preventDefault();
      const formData: ISearchUserData = getFormData(form);
      if (formData.account !== '' && formData.name !== '') {
        this.errorMessageForm('Enter either your account or username.');
        return;
      }
      if (formData.account || formData.name) {
        this.addUserToContacts(formData, this.errorMessageForm);
      } else {
        this.errorMessageForm('You need to enter the user\'s name or account.');
        return;
      }
    };
  }

  errorMessageForm(message: string): void {
    const errorField: HTMLElement = document.querySelector('.error-message');
    errorField.textContent = message;
  }
}
