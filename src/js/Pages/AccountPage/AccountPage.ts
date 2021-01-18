import { Page } from '../../Classes/Page';
import { getFormData } from '../../Util/getFormData';

export class AccountPage extends Page {
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

  render = (data: any): void => {
    this.element.innerHTML = `
    <div class="block__wrapper">
      <div class="block__content">
        <div class="block__header">
          <p class="block__title">Account</p>
        </div>
          <div class="block__main">
            <div class="account__form-wrapper block--width-85">
              <form class="account__form-change-info">
                <div class="account__user">
                  <div class="block__common-image-wrapper">
                    <div class="block__image-wrapper">
                      <img src="${data.avatar}" alt="${data.name}" class="block__image account__image">
                    </div>
                    <label for="file" class="block__button-change-photo">
                      <i class="material-icons">add_a_photo</i>
                    </label>
                    <input type="file" name="avatar" id="file" class="block__input-photo account__info__input">
                  </div>
                  <p class="block__title">@${data.account}</p>
                </div>
                <div class="form-group row block--margin-adaptive w-100">
                  <label for="account" class="col-sm-2 col-form-label">Account</label>
                  <div class="account__double-form col-sm-10 account--input-size">
                    <div class="input-group-prepend account__double-form--first">
                      <span class="input-group-text" id="addon-wrapping">@</span>
                    </div>
                    <input type="text" name="account" value="${data.account}" class="account__double-form--second form-control account__info__input account__info__input-id" placeholder="Username" aria-label="Username" aria-describedby="addon-wrapping" required>
                  </div>
                </div>
                <div class="form-group row block--margin-adaptive w-100">
                  <label for="surname" class="col-sm-2 col-form-label">Name</label>
                  <div class="col-sm-10 account--input-size">
                    <input type="text" name="name" aria-label="Last name" value="${data.name}" class="form-control account__info__input" placeholder="Name" required>
                  </div>
                </div>
                <div class="form-group row block--margin-adaptive w-100">
                  <span class="col-sm-2 col-form-label">Currency</span>
                  <div class="col-sm-10 account--input-size">
                    <select class="form-select form-select--curr w-auto account--input-size mx-0 account__info__input" aria-label="Default select example">
                    </select>
                  </div>
                </div>   
                <div class="form-group row block--margin-adaptive w-100">
                  <span class="col-sm-2 col-form-label">Language</span>
                  <div class="col-sm-10 account--input-size">
                    <select class="form-select form-select--lang w-auto account--input-size mx-0 account__info__input" aria-label="Default select example">
                    </select>
                  </div>
                </div>
                <div class="form-group row block--margin-adaptive w-100">
                  <span class="col-sm-2 col-form-label">Theme</span>
                  <div class="col-sm-10 account--input-size">
                    <select class="form-select form-select--theme w-auto account--input-size mx-0 account__info__input" aria-label="Default select example">
                    </select>
                  </div>
                </div>    
              
              </form> 
            </div>           
          </div>
          <div class="block__footer">
            <div class="form-group row">
              <div class="col-sm-10 d-flex block--width-adaptive">
                <button type="submit" class="account__input-submit btn btn-primary mx-auto" disabled>Save</button>
              </div>
            </div>
          </div>
        </div>
    </div>
      `;
  };

  events(): void {
    let values: string[] = [];
    const submitInfo: HTMLElement = this.element.querySelector(
      '.account__input-submit',
    );
    const formInfo: HTMLFormElement = this.element.querySelector(
      '.account__form-change-info',
    );
    const idValue: HTMLInputElement = this.element.querySelector(
      '.block__title',
    );
    const accountImg: HTMLImageElement = this.element.querySelector(
      '.account__image',
    );

    const checkImg = (item: any) => {
      if (item.type === 'file') {
        return accountImg.src;
      } else {
        return item.value;
      }
    }

    submitInfo.addEventListener('click', (e): void => {
      e.preventDefault();
      const newData: any = getFormData(formInfo, accountImg);
      document
        .querySelectorAll('.account__info__input')
        .forEach((item: HTMLInputElement): void => {
          values.push(checkImg(item));
        });
      console.log(newData);
      idValue.textContent = `@${newData.account}`;
      submitInfo.setAttribute('disabled', 'true');
    });

    document
      .querySelectorAll('.account__info__input')
      .forEach((item: HTMLInputElement, index: number): void => {
        values.push(checkImg(item));
        item.addEventListener('input', () => {
          if (values[index] !== item.value) {
            submitInfo.removeAttribute('disabled');
          } else {
            submitInfo.setAttribute('disabled', 'true');
          }
        });
      });
  }
}
