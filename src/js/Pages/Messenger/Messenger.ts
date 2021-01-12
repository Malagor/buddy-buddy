import { Page } from '../../Classes/Page';
import { Modal } from 'bootstrap';

interface IMessage {
  key: string;
  name: string;
  avatar: string;
  date: Date;
  message: string;
}

export class Messenger extends Page {
  onAddRecipient: any;
  sendNewMessage: any;
  static create(element: string): Messenger {
    const page = new Messenger(element);
    page.printMessage = page.printMessage.bind(page);
    return page;
  }

  render(): void {
    let html = `
      <div class="account__wrapper d-flex align-items-center flex-column">
        <div class="account__info d-flex align-items-center flex-column w-100">
          <div class="account__header account__header--main d-flex align-items-center">
            <p class="account__nick">Messenger</p>
          </div>
          <div class="message-list account--width-85">
          </div>
        <button type="button" class="btn btn-primary d-flex align-items-center justify-content-center message__addBtn"><span class="material-icons">add</span></button>
      </div>
    `;

    html += this.modal();

    this.element.innerHTML = html;
    this.events();
  }

  protected events(): void {

    const addMessageBtn = document.querySelector('.message__addBtn');

    addMessageBtn.addEventListener('click', () => {
      // const { target }: any = ev;
      // if (target.closest('.message__addBtn')) {
        console.log('ShowModal');
        const modal = new Modal(this.element.querySelector('#messageModal'));
        modal.show();
      // }
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

      const messageData = {
        fromUser: '',
        toUser,
        date,
        message,
        status: false
      };
      this.sendNewMessage(messageData);
      const modal = new Modal(this.element.querySelector('#messageModal'));
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
    const messageList = this.element.querySelector('.message-list');

    messageList.insertAdjacentHTML('beforeend', `
      <div class="message d-flex flex-column align-items-center main--border">
        <div class="message__header align-self-start">
          <div class="message__avatar-wrapper">
            <img src="${data.avatar}" alt="${data.name}">
          </div>
          <div class="message__user-name fw-bold">${data.name}</div>
          <div class="message__time">${data.date}</div>
        </div>
        <div class="main__currency__current align-self-start mt-1">
          <span>${data.message}</span>
        </div>
        <div class="main__currency__current align-self-end mt-2">
          <button type="button" class="btn btn-outline-primary btn-sm" data-user-uid="${data.key}">Answer</button>
        </div>
      </div>
    `);
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
}
