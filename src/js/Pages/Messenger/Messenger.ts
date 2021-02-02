import { Page } from '../../Classes/Page';
import { Modal } from 'bootstrap';
import { getFormData } from '../../Util/getFormData';
import { eventForContactsList } from '../Contacts/eventForContactsList';
import { onClickContactInContactsList } from '../Contacts/onClickContactInContactsList';

export interface IMessage {
  messageId: string | undefined;
  key?: string;
  name?: string;
  avatar?: string;
  date: number;
  message: string;
  isRead: boolean;
  isReceive: boolean;
}

export interface INewMessage {
  fromUser: string | null;
  toUser: string;
  date: number;
  isRead: boolean;
  message: string;
}

export class Messenger extends Page {
  onAddRecipient: any;
  sendNewMessage: any;
  onAnswerMessage: any;
  fillContactsList: any;

  static create(element: string): Messenger {
    const page = new Messenger(element);
    page.addMessageToList = page.addMessageToList.bind(page);
    return page;
  }

  render(): void {
    let html = `
    <div class="block__wrapper">
      <div class="block__content">
        <div class="block__header block__header--main">
          <p class="block__title">Messenger</p>
        </div>
        <div class="block__main">
          <div class="message-list block--width-85 d-flex flex-column"></div>
        </div>
        <div class="block__footer">
          <button type="button" class="btn btn-primary btn-primary-alternate message__addBtn">New message</button>
        </div>
      </div>
    </div>
    `;

    html += this.modalHTML();

    this.element.innerHTML = html;
    this.events();
  }

  modalHTML(): string {
    return `
    <div class="modal fade" id="messageModal" tabindex="-1" aria-labelledby="New message" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">New message</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="messageForm">
              <div class="dropdown">
                <input class="form-control dropdown-toggle mb-2" type="text" id="activeContact" data-bs-toggle="dropdown" aria-expanded="false" placeholder="Recipient" autocomplete="off" name="name">
                <input type="text" name="key" class="contact-user-id" hidden>
                <ul class="dropdown-menu contacts-user-list" aria-labelledby="activeContact">
                </ul>
              </div>
              <div class="mb-3">
                <textarea class="form-control" id="formMessage" rows="3" placeholder="Message" minlength="3" name="message"></textarea>
              </div>
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="submit" class="btn btn-primary btn-primary-alternate" form="messageForm">Send</input>
            </form>
          </div>
        </div>
      </div>
    </div>
    `;
  }

  protected events(): void {
    this.element.addEventListener('click', event => {
      const { target }: any = event;

      if (target.closest('.answer-button')) {
        const button: HTMLElement = target.closest('.answer-button');
        const userId = button.getAttribute('data-user-uid');

        this.onAnswerMessage(userId);
      }
    });

    // Auto-search Recipient of message
    const formRecipient: HTMLInputElement = document.querySelector('#activeContact');
    eventForContactsList(formRecipient);

    // select user as Recipient for message
    onClickContactInContactsList();


    // Show modal event
    const addMessageBtn = document.querySelector('.message__addBtn');
    const modal = new Modal(this.element.querySelector('#messageModal'));
    addMessageBtn.addEventListener('click', () => {

      document.querySelector('.contacts-user-list').innerHTML = '';
      this.fillContactsList();
      modal.show();
    });

    // Submit Form event
    const { messageForm }: any = document.forms;
    const form: HTMLFormElement = messageForm;
    form.onsubmit = (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
      event.preventDefault();

      const formData = getFormData(form);

      const messageData: INewMessage = {
        toUser: formData.key,
        message: formData.message,
        date: Date.now(),
        fromUser: null,
        isRead: false,
      };
      this.sendNewMessage(messageData);
      modal.hide();
    };
  }

  // Displays the current message on the page
  addMessageToList(data: IMessage): void {
    const dateOptions = {
      year: '2-digit',
      month: '2-digit',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    const date: Date = new Date(data.date);
    const localeDate: string = date.toLocaleString('ru-RU', dateOptions);

    let stateClass: string = '';
    if (data.isRead === false && data.isReceive) {
      stateClass = 'message--not-read';
    }
    let directionClass: string = 'align-self-end message--own';
    if (data.isReceive) {
      directionClass = 'align-self-start';
    }
    const messageList = this.element.querySelector('.message-list');

    if (!messageList) return;

    let html = `
      <div class="message block__card flex-column ${directionClass} ${stateClass} mb-3" data-message-id="${data.messageId}">
          <div class="message__avatar-wrapper">
            <img src="" alt="">
          </div>
          <div class="message__user-name fw-bold"></div>
          <div class="message__time">${localeDate}</div>
        <div class="message__text align-self-start mt-1">
          <span>${data.message}</span>
        </div>`;

    // If this is an incoming message we add the answer button
    if (data.isReceive) {
      html += `
        <div class="message__button">
          <button type="button" class="btn btn-outline-primary btn-outline-primary-alternate btn-sm answer-button" data-user-uid="${data.key}">Answer</button>
        </div>
        `;
    }
    html += `</div>`;

    messageList.insertAdjacentHTML('afterbegin', html);
  }

  // Fills in the message with the user's data
  setUserDataInMessage = (data: any): void => {
    const message = this.element.querySelector(`[data-message-id=${data.messageId}]`);
    if (!message) return;

    const img = message.querySelector('img');
    img.setAttribute('src', data.avatar);
    img.setAttribute('alt', data.name);

    const name = message.querySelector('.message__user-name');
    name.textContent = data.name;

    if (data.isReceive) {
      const btn = message.querySelector('.answer-button');
      btn.setAttribute('data-user-uid', data.key);
    }
  }

  // Add Recipient User Name+Avatar in Message Form
  addUserForSendMessage = (userData: any): void => {
    const userWrapper: HTMLElement = document.querySelector('.recipient-user');

    userWrapper.innerHTML = `
      <div class="recipient-user__image-wrapper"><img src="${userData.avatar}" alt="${userData.name}"></div>
      <div class="recipient-user__name" data-user-uid="${userData.key}">${userData.name}</div>
    `;
  }

  // Displays an error message in the form
  errorAddUserForSendMessage = (message: string): void => {
    const userWrapper: HTMLElement = document.querySelector('.recipient-user');
    userWrapper.innerHTML = `
    <p class="error-message">${message}</p>
    `;
  }

  // Calls a modal window for a response with the recipient's data filled in
  callAnswerModal = (data: any): void => {
    const formRecipient: HTMLFormElement = this.element.querySelector('#formRecipient');
    formRecipient.value = data.account;

    this.addUserForSendMessage(data);

    const modalBtn: HTMLElement = this.element.querySelector('.message__addBtn');
    modalBtn.click();

    const formMessage: HTMLFormElement = this.element.querySelector('#formMessage');
    formMessage.focus();

  }

  renderCarrency(data: any) {
    console.log(data);
  }

  errorHandler(message: string): void {
    console.error(message);
  }
}
