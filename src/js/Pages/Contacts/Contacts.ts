import { Page } from '../../Classes/Page';
import { getFormData } from '../../Util/getFormData';

export interface ISearchUserData {
  name?: string;
  account?: string;
}

export class Contacts extends Page {
  addUserToContacts: any;
  onChangeContactState: any;

  static create(element: string): Contacts {
    return new Contacts(element);
  }

  render(): void {
    this.element.innerHTML = `
      <div class="block__wrapper">
        <div class="block__content">
          <div class="block__header block__header--main">
            <p class="block__title">Contacts</p>
          </div>
          <div class="block__main">
            <form id="contactForm" class="search-form block--width-85">
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
      </div>
    `;

    this.events();
  }

  addContactToList = (data: any): void => {
    // console.log('addContactToList - data', data);
    if (data) {
      const list = this.element.querySelector('.contacts-list');
      if (!list) return;

      const pendingClass = data.state === 'pending' ? 'contact--pending' : '';

      let htmlContact = `
    <div class="contact block__card ${pendingClass}" data-user-id="${data.key}">
      <div class="contact__avatar-wrapper">
        <img src="${data.avatar}" alt="${data.name}">
      </div>
      <div class="contact__name">${data.name}</div>
      <div class="contact__account">${data.account}</div>
      `;

      if (data.state !== 'approve') {
        htmlContact += `
          <div class="contact__buttons">
            <select class="form-select form-select-sm" aria-label=".form-select-sm state">
              <option value="approve">Approve</option>
              <option value="pending" ${data.state === 'pending' ? 'selected' : ''}>Pending</option>
              <option value="decline" ${data.state === 'decline' ? 'selected' : ''}>Decline</option>
            </select>
          </div>
        `;
      }

      htmlContact += '</div>';

      list.insertAdjacentHTML('afterbegin', htmlContact);

      const formInputs: NodeListOf<HTMLInputElement> = this.element.querySelectorAll('#contactForm input');
      formInputs.forEach(input => {
        input.value = '';
      });
    }

    const select: HTMLFormElement = this.element.querySelector(`[data-user-id="${data.key}"] select`);
    if (select) {
      select.addEventListener('change', (ev) => {
        const { target }: any = ev;
        const userId: string = target.closest('.contact').getAttribute('data-user-id');
        console.log('userId', userId);
        console.log('select.value', select.value);

        this.onChangeContactState(userId, select.value);
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

  // Add contact to user list in Modal
  addContactsToList = (data: any): void => {
    const list = document.querySelector('.contacts-user-list');
    const html = `
      <li class="contact-list__item" data-user-id="${data.key}">
        <img class="contact-list__avatar" src="${data.avatar}" alt="${data.name}">
        <span class="contact-list__name">${data.name}</span><span class="contact-list__account"><@${data.account}></span>
      </li>
    `;
    list.insertAdjacentHTML('afterbegin', html);
  }
}
