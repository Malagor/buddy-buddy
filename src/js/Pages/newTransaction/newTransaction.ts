import { Page } from '../../Classes/Page';
import { divideSum } from './divideSum';
import { Modal } from 'bootstrap';
import { addMemberHTML } from './addMemberHTML';
import { clearAllInputs } from './clearAllInputs';
import { checkData } from './checkData';
// import { sha256 } from 'js-sha256';
export class NewTransaction extends Page {
  onCreateTransaction: any;
  onShowMembersOfGroup: any;

  static create(element: string): NewTransaction {
    return new NewTransaction(element);
  }

  render = (): void => {


    this.element.innerHTML = `
      <div class="new-trans modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Новая транзакция</h5>
          <button type="button" class="btn-close new-trans__close-modal" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
        <form class="all-forms">
            <div class="form-group row block--margin-adaptive">
              <label for="group" class="new-trans__label col-sm-2 col-form-label">Группа</label>
              <div class="col-sm-10">
                <select id="group" class="new-trans__groups-list form-select"></select>
              </div>
            </div>
            <div class="form-group row block--margin-adaptive align-items-center">
              <label for="descr" class="new-trans__label col-sm-2 col-form-label">Описание</label>
              <div class="col-sm-10">
                <textarea id="descr" class="new-trans__descr input-required form-control" required></textarea>
              </div>
            </div>
            <div class="form-group row block--margin-adaptive mb-3">
              <label class="new-trans__label col-sm-2 col-form-label">Сумма</label>
              <div class="new-trans__currency-group col-sm-10">
                <input type="text" class="new-trans__total-sum input-required form-control w-75" required>
                <div class="dropdown w-25">
                  <i class="material-icons search-icon">search</i>
                  <input type="text" class="new-trans__currency-list form-control dropdown-toggle" data-bs-toggle="dropdown" id="new-trans-curr" aria-expanded="false" autocomplete="off">
                  <ul class="new-trans__curr-list dropdown-menu" aria-labelledby="new-trans-curr"></ul>
                </div>
              </div>
            </div>
            <div class="add-check d-flex align-items-center mb-3">
              <div class="add-check__wrapper input-group">
                <label class="add-check__label" for="input-file">
                  <div class="add-check__text">Добавить чек</div>
                  <input id="input-file" type="file" accept="image/*" class="add-check__file" name="check" multiple>
                </label>
              </div>
              <div class="add-check__icon-wrapper hidden"><img class="add-check__icon" src="#" alt="check"></div>
            </div>
            <div class="modal fade add-check__modal" id="check" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content p-2 d-flex flex-column">
                    <button type="button" class="btn-close align-self-end add-check__close-modal" aria-label="Close"></button>
                    <div class="p-2 add-check__check-box"></div>
                </div>
              </div>
            </div>
            <div class="new-trans__members">
              <div class="new-trans__members-list d-flex flex-wrap justify-content-start"></div>
              <button type="button" class="all-btn btn btn-secondary btn-sm">Выбрать всех</button>
            </div>
            <div class="checked-members"></div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="new-trans__create-btn btn btn-primary w-100" data-bs-dismiss="modal" disabled>Создать транзакцию</button>
        </div>
      </div>
    `;

    this.events();
  }

  addGroupList = (groupID: string, groupTitle: string, currentGroup: string) => {
    const groups: HTMLInputElement = document.querySelector('.new-trans__groups-list');
    const groupElement = document.createElement('option');
    if (groupID === currentGroup) {
      groupElement.setAttribute('selected', '');
    }
    groupElement.classList.add('new-trans__groups-item');
    groupElement.value = groupID;
    groupElement.innerText = groupTitle;
    groups.append(groupElement);
  }

  addMembersOfGroup = (userID: string, userName: string, userAvatar: string): void => {
    const members = document.querySelector('.new-trans__members-list');
    const userElement = document.createElement('div');
    userElement.classList.add('member', 'd-flex', 'flex-column', 'align-items-center');
    userElement.setAttribute('user-id', `${userID}`);
    userElement.innerHTML = `
        <div class="member__avatar">
          <img src="${userAvatar}" alt="#">
        </div>
        <div class="member__name">${userName}</div>
      `;
    members.append(userElement);
    this._clickOnMember(userElement);
  }

  addCurrencyList = (data: any, currentOption: string) => {
    const el: HTMLInputElement = document.querySelector('.new-trans__currency-list');
    const list: HTMLElement = document.querySelector('.new-trans__curr-list');
    let html: string = ``;
    data.forEach((item: string) => {
      html += `<li class="new-trans__curr-item">${item}</li>`;
    });
    list.insertAdjacentHTML('beforeend', html);

    document.querySelectorAll('.new-trans__curr-item').forEach((option: HTMLElement) => {
      const optionContent: string = option.innerText;
      if (optionContent === currentOption) {
        option.classList.add('curr--active-curr');
        el.setAttribute('value', currentOption);
      }
    });

    this.currListEvents(el, list);
  }

  currListEvents = (currInput: HTMLInputElement, currList: HTMLElement) => {
    currInput.addEventListener('mousedown', () => {
      setTimeout( () => {
        document.querySelector('.curr--active-curr').scrollIntoView();
      }, 200);
    });

    currInput.addEventListener('focus', () => {
      currInput.value = '';
      currInput.placeholder = document.querySelector('.curr--active-curr').textContent;
    });

    currInput.addEventListener('blur', () => {
      currInput.value = document.querySelector('.curr--active-curr').textContent;
      currInput.placeholder = 'Currency';
    });

    currList.addEventListener('click', event => {
      const { target }: any = event;
      if (target.closest('.new-trans__curr-item')) {
        const item: HTMLElement = target.closest('.new-trans__curr-item');
        const currency = item.textContent;
        currList.querySelectorAll('.new-trans__curr-item').forEach((item: any) => {
          item.classList.remove('curr--active-curr');
          item.removeAttribute('hidden');
        });
        item.classList.add('curr--active-curr');
        currInput.value = `${currency}`;
      }
    });

    currInput.onkeyup = () => {
      const li: NodeListOf<Element> = document.querySelectorAll('.new-trans__curr-item');
      const val: string = currInput.value.toLowerCase();
      if (val.length > 1) {
        li.forEach(item => {
          const isValInCurrency = item.textContent.toLowerCase().includes(val);
          item.setAttribute('hidden', '');
          if (isValInCurrency) {
            item.removeAttribute('hidden');
          }
        });
      } else {
        li.forEach(item => {
          item.removeAttribute('hidden');
        });
      }
    };
  }

  _clickOnMember = (user: HTMLElement): void => {
    user.addEventListener('click', () => {
      const userAvatar = user.querySelector('.member__avatar');
      const userName = user.querySelector('.member__name').innerHTML;
      const userID = user.getAttribute('user-id');
      userAvatar.classList.toggle('checked');
      if (userAvatar.classList.contains('checked')) {
        const checkedUserHTML = addMemberHTML(userID, userName, userAvatar.innerHTML);
        const checkedMembersList: HTMLElement = document.querySelector('.checked-members');
        checkedMembersList.insertAdjacentHTML('beforeend', checkedUserHTML);
      } else {
        const checkedMembers = document.querySelectorAll('.checked-member__wrapper');
        checkedMembers.forEach((memb) => {
          if (memb.querySelector('.checked-member__name').innerHTML === userName) {
            memb.remove();
          }
        });
      }
      divideSum();
      checkData();
    });
  }

  getDataforCreateTransaction = () => {
    const group: HTMLFormElement = document.querySelector('.new-trans__groups-list');
    const descr: HTMLFormElement = document.querySelector('.new-trans__descr');
    const totalSum: HTMLFormElement = document.querySelector('.new-trans__total-sum');
    const currency: HTMLFormElement = document.querySelector('.new-trans__currency-list');
    const inputCheck: HTMLFormElement = document.querySelector('.add-check__file');
    let checks: any[];
    if (inputCheck.files) {
      checks = Object.entries(inputCheck.files).map((check) => check[1]);
    } else {
      checks = [];
    }

    const currentDate  = +(new Date());
    const userList: Array<any> = [];
    const checkedMembers = document.querySelectorAll('.checked-member__wrapper');
    let fix;
    checkedMembers.forEach((memb: HTMLElement) => {
      const sumInput: HTMLInputElement = memb.querySelector('.checked-member__sum');
      const commentInput: HTMLInputElement = memb.querySelector('.checked-member__comment');
      if (sumInput.value) {
        fix = 'fixed';
      } else {
        fix = 'non-fixed';
      }

      const user = {
        userID: memb.getAttribute('user-id'),
        cost: +sumInput.value || +sumInput.getAttribute('placeholder'),
        comment: commentInput.value,
        state: 'pending',
        costFix: fix,
      };
      userList.push(user);
    });

    return {
      date: currentDate,
      totalCost: +totalSum.value,
      groupID: group.value,
      description: descr.value,
      photo: checks,
      currency: currency.value,
      toUserList: userList,
    };
  }

  protected events(): void {
    const groups: HTMLFormElement = document.querySelector('.new-trans__groups-list');
    const checkedMembersList: HTMLElement = document.querySelector('.checked-members');
    const allBtn: HTMLFormElement = document.querySelector('.all-btn');
    const sumInput: HTMLFormElement = document.querySelector('.new-trans__total-sum');
    const members = document.querySelector('.new-trans__members-list');
    const inputCheck: HTMLFormElement = document.querySelector('.add-check__file');
    const checkModal = new Modal(document.querySelector('.add-check__modal'));
    const btnOpenCheck: HTMLElement = document.querySelector('.add-check__icon-wrapper');
    const btnCloseCheck: HTMLElement = document.querySelector('.add-check__close-modal');
    const newTransModal = new Modal(document.querySelector('.new-trans__modal'));
    const btnCloseNewTrans: HTMLElement = document.querySelector('.new-trans__close-modal');

    groups.addEventListener('change', () => {
      members.innerHTML = '';
      checkedMembersList.innerHTML = '';
      this.onShowMembersOfGroup(groups.value);
    });

    sumInput.addEventListener('keyup', () => {
      if (typeof +sumInput.value === 'number') {
        divideSum();
        checkData();
      }
    });

    allBtn.addEventListener('click', () => {
      const allMembers = document.querySelectorAll('.member');
      checkedMembersList.innerHTML = '';
      allMembers.forEach((user) => {
        const userAvatar = user.querySelector('.member__avatar');
        const userName = user.querySelector('.member__name').innerHTML;
        const userID = user.getAttribute('user-id');
        userAvatar.classList.add('checked');
        const checkedUserHTML = addMemberHTML(userID, userName, userAvatar.innerHTML);
        checkedMembersList.insertAdjacentHTML('beforeend', checkedUserHTML);
      });
      divideSum();
      checkData();
    });

    inputCheck.addEventListener('change', () => {
      if (inputCheck.files) {
        const files = Object.entries(inputCheck.files);
        document.querySelector('.add-check__icon-wrapper').classList.remove('hidden');

        const checkIcon: HTMLImageElement = document.querySelector('.add-check__icon');
        const reader: FileReader = new FileReader();
        reader.onload = (function (aImg1: HTMLImageElement) {
          return (e: any): void => {
            aImg1.src = e.target.result;
          };
        })(checkIcon);
        reader.readAsDataURL(inputCheck.files[0]);

        const checksWrapper = document.querySelector('.add-check__check-box');
        files.forEach((file: any) => {
            const checkWrap: HTMLElement = document.createElement('div');
            checkWrap.classList.add('add-check__image-wrap');
            checkWrap.innerHTML = `<img class="add-check__image" src="#" alt="check">`;
            checksWrapper.append(checkWrap);
            const imgCheck: HTMLImageElement = checkWrap.querySelector('.add-check__image');
            const readerCheck: FileReader = new FileReader();
            readerCheck.onload = (function (imgCheck: HTMLImageElement) {
              return (e: any): void => {
                imgCheck.src = e.target.result;
              };
            })(imgCheck);
            readerCheck.readAsDataURL(file[1]);
        });
      }
    });

    const createTransBtn = document.querySelector('.new-trans__create-btn');
    createTransBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const data = this.getDataforCreateTransaction();
      this.onCreateTransaction(data);
      clearAllInputs();
    });

    btnOpenCheck.addEventListener('click', () => {
      checkModal.show();
    });

    btnCloseCheck.addEventListener('click', () => {
      checkModal.hide();
    });

    btnCloseNewTrans.addEventListener('click', () => {
      newTransModal.hide();
      clearAllInputs();
    });

    const descrInput: HTMLFormElement = document.querySelector('.new-trans__descr');
    descrInput.addEventListener('keyup', () => {
      checkData();
    });
  }
}
