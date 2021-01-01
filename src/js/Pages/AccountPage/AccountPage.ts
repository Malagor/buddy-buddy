import { Page } from '../../Classes/Page';

export class AccountPage extends Page {
  constructor(element: string) {
    super(element);
  }

  static create(element: string): AccountPage {
    return new AccountPage(element);
  }

  render = (data?: any): void => {
    console.log(data);
    this.element.innerHTML = `
    <div class="account__header">
      <img src="${data.avatar}" alt="${data.name}" class="account__image account__image__scroll_out">
      <p class="account__nick">@${data.id}</p>
      <button type="button" class="account__button_change_photo"><i class="material-icons">monochrome_photos</i></button>
    </div>
    <div class="account__info">
      <p class="account__info__name">${data.name}</p>
      <button type="button" class="account__button_edit"><i class="material-icons">edit</i></button>
      <ul class="account__info__list">
      <li class="account__info__list__item">email@mail.ru</li>
      <li class="account__info__list__item">21.05.1999</li>
      <li class="account__info__list__item"></li>
      <li class="account__info__list__item">My groups</li>
      <li class="account__info__list__item">Settings</li>
      </ul>
    </div>
    <p class="account__balance">Balance</p>
      `;
    this.events();
  };

  protected events(): void {}
}
