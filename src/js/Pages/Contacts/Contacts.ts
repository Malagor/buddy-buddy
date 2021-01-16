import { Page } from '../../Classes/Page';

export class Contacts extends Page {
  static create(element: string): Contacts {
    return new Contacts(element);
  }

  render(data: any): void {
    let html = `
      <div class="block__wrapper d-flex align-items-center flex-column">
        <div class="block__content d-flex align-items-center flex-column w-100">
          <div class="block__header account__header--main d-flex align-items-center">
            <p class="block__nick">Contacts</p>
          </div>
          <div class="message-list block--width-85 d-flex flex-column">
          <p>${data}</p>
          </div>
        <button type="button" class="btn btn-primary d-flex align-items-center justify-content-center message__addBtn"><span class="material-icons">add</span></button>
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
            <h5 class="modal-title" id="exampleModalLabel">Add Contact</h5>
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
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="submit" class="btn btn-primary" form="messageForm">Send</input>
            </form>
          </div>
        </div>
      </div>
    </div>
    `;
  }
}
