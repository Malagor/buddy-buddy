import { Page } from '../../Classes/Page';
import { NewTransaction } from '../newTransaction/newTransaction';

export class TransactionsList extends Page {
  onTransactionSubmit: any;
  private newTrans: NewTransaction;

  static create(element: string): TransactionsList {
    return new TransactionsList(element);
  }

  public render = (data?: any): void => {

    this.element.innerHTML = `
      <div class="trans-wrapper container d-flex flex-column">
        <p class="fs-4 text-center">Список транзакций</p>
        <div class="container d-flex flex-row align-items-center">
          <select class="form-select w-75 groups" aria-label="Default select example">
          </select>
          <div class="user-balance text-center w-25">${data.balance}${data.currency}</div>
        </div>
        <div class="trans-list container overflow-auto">
        </div>
      </div>
      <button class="new-trans-btn" data-bs-toggle="modal" data-bs-target="#new-trans-modal">
         <span class="material-icons">add_circle</span>
      </button>
      <div class="modal fade" id="new-trans-modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-wrapper modal-dialog modal-dialog-centered">
         
        </div>
      </div>
    `;
    if (+data.balance >= 0) {
      document.querySelector('.user-balance').classList.add('text-success');
    } else {
      document.querySelector('.user-balance').classList.add('text-danger');
    }

    // const groups: HTMLElement = document.querySelector('.groups');
    // data.groupList.forEach((group: string) => {
    //   const groupElement = document.createElement('option');
    //   groupElement.classList.add('groups__item');
    //   groupElement.value = group;
    //   groupElement.innerText = group;
    //   groups.append(groupElement);
    // });

    const list: HTMLElement = document.querySelector('.trans-list');
    data.transactions.forEach((item: any, num: number) => {
      const transItem = document.createElement('div');
      transItem.classList.add('trans-item', 'card', 'mb-1', 'container');
      transItem.innerHTML = `
      <button class="trans-item__btn"></button>
      <div class="trans-item__header row">
        <div class="trans-item__descr fw-bolder col-8 text-truncate">${item.description}</div>
      </div>
      <div class="trans-item__info row">
        <div class="date col-4 col-sm-3 align-self-start">
          <div class="day">${item.day}</div>
          <div class="time">${item.time}</div>
        </div>
        <div class="trans-users col-5 col-sm-6 d-flex align-self-center justify-content-center"></div>
        <div class="cost col-3 align-self-center text-success">${item.cost}${item.currency}</div>
      </div>`;

      if (item.users.length > 1) {
        transItem.setAttribute('data-bs-toggle', 'collapse');
        transItem.setAttribute('data-bs-target', `#addlist-${num}`);
        transItem.innerHTML += `
          <div class="collapse" id="addlist-${num}">
          <div class="add-list conatiner card card-body overflow-auto">
          </div>
        </div>
        `;
        const addList = transItem.querySelector('.add-list');
        item.users.forEach((user: any) => {
          const addHTML = `
            <div class="add-user row align-items-center">
              <div class="col-3 d-flex flex-column">
                <div class="add-user__image">
                  <img src="#" alt="#">
                </div>
                <div class="add-user__name">${user.name}</div>
              </div>
              <div class="add-user__cost col-2 col-sm-3 text-danger">${user.cost}${user.currency}</div>
              <div class="add-user__submit col-2 col-sm-3"></div>
              <div class="add-user__comment col-5 col-sm-3 text-secondary">${user.comment}</div>
            </div>
          `;
          addList.insertAdjacentHTML('beforeend', addHTML);
        });

        const addBtnsSubmit = addList.querySelectorAll('.add-user__submit');
        addBtnsSubmit.forEach((btn, i) => {
          if (item.users[i].submit) {
            btn.innerHTML = '<span class="material-icons text-success">check</span>';
          } else {
            btn.innerHTML = '<span class="material-icons text-danger">remove</span>';
          }
        });
      }

      list.append(transItem);

      const btnSubmit = transItem.querySelector('.trans-item__btn');
      if (data.transactions.submit) {
        btnSubmit.innerHTML = `<span class="material-icons">check</span>`;
      } else {
        btnSubmit.innerHTML = 'ПОДТВЕРДИТЬ';
      }
      if (+item.cost > 0) {
        btnSubmit.classList.add('invisible');
      } else {
        transItem.querySelector('.cost').classList.add('text-danger');
      }

      const usersList = transItem.querySelector('.trans-users');
      let i = 0;
      while (i < item.users.length && i < 3) {
        const userWrapper = document.createElement('div');
        userWrapper.classList.add('user', 'd-flex', 'flex-column', 'align-items-center');
        userWrapper.innerHTML = `
          <div class="user__avatar"></div>
          <div class="user__name">${item.users[i].name}</div>
        `;
        userWrapper.style.left = `${-(i * 15)}px`;
        usersList.append(userWrapper);
        i += 1;
      }

      if (item.users.length > 1) {
        const names = usersList.querySelectorAll('.user__name');
        names.forEach((name) => name.classList.add('invisible'));
      }

      if (item.users.length > 3) {
        const addNumb = document.createElement('div');
        addNumb.classList.add('add-numb', 'align-self-center', 'position-relative');
        addNumb.innerText = `+${item.users.length - 3}`;
        addNumb.style.left = `${-(i * 10)}px`;
        usersList.append(addNumb);
      }
    });


    this.newTrans = NewTransaction.create('.modal-wrapper');
    this.newTrans.render();

    this.events();
  }

  addGroupList = (dataDB: any):void => {
    console.log('dataX', dataDB);
    const groups: HTMLElement = document.querySelector('.groups');
    dataDB.forEach((group: string) => {
      const groupElement = document.createElement('option');
      groupElement.classList.add('groups__item');
      groupElement.value = group;
      groupElement.innerText = group;
      groups.append(groupElement);
    });
  }; 






  protected events(): void {
    const btnsSubmit = document.querySelectorAll('.trans-item__btn');
    btnsSubmit.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        btn.innerHTML = `<span class="material-icons">check</span>`;
        this.onTransactionSubmit(i);
      });
    });
  }
}

