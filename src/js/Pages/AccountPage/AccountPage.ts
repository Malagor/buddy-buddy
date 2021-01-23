import { Page } from '../../Classes/Page';
import { getFormData } from '../../Util/getFormData';
// import { bootstap } from 'bootstrap';

export class AccountPage extends Page {
  updateInfo: any;
  changeTheme: any;

  static create(element: string): AccountPage {
    return new AccountPage(element);
  }

  renderLangOrTheme(data: any, currentOption: string): void {
    const funcData: any = data.map((item: any[]) => item[0]);
    const el: HTMLElement = (funcData.some((item: any) => item === 'RU')) ? document.querySelector('.form-select--lang') : document.querySelector('.form-select--theme');

    funcData.forEach((item: any) => {
      el.innerHTML += `
      <option value="${item}">${item}</option>`;
    });

    el.querySelectorAll('option').forEach((option) => {
      if (option.textContent === currentOption) {
        option.setAttribute('selected', 'true');
      }
    });
  }

  renderCurrenciesInput(data: any, currentOption: string): void {
    const el: HTMLInputElement = document.querySelector('#activeCurrency');
    const list = document.querySelector('.curr-list');
    let html: string = ``;
    data.forEach((item: any[]) => {
      html += `
      <li class="curr-list__item">
        <span class="curr-list__currency">${item[0]}</span>
        <span class="curr-list__currency-name">, ${item[1].name}</span>
      </li>
    `;
    });
    list.insertAdjacentHTML('beforeend', html);

    document.querySelectorAll('.curr-list__item').forEach((option: HTMLElement) => {
      const optionContent: string = option.firstElementChild.textContent;      
      if (optionContent === currentOption) {
        option.classList.add('active-curr');
        el.setAttribute('value', currentOption);
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
                    <img class="block__image account__image" src="#" alt="">
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
                  <input type="text" name="account" class="account__double-form--second form-control account__input account__input-id" placeholder="Username" aria-label="User ID" aria-describedby="addon-wrapping">
                </div>
              </div>
              <div class="form-group row block--margin-adaptive w-100">
                <label for="surname" class="col-sm-2 col-form-label">
                  Name
                </label>
                <div class="col-sm-10 account--input-size">
                  <input type="text" name="name" aria-label="Username" class="form-control account__input account__input-name" placeholder="Name">
                </div>
              </div>
              <div class="form-group row block--margin-adaptive w-100">
                <span class="col-sm-2 col-form-label">
                  Currency
                </span>
                <div class="col-sm-10 dropdown curr-wrapper account--input-size">
                  <i class="material-icons">search</i>
                  <input class="form-control dropdown-toggle account__input-curr account__input" type="text" id="activeCurrency" data-bs-toggle="dropdown" aria-expanded="false" placeholder="Currency" autocomplete="off" name="currency">
                  <ul id="curr__list" class="dropdown-menu curr-list members-dropdown-menu" aria-labelledby="Currencies">
                  </ul>
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
  }

  events(): void {
    const submitInfo: HTMLElement = document.querySelector('.account__input-submit');
    const formInfo: HTMLFormElement = document.querySelector('.account__form-change-info');
    const idValue: HTMLInputElement = document.querySelector('.account__user-id');
    const accountImg: HTMLImageElement = document.querySelector('.account__image');
    const nameInput: HTMLInputElement = document.querySelector('.account__input-name');
    const pageInputs: any = document.querySelectorAll('.account__input');
    const themeSelect: any = document.querySelector('.form-select--theme');
    const currList: HTMLElement = document.querySelector('.curr-list');
    const currInput: HTMLInputElement = document.querySelector('.account__input-curr');

    let currentTheme: string = [...themeSelect.querySelectorAll('option')].find((item: any) => item.selected).textContent;
    let values: string[] = [];

    currInput.addEventListener('mousedown', () => {
      setTimeout( () => {
        document.querySelector('.active-curr').scrollIntoView();        
      }, 200);
    });

    currInput.addEventListener('focus', () => {
      currInput.value = '';
      currInput.placeholder = `${document.querySelector('.active-curr').firstElementChild.textContent}${document.querySelector('.active-curr').lastElementChild.textContent}`;
    });

    currInput.addEventListener('blur', () => {
      currInput.value = `${document.querySelector('.active-curr').firstElementChild.textContent}`;
      currInput.placeholder = 'Currency';
    });

    currList.addEventListener('click', event => {
      const { target }: any = event;
      if (target.closest('.curr-list__item')) {
        const item: HTMLElement = target.closest('.curr-list__item');
        const formRecipient: HTMLInputElement = document.querySelector('#activeCurrency');  
        const currency = item.querySelector('.curr-list__currency').textContent;

        currList.querySelectorAll('.curr-list__item').forEach((item: any) => {
          item.classList.remove('active-curr');
          item.removeAttribute('hidden');
        });
        item.classList.add('active-curr');        

        formRecipient.value = `${currency}`;
        pageInputs.forEach((item: HTMLInputElement, index: number): void => {
          if (item.classList.contains('account__input-curr')) {
            if (values[index] !== item.value.trim()) {
              submitInfo.removeAttribute('disabled');
            } else {
              submitInfo.setAttribute('disabled', 'true');
            }
          }
        });
      }
    });

    currInput.onkeyup = () => {
      const li: NodeListOf<Element> = document.querySelectorAll('.curr-list__item');
      const val: string = currInput.value.toLowerCase();

      if (val.length > 1) {
        li.forEach(item => {
          const isValInCurrency = item.querySelector('.curr-list__currency').textContent.toLowerCase().includes(val);
          const isValInCurrencyName = item.querySelector('.curr-list__currency-name').textContent.toLowerCase().includes(val);

          item.setAttribute('hidden', '');
          if (isValInCurrency || isValInCurrencyName) {
            item.removeAttribute('hidden');
          }
        });
      } else {
        li.forEach(item => {
          item.removeAttribute('hidden');
        });
      }
    };

    const checkImg = (item: any): string => {
      if (item.type === 'file') {
        return accountImg.src;
      } else {
        return item.value.trim();
      }
    };

    const checkInputs = (values: string[]): void => {
      pageInputs.forEach((item: HTMLInputElement, index: number): void => {
        if (!item.value && index > 0) {
          item.value = values[index];
        }
      });
    };

    submitInfo.addEventListener('click', (e): void => {
      e.preventDefault();
      const newCurrentTheme = [...themeSelect.querySelectorAll('option')].find((item: any) => item.selected).textContent;
      checkInputs(values);
      values = [];
      const newData: any = getFormData(formInfo, accountImg);
      pageInputs.forEach((item: HTMLInputElement): void => {
          values.push(checkImg(item));
        });
      this.updateInfo(newData);      
      if (currentTheme !== newCurrentTheme) this.changeTheme(newCurrentTheme.toLowerCase());
      idValue.textContent = `@${newData.account}`;
      nameInput.value = newData.name;
      submitInfo.setAttribute('disabled', 'true');
      currentTheme = newCurrentTheme;
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
          if (values[index] !== item.value.trim()) {
            submitInfo.removeAttribute('disabled');
          } else {
            submitInfo.setAttribute('disabled', 'true');
          }
        });
      });
  }
}