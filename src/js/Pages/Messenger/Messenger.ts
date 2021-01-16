import { Page } from '../../Classes/Page';
import { Modal } from 'bootstrap';

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
          <button type="button" class="btn btn-primary message__addBtn">New message</button>
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
              <div class="input-group col-12 mb-3">
                <span class="input-group-text" id="account-user">@</span>
                <input type="text" class="form-control" id="formRecipient" placeholder="Recipient" aria-label="Account Name" aria-describedby="account-user">
                <button type="button" class="btn btn-primary" id="addRecipient"><span class="material-icons">person_search</span></button>
              </div>
              <div class="col-12 mb-3 recipient-user"></div>
              <div class="mb-3">
                <textarea class="form-control" id="formMessage" rows="3" placeholder="Message" minlength="3"></textarea>
              </div>
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="submit" class="btn btn-primary" form="messageForm">Send</input>
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

    // Show modal event
    const addMessageBtn = document.querySelector('.message__addBtn');
    const modal = new Modal(this.element.querySelector('#messageModal'));
    addMessageBtn.addEventListener('click', () => {
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

      const toUserName: HTMLElement = form.querySelector('.recipient-user__name');
      let toUserID: string;
      if (!toUserName) {
        this.errorAddUserForSendMessage('No user selected to send the message!');
        return;
      } else {
        toUserID = toUserName.getAttribute('data-user-uid');
      }

      const messageTextarea: HTMLFormElement = form.querySelector('#formMessage');
      const message: string = messageTextarea.value;
      const date = Date.now();

      const messageData: INewMessage = {
        fromUser: null,
        toUser: toUserID,
        date,
        message,
        isRead: false,
      };
      this.sendNewMessage(messageData);
      modal.hide();
    };

    // Add Recipient User Name+Avatar in Message Form
    const addRecipient = form.querySelector('#addRecipient');
    addRecipient.addEventListener('click', (ev) => {
      ev.preventDefault();
      const recipientInput: HTMLFormElement = form.querySelector('#formRecipient');
      const accountUser: string = recipientInput.value;
      this.onAddRecipient(accountUser);
    });
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
      <div class="message block__card flex-column block--width-85 ${directionClass} ${stateClass} col-10 mb-3" data-message-id="${data.messageId}">
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
          <button type="button" class="btn btn-outline-primary btn-sm answer-button" data-user-uid="${data.key}">Answer</button>
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
}
