import { Page } from '../../Classes/Page';
import { getFormData } from '../../Util/getFormData';

export class AccountPage extends Page {
  static create(element: string): AccountPage {
    return new AccountPage(element);
  }

  render = (dt: any): void => {
    console.log('Рендер Аккаунта');
    const data: any = this.checkNameAccount(dt);
    this.element.innerHTML = `
    <div class="block__wrapper">
      <div class="block__content">
        <div class="block__header block__header--account">
          <div class="block__common-image-wrapper">
            <div class="block__image-wrapper">
              <img src="${data.avatar}" alt="${data.name}" class="block__image">
            </div>
            <form action=#" enctype="multipart/form-data" method="post" class="block__form-change-photo">
              <label for="file" class="block__button-change-photo">
                <i class="material-icons">add_a_photo</i>
              </label>
              <input type="file" name="avatar" id="file" class="block__input-photo">
            </form>
          </div>
          <p class="block__title">@${data.account}</p>
        </div>
        <div class="block__main">        
          <form class="account__form-change-info block--width-85">
            <div class="form-group row block--margin-adaptive">
              <label for="account" class="col-sm-2 col-form-label">Account</label>
              <div class="account__double-form col-sm-10">
                <div class="input-group-prepend account__double-form--first">
                  <span class="input-group-text" id="addon-wrapping">@</span>
                </div>
                <input type="text" name="account" value="${
                  data.account
                }" class="account__double-form--second form-control account__info__input account__info__input-id" placeholder="Username" aria-label="Username" aria-describedby="addon-wrapping" required>
              </div>
            </div>
            <div class="form-group row block--margin-adaptive">
              <label for="surname" class="col-sm-2 col-form-label">Name</label>
              <div class="col-sm-10">
                <input type="text" name="name" aria-label="Last name" value="${
                  data.name
                }" class="form-control account__info__input" placeholder="Name" required>
              </div>
            </div>
            <div class="form-group row block--margin-adaptive">
              <label for="inputEmail3" class="col-sm-2 col-form-label">Email</label>
              <div class="col-sm-10">
                <input type="email" name="email" value="${
                  data.email || ''
                }" class="form-control account__info__input" placeholder="E-mail" id="inputEmail3">
              </div>
            </div>
            <div class="form-group row account__date--margin">
              <label for="inputPassword3" class="col-sm-2 col-form-label">Birthday</label>
              <div class="col-sm-10">
                <input type="date" name="date" value="${
                  data.date
                }" class="form-control account__info__input" id="inputPassword3" placeholder="Birthday">
              </div>
            </div>
            <fieldset class="form-group">
              <div class="row block--width-adaptive">
                <legend class="col-form-label col-sm-2 pt-0">Gender</legend>
                <div class="col-sm-10">
                  <div class="form-check">
                    <input class="form-check-input account__info__input account__info__input-male" name="gender" type="radio" id="gridRadios1" value="M">
                    <label class="form-check-label" for="gridRadios1">
                      Male
                    </label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input account__info__input account__info__input-female" name="gender" type="radio" id="gridRadios2" value="F">
                    <label class="form-check-label" for="gridRadios2">
                      Female
                    </label>
                  </div>
                </div>
              </div>
            </fieldset>
          </form> 
        </div>
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
    this.checkGenderAccount(data);
    this.events();
  };

  protected checkNameAccount(data: any): {} | void {
    const dt = { ...data };
    if (!dt.gender) dt.gender = '';
    return dt;
  }

  protected checkGenderAccount(dt: any): void {
    const male = this.element.querySelector('.account__info__input-male');
    const female = this.element.querySelector('.account__info__input-female');
    if (dt.gender === 'M') {
      male.setAttribute('checked', 'true');
    } else if (dt.gender === 'F') {
      female.setAttribute('checked', 'true');
    }
  }

  protected events(): void {
    let values: string[] = [];
    const submitInfo: HTMLElement = this.element.querySelector(
      '.account__input-submit',
    );
    const inputPhoto: HTMLInputElement = this.element.querySelector(
      '.block__input-photo',
    );
    const formPhoto: HTMLFormElement = this.element.querySelector(
      '.block__form-change-photo',
    );
    const formInfo: HTMLFormElement = this.element.querySelector(
      '.account__form-change-info',
    );
    const idValue: HTMLInputElement = this.element.querySelector(
      '.block__title',
    );

    inputPhoto.addEventListener('change', (): void => {
      if (inputPhoto.files[0]) {
        const newData: {} = getFormData(
          formPhoto,
          this.element.querySelector('.block__image'),
        );
        console.log(
          'Здесь могла быть ваша функция передачи информации в базу данных!',
          newData,
        );
      }
    });

    const checkRadio = (item: any): any => {
      const array = [];
      if (item.type === 'radio') {
        if (item.hasAttribute('checked')) {
          array.push(item.value);
        }
      } else {
        array.push(item.value);
      }
      return array;
    };

    const checkNewData = (item: any, data: {}): any => {
      const newObj: any = { ...data };
      if (item.checked && item.type === 'radio') {
        console.log(item.value, item.checked);
        newObj.gender = item.value;
        console.log(newObj.gender);
      }
      return newObj;
    };

    submitInfo.addEventListener('click', (e): void => {
      e.preventDefault();
      let newData: any = getFormData(formInfo);
      document
        .querySelectorAll('.account__info__input')
        .forEach((item: HTMLInputElement): void => {
          values = checkRadio(item);
          newData = checkNewData(item, newData);
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
        values = checkRadio(item);
        console.log ('values', values);
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
