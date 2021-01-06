import { Page } from '../../Classes/Page';

export class AccountPage extends Page {
  static create(element: string): AccountPage {
    return new AccountPage(element);
  }

  render = (data: any): void => {
    this.element.innerHTML = `
    <div class="account__header account__header__scroll_out">
      <div class="account__image_wrapper">
        <img src="${data.avatar}" alt="${data.name}" class="account__image account__image__scroll_out">
      </div>
      <p class="account__nick">@${data.id}</p>
      <form action=#" enctype="multipart/form-data" method="post" class="account__form_change_photo">
        <label for="file" class="account__button_change_photo">
          <i class="material-icons">monochrome_photos</i>
        </label>
        <input type="file" name="avatar" id="file" class="account__input__photo">
      </form>      
    </div>
    <div class="account__info">
      <form action=#" enctype="multipart/form-data" method="post" class="account__form_change_info">
        <input type="text" value="${data.name}" name="name" class="account__info__input account__info__name" placeholder="Name Surname" required>
        <ul class="account__info__list">
        <li class="account__info__list__item">
          <input type="email" value="user@mail.ru" name="email" class="account__info__input" placeholder="E-mail" required>
        </li>
        <li class="account__info__list__item">
          <input type="date" value="21/05/1999" name="date" class="account__info__input" required placeholder="DD/MM/YYYY">
        </li>
        <li class="account__info__list__item">
          <input type="submit" value="Save" class="account__input_submit account__input_submit_off account__input_submit_no_changes" disabled>
        </li>
      </form>  
      <li class="account__info__list__item">
        <button type="button" class="account__button_groups account__button">
          My groups
        </button>
      </li>
      <li class="account__info__list__item">
        <button type="button" class="account__button_settings account__button">
          Settings
        </button>
        </li>
      </ul>
    </div>
    <p class="account__balance">Balance</p>
      `;
    this.events();
  };

  protected events(): void {
    let currentScroll: number;
    let values: string[] = [];
    const header: HTMLElement = this.element.querySelector('.account__header');
    const submitInfo: HTMLElement = this.element.querySelector(
      '.account__input_submit',
    );
    const inputPhoto: HTMLInputElement = this.element.querySelector(
      '.account__input__photo',
    );

    type newData = {
      [key: string]: string;
    };

    this.element.parentElement.addEventListener('scroll', (): void => {
      if (this.element.parentElement.scrollTop > 0 && !currentScroll) {
        currentScroll = this.element.parentElement.scrollTop;
        this.element.parentElement.style.overflow = 'hidden';
        header.classList.remove('account__header__scroll_out');
        header.classList.add('account__header__scroll_in');
        setTimeout((): void => {
          this.element.parentElement.style.overflow = '';
        }, 350);
      } else if (
        currentScroll > this.element.parentElement.scrollTop &&
        this.element.parentElement.scrollTop < 200
      ) {
        header.classList.add('account__header__scroll_out');
        header.classList.remove('account__header__scroll_in');
        this.element.parentElement.scrollIntoView();
        currentScroll = 0;
      }
    });

    inputPhoto.addEventListener('change', (): void => {
      if (inputPhoto.files[0]) {
        const newData: newData = {};
        const reader: FileReader = new FileReader();
        reader.onload = (function (aImg: HTMLImageElement) {
          return (e: any): void => {
            aImg.src = e.target.result;
            return (newData[inputPhoto.name] = e.target.result);
          };
        })(this.element.querySelector('.account__image'));
        reader.readAsDataURL(inputPhoto.files[0]);
        console.log(
          'Здесь могла быть ваша функция передачи информации в базу данных!',
          newData,
        );
      }
    });

    this.element
      .querySelector('.account__form_change_info')
      .addEventListener('submit', (e): void => {
        e.preventDefault();
        values = [];
        const newData: newData = {};
        document
          .querySelectorAll('.account__info__input')
          .forEach((item: HTMLInputElement): void => {
            values.push(item.value);
            newData[item.name] = item.value;
          });
        console.log(
          'Здесь могла быть ваша функция передачи информации в базу данных!',
          newData,
        );
        submitInfo.classList.add('account__input_submit_no_changes');
        submitInfo.setAttribute('disabled', 'true');
      });

    document
      .querySelectorAll('.account__info__input')
      .forEach((item: HTMLInputElement, index: number): void => {
        values.push(item.value);
        item.addEventListener('input', () => {
          if (values[index] !== item.value) {
            submitInfo.classList.remove('account__input_submit_no_changes');
            submitInfo.removeAttribute('disabled');
          } else {
            submitInfo.classList.add('account__input_submit_no_changes');
            submitInfo.setAttribute('disabled', 'true');
          }
        });
      });
  }
}
