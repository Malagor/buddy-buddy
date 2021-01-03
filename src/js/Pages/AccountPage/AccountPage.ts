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
    <div class="account__header account__header__scroll_out">
      <img src="${data.avatar}" alt="${data.name}" class="account__image account__image__scroll_out">
      <p class="account__nick">@${data.id}</p>
      <button type="button" class="account__button_change_photo"><i class="material-icons">monochrome_photos</i></button>
    </div>
    <div class="account__info">
      <p class="account__info__name">${data.name}</p>
      <button type="button" class="account__button_edit"><i class="material-icons">edit</i></button>
      <ul class="account__info__list">
      <li class="account__info__list__item">E-mail</li>
      <li class="account__info__list__item">DD/MM/YYYY</li>
      <li class="account__info__list__item"></li>
      <li class="account__info__list__item">My groups</li>
      <li class="account__info__list__item">Settings</li>
      </ul>
    </div>
    <p class="account__balance">Balance</p>
      `;
    this.events();
  };

  protected events(): void {
    let currentScroll: number;
    this.element.parentElement.addEventListener('scroll', (): void => {
      const header = document.querySelector('.account__header');
      if (this.element.parentElement.scrollTop > 0 && !currentScroll) {
        currentScroll = this.element.parentElement.scrollTop;
        this.element.parentElement.style.overflow = 'hidden';
        header.classList.remove('account__header__scroll_out');
        header.classList.add('account__header__scroll_in');
        setTimeout(() => {
          this.element.parentElement.style.overflow = '';
        }, 350);
      } else if (
        currentScroll > this.element.parentElement.scrollTop &&
        this.element.parentElement.scrollTop < 230
      ) {
        header.classList.add('account__header__scroll_out');
        header.classList.remove('account__header__scroll_in');
        this.element.parentElement.scrollIntoView();
        currentScroll = 0;
      }
    });
  }
}
