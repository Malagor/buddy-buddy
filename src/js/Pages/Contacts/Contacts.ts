import { Page } from '../../Classes/Page';
import { getFormData } from '../../Util/getFormData';
import { Modal } from 'bootstrap';
import { i18n } from '@lingui/core';
import { messagesRU } from '../../languages/RU/messages';
import { messagesENG } from '../../languages/ENG/messages';
import { loadLanguage } from '../../Util/saveLoadLanguage';
// i18n.load('RU', messagesRU);
// i18n.load('ENG', messagesENG);

// const locale = loadLanguage();
// i18n.activate(locale);

export interface ISearchUserData {
  name?: string;
  account?: string;
}

export class Contacts extends Page {
  addUserToContacts: any;
  onChangeContactState: any;
  private deleteUserModal: Modal;
  onDeleteContact: any;

  static create(element: string): Contacts {
    return new Contacts(element);
  }

  render(): void {
    let html = `
      <div class="block__wrapper">
        <div class="block__content">
          <div class="block__header block__header--main">
            <p class="block__title">${i18n._('Contacts')}</p>
          </div>
          <div class="block__main">
            <form id="contactForm" class="search-form block--width-85">
              <div class="input-group search-form__account">
                <span class="input-group-text" id="account-addon">@</span>
                <input type="text" class="form-control" placeholder="${i18n._('Account')}" aria-label="Account contact" aria-describedby="account-addon" name="account">
              </div>
              <div class="input-group search-form__name">
                <span class="input-group-text" id="name-addon">${i18n._('Name')}</span>
                <input type="text" class="form-control" placeholder="${i18n._('Contact\`s name')}" aria-label="Contact\`s name" aria-describedby="name-addon" name="name">
              </div>
              <button type="submit" class="btn btn-primary btn-primary-alternate search-form__button" form="contactForm">${i18n._('Add')}</button>
              <div class="contact__message error-message"></div>
            </form>
            <div class="contacts-list block--width-85"></div>
          </div>
      </div>
    `;

    html += this.modalHtml();

    this.element.innerHTML = html;

    this.deleteUserModal = new Modal(document.getElementById('deleteUserModal'));

    this.events();
  }

  addContactToList = (data: any): void => {
    if (data && data.state !== 'decline') {
      const list = this.element.querySelector('.contacts-list');
      if (!list) return;

      const pendingClass = data.state === 'pending' ? 'contact--pending' : '';

      let htmlContact = `
    <div class="contact block__card ${pendingClass}" data-id-user="${data.key}">
      <div class="contact__avatar-wrapper">
        <img src="${data.avatar}" alt="${data.name}">
      </div>
      <div class="contact__name">${data.name}</div>
      <div class="contact__account">${data.account}</div>
      <div class="contact__delete"><button type="button" class="btn-close" aria-label="Close"></button></div>
      `;

      if (data.state !== 'approve') {
        htmlContact += `
          <div class="contact__buttons">
            <select class="form-select form-select-sm" aria-label="Contact state">
              <option value="approve">${i18n._('Approve')}</option>
              <option value="pending" ${data.state === 'pending' ? 'selected' : ''}>${i18n._('Pending')}</option>
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

    const select: HTMLFormElement = this.element.querySelector(`.contact[data-id-user="${data.key}"] select`);
    if (select) {
      select.addEventListener('change', (ev) => {
        const { target }: any = ev;
        const userId: string = target.closest('.contact').getAttribute('data-id-user');

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

    this.element.addEventListener('click', event => {
      const { target }: any = event;

      if (target.closest('.contact__delete')) {
        event.preventDefault();
        const cardContact: HTMLElement = target.closest('.contact');

        const userData = {
          userID: cardContact.getAttribute('data-id-user'),
          userName: cardContact.querySelector('.contact__name').textContent,
          userAccount: '@' + cardContact.querySelector('.contact__account').textContent,
          userAvatar: cardContact.querySelector('img').getAttribute('src'),
        };

        this._setDataModalDeleteUser(userData);

        this.deleteUserModal.show();
        // this.onDeleteContact(userID);
      }

      if (target.closest('#deleteUserBtn')) {
        const userBlock: HTMLElement = document.querySelector('#deleteUserModal .delete-modal__user');
        const userId: string = userBlock.getAttribute('data-id-user');
        this.onDeleteContact(userId);
        document.querySelector(`.contact[data-id-user="${userId}"]`).setAttribute('hidden', '');
        this.deleteUserModal.hide();
      }
    });
  }

  _setDataModalDeleteUser(userData: { userID: string; userAvatar: string; userName: string; userAccount: string; }): void {
    const userBlock = document.querySelector('.delete-modal__user');
    userBlock.setAttribute('data-id-user', userData.userID);
    const userAvatar = userBlock.querySelector('.delete-modal__avatar img');
    userAvatar.setAttribute('src', userData.userAvatar);
    userBlock.querySelector('.delete-modal__name').textContent = userData.userName;
    userBlock.querySelector('.delete-modal__account').textContent = userData.userAccount;
  }

  errorMessageForm(message: string): void {
    const errorField: HTMLElement = document.querySelector('.error-message');
    errorField.textContent = message;
  }

  // Add contact to user list in Modal
  addContactsToList = (data: any): void => {
    const list = document.querySelector(`${data.selector ? data.selector : '.contacts-user-list'}`);
    const html = `
      <li class="contact-list__item" data-user-id="${data.key}">
        <img class="contact-list__avatar" src="${data.avatar}" alt="${data.name}">
        <span class="contact-list__name">${data.name}</span><span class="contact-list__account"><@${data.account}></span>
      </li>
    `;
    list.insertAdjacentHTML('afterbegin', html);
  }

    modalHtml = () => {
    return `
    <div id="deleteUserModal" class="modal fade " tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Delete User from Contact List</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to remove this user from your contacts?</p>
            <div class="delete-modal__user" data-id-user="">
              <div class="delete-modal__avatar">
                <img src="" alt="">
              </div>
              <div class="delete-modal__name"></div>
              <div class="delete-modal__account"></div>
            </div>

          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" id="deleteUserBtn">Yes, delete user</button>
          </div>
        </div>
      </div>
    </div>
    `;
  }
}
