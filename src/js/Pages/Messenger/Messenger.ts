import { Page } from '../../Classes/Page';
import { Modal } from 'bootstrap';

export interface IMessage {
  messageId: string | undefined;
  key: string;
  name: string;
  avatar: string;
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
    page.printMessage = page.printMessage.bind(page);
    return page;
  }

  render(): void {
    let html = `
      <div class="block__wrapper d-flex align-items-center flex-column">
        <div class="block__content d-flex align-items-center flex-column w-100">
          <div class="block__header account__header--main d-flex align-items-center">
            <p class="block__nick">Messenger</p>
          </div>
          <div class="message-list block--width-85 d-flex flex-column">
          </div>
        <button type="button" class="btn btn-primary d-flex align-items-center justify-content-center message__addBtn"><span class="material-icons">add</span></button>
      </div>
    `;

    html += this.modal();

    this.element.innerHTML = html;
    this.events();
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


    const addMessageBtn = document.querySelector('.message__addBtn');
    const modal = new Modal(this.element.querySelector('#messageModal'));
    addMessageBtn.addEventListener('click', () => {
      modal.show();
    });

    const { messageForm }: any = document.forms;
    const form: HTMLFormElement = messageForm;

    form.onsubmit = (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
      event.preventDefault();

      const toUser: string = form.querySelector('.recipient-user__name').getAttribute('data-user-uid');
      const messageTextarea: HTMLFormElement = form.querySelector('#formMessage');
      const message: string = messageTextarea.value;
      const date = Date.now();

      const messageData: INewMessage = {
        fromUser: null,
        toUser,
        date,
        message,
        isRead: false,
      };
      this.sendNewMessage(messageData);
      modal.hide();
    };

    const addRecipient = form.querySelector('#addRecipient');
    addRecipient.addEventListener('click', (ev) => {
      ev.preventDefault();
      const recipientInput: HTMLFormElement = form.querySelector('#formRecipient');
      const accountUser: string = recipientInput.value;
      this.onAddRecipient(accountUser);
    });
  }

  printMessage(data: IMessage): void {
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
    let directionClass: string = 'align-self-end';
    if (data.isReceive) {
      directionClass = 'align-self-start';
    }
    const messageList = this.element.querySelector('.message-list');

    let html = `
      <div class="message d-flex flex-column align-items-center main--border ${directionClass} ${stateClass} col-10" data-message-id="${data.messageId}">
        <div class="message__header align-self-start">
          <div class="message__avatar-wrapper">
            <img src="${data.avatar}" alt="${data.name}">
          </div>
          <div class="message__user-name fw-bold">${data.name}</div>
          <div class="message__time">${localeDate}</div>
        </div>
        <div class="main__currency__current align-self-start mt-1">
          <span>${data.message}</span>
        </div>`;

    if (data.isReceive) {
      html += `
        <div class="main__currency__current align-self-end mt-2">
        <button type="button" class="btn btn-outline-primary btn-sm answer-button" data-user-uid="${data.key}">Answer</button>
        </div>
        `;
    }

    html += `</div>`;

    messageList.insertAdjacentHTML('afterbegin', html);
  }

  // printMessage(data: IMessage): void {
  //   console.log('printMessage', data);
  //   const dateOptions = {
  //     year: '2-digit',
  //     month: '2-digit',
  //     day: 'numeric',
  //     hour: '2-digit',
  //     minute: '2-digit',
  //   };
  //   const date: Date = new Date(data.date);
  //   const localeDate: string = date.toLocaleString('ru-RU', dateOptions);
  //
  //   let stateClass: string = '';
  //   if (data.status === false && data.direction) {
  //     stateClass = 'message--not-read';
  //   }
  //   let directionClass: string = 'align-self-end';
  //   if (data.direction) {
  //     directionClass = 'align-self-start';
  //   }
  //   const messageList = this.element.querySelector('.message-list');
  //
  //   let html = `
  //     <div class="message d-flex flex-column align-items-center main--border ${directionClass} ${stateClass} col-10" data-message-id="${data.messageId}">
  //       <div class="message__header align-self-start">
  //         <div class="message__avatar-wrapper">
  //           <img src="}" alt="">
  //         </div>
  //         <div class="message__user-name fw-bold"></div>
  //         <div class="message__time">${localeDate}</div>
  //       </div>
  //       <div class="main__currency__current align-self-start mt-1">
  //         <span>${data.message}</span>
  //       </div>`;
  //
  //   if (data.direction) {
  //     html += `
  //       <div class="main__currency__current align-self-end mt-2">
  //       <button type="button" class="btn btn-outline-primary btn-sm answer-button" data-user-uid="">Answer</button>
  //       </div>
  //       `;
  //   }
  //
  //   html += `</div>`;
  //
  //   messageList.insertAdjacentHTML('afterbegin', html);
  // }

  setUserDataInMessage = (data: any): void => {
    const message = this.element.querySelector(`[data-message-id=${data.messageId}]`);
    const img = message.querySelector('img');
    img.setAttribute('src', data.avatar);
    img.setAttribute('alt', data.name);

    const name = message.querySelector('.message__user-name');
    name.textContent = data.name;

    if (data.direction) {
      const btn = message.querySelector('.answer-button');
      btn.setAttribute('data-user-uid', data.key);
    }
  }

  modal(): string {
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

  addUserForSendMessage = (userData: any): void => {
    const userWrapper: HTMLElement = document.querySelector('.recipient-user');

    userWrapper.innerHTML = `
      <div class="recipient-user__image-wrapper"><img src="${userData.avatar}" alt="${userData.name}"></div>
      <div class="recipient-user__name" data-user-uid="${userData.key}">${userData.name}</div>
    `;
  }

  errorAddUserForSendMessage = (message: string): void => {
    const userWrapper: HTMLElement = document.querySelector('.recipient-user');
    userWrapper.innerHTML = `
    <p class="error-message">${message}</p>
    `;
  }

  answerModal = (data: any): void => {
    const formRecipient: HTMLFormElement = this.element.querySelector('#formRecipient');
    formRecipient.value = data.account;

    this.addUserForSendMessage(data);

    const modalBtn: HTMLElement = this.element.querySelector('.message__addBtn');
    modalBtn.click();

    const formMessage: HTMLFormElement = this.element.querySelector('#formMessage');
    formMessage.focus();

  }
}
