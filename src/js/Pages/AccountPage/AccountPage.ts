import { Page } from '../../Classes/Page';
import { getFormData } from '../../Util/getFormData';

export class AccountPage extends Page {
  updateInfo: any;

  static create(element: string): AccountPage {
    return new AccountPage(element);
  }

  renderCurrencyOrLangOrTheme(data: any, currentCurrency: string): void {
    let el: HTMLElement;
    if (data.some((item: any) => item === 'RU')) {
      el = document.querySelector('.form-select--lang');
    } else if (data.some((item: any) => item === 'BYN')) {
      el = document.querySelector('.form-select--curr');
    } else {
      el = document.querySelector('.form-select--theme');
    }

    data.forEach((item: any) => {
      el.innerHTML += `
      <option value="${item}">${item}</option>`;
    });

    el.querySelectorAll('option').forEach((option) => {
      if (option.textContent === currentCurrency) {
        option.setAttribute('selected', 'true');
      }
    });
  }

  addUserInfo(data: any): void {
    document.querySelector('.account__image').setAttribute('src', data.avatar);
    document.querySelector('.account__image').setAttribute('alt', data.name);
    document.querySelector('.account__user-id').textContent = `@${data.account}`;
    document.querySelector('.account__input-id').setAttribute('value', data.account);
    document.querySelector('.account__input-name').setAttribute('value', data.name);

  }

  render (): void {
    this.element.innerHTML = `
    <div class="block__wrapper">
      <div class="block__content">
        <div class="block__header">
          <p class="block__title">
            Account
          </p>
        </div>
        <div class="block__main">
          <div class="account__form-wrapper block--width-85">
            <form class="account__form-change-info">
              <div class="account__user">
                <div class="block__common-image-wrapper">
                  <div class="block__image-wrapper">
                    <img class="block__image account__image">
                  </div>
                  <label for="file" class="block__button-change-photo">
                    <i class="material-icons">
                      add_a_photo
                    </i>
                  </label>
                  <input type="file" name="avatar" id="file" class="block__input-photo account__input">
                </div>
                <p class="block__title account__user-id">
                </p>
              </div>
              <div class="form-group row block--margin-adaptive w-100">
                <label for="account" class="col-sm-2 col-form-label">
                  Account
                </label>
                <div class="account__double-form col-sm-10 account--input-size">
                  <div class="input-group-prepend account__double-form--first">
                    <span class="input-group-text" id="addon-wrapping">
                      @
                    </span>
                  </div>
                  <input type="text" name="account" class="account__double-form--second form-control account__input account__input-id" placeholder="Username" aria-label="User ID" aria-describedby="addon-wrapping" required>
                </div>
              </div>
              <div class="form-group row block--margin-adaptive w-100">
                <label for="surname" class="col-sm-2 col-form-label">
                  Name
                </label>
                <div class="col-sm-10 account--input-size">
                  <input type="text" name="name" aria-label="Username" class="form-control account__input account__input-name" placeholder="Name" required>
                </div>
              </div>
              <div class="form-group row block--margin-adaptive w-100">
                <span class="col-sm-2 col-form-label">
                  Currency
                </span>
                <div class="col-sm-10 account--input-size">
                  <select name="currency" class="form-select form-select--curr account--input-size mx-0 account__input" aria-label="Currencies select">
                  </select>
                </div>
              </div>   
              <div class="form-group row block--margin-adaptive w-100">
                <span class="col-sm-2 col-form-label">
                  Language
                </span>
                <div class="col-sm-10 account--input-size">
                  <select name="language" class="form-select form-select--lang account--input-size mx-0 account__input" aria-label="Languages select">
                  </select>
                </div>
              </div>
              <div class="form-group row block--margin-adaptive w-100">
                <span class="col-sm-2 col-form-label">
                  Theme
                </span>
                <div class="col-sm-10 account--input-size">
                  <select name="theme" class="form-select form-select--theme account--input-size mx-0 account__input" aria-label="Themes select">
                  </select>
                </div>
              </div>            
            </form> 
          </div>           
        </div>
        <div class="block__footer">
          <div class="form-group row">
            <div class="col-sm-10 d-flex block--width-adaptive">
              <button type="submit" class="account__input-submit btn btn-primary mx-auto" disabled>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  };

  events(): void {
    const submitInfo: HTMLElement = document.querySelector('.account__input-submit');
    const formInfo: HTMLFormElement = document.querySelector('.account__form-change-info');
    const idValue: HTMLInputElement = document.querySelector('.block__title');
    const accountImg: HTMLImageElement = document.querySelector('.account__image');
    const pageInputs: any = document.querySelectorAll('.account__input');

    let values: string[] = [];

    const checkImg = (item: any): string => {
      if (item.type === 'file') {
        return accountImg.src;
      } else {
        return item.value;
      }
    }

    submitInfo.addEventListener('click', (e): void => {
      e.preventDefault();
      const newData: any = getFormData(formInfo, accountImg);
      pageInputs.forEach((item: HTMLInputElement): void => {
          values.push(checkImg(item));
        });
      this.updateInfo(newData);
      idValue.textContent = `@${newData.account}`;
      submitInfo.setAttribute('disabled', 'true');
    });

    pageInputs.forEach((item: HTMLInputElement, index: number): void => {
        values.push(checkImg(item));
        item.addEventListener('input', (): void => {
          if (item.type === 'file') {
            const reader: FileReader = new FileReader();
            reader.onload = (function (img: HTMLImageElement) {
              return (e: any): void => {
                img.src = e.target.result;
              };
            })(accountImg);
            reader.readAsDataURL(item.files[0]);
          }
          if (values[index] !== item.value) {
            submitInfo.removeAttribute('disabled');
          } else {
            submitInfo.setAttribute('disabled', 'true');
          }
        });
      });
  }
}
