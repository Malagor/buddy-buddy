import { Page } from '../../Classes/Page';
import { getFormData } from '../../Util/getFormData';

export class AccountPage extends Page {
  static create(element: string): AccountPage {
    return new AccountPage(element);
  }

  render = (data: any): void => {
    this.element.innerHTML = `
    <div class="block__wrapper">
      <div class="block__content">
          <div class="block__header block__header--account">
            <div class="block__common-image-wrapper">
              <div class="block__image-wrapper">
                <img src="${data.avatar}" alt="${data.name}" class="block__image">
              </div>
              <form class="account__form-change-info">
              <label for="file" class="block__button-change-photo">
                <i class="material-icons">add_a_photo</i>
              </label>
              <input type="file" name="avatar" id="file" class="block__input-photo">
            </div>
            <p class="block__title">@${data.account}</p>
          </div>
          <div class="block__main">
            <div class="account__form-wrapper block--width-85">
              <div class="form-group row block--margin-adaptive">
                <label for="account" class="col-sm-2 col-form-label">Account</label>
                <div class="account__double-form col-sm-10">
                  <div class="input-group-prepend account__double-form--first">
                    <span class="input-group-text" id="addon-wrapping">@</span>
                  </div>
                  <input type="text" name="account" value="${data.account}" class="account__double-form--second form-control account__info__input account__info__input-id" placeholder="Username" aria-label="Username" aria-describedby="addon-wrapping" required>
                </div>
              </div>
              <div class="form-group row block--margin-adaptive">
                <label for="surname" class="col-sm-2 col-form-label">Name</label>
                <div class="col-sm-10">
                  <input type="text" name="name" aria-label="Last name" value="${data.name}" class="form-control account__info__input" placeholder="Name" required>
                </div>
              </div>  
            </div>            
          </div>
          </form>
          <div class="block__footer">
            <div class="form-group row">
              <div class="col-sm-10 d-flex block--width-adaptive">
                <button type="submit" class="account__input-submit btn btn-dark mx-auto" disabled>Save</button>
              </div>
            </div>
          </div>
        </div>
    </div>
      `;
    this.events();
  };

  protected events(): void {
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

    submitInfo.addEventListener('click', (e): void => {
      e.preventDefault();
      let newData: any = getFormData(formInfo);
      document
        .querySelectorAll('.account__info__input')
        .forEach((item: HTMLInputElement): void => {
          values.push(item.value);
        });
      console.log(
        'Здесь могла быть ваша функция передачи информации в базу данных!',
        newData,
      );
      idValue.textContent = `@${newData.account}`;
      submitInfo.setAttribute('disabled', 'true');
    });

    document
      .querySelectorAll('.account__info__input')
      .forEach((item: HTMLInputElement, index: number): void => {
        values.push(item.value);
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
