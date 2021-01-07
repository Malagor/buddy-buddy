import { Page } from '../../Classes/Page';
import { data } from './dataList';


export class TransactionsList extends Page {

  static create(element: string): TransactionsList {
    return new TransactionsList(element);
  }

  public render = (): void => {

    this.element.innerHTML = `
      <div class="trans-wrapper container d-flex flex-column">
        <p class="fs-4 text-center">Список транзакций</p>
        <div class="container d-flex flex-row align-items-center">
          <select class="form-select w-75 groups" aria-label="Default select example">
          </select>
          <div class="user-balance text-center w-25 text-success">${data.balance}${data.currency}</div>   
        </div>
        <div class="trans-list container">
        </div>        
      </div>
      <button class="new-trans-btn"><span class="material-icons">add_circle</span></button>     
    `;
    if (+data.balance < 0) {
      document.querySelector('.user-balance').classList.add('text-danger');
    }

    const groups: HTMLElement = document.querySelector('.groups');
    data.groupList.forEach((group: string) => {
      const groupElement = document.createElement('option');
      groupElement.classList.add('groups__item');
      groupElement.value = group;
      groupElement.innerText = group;  
      groups.append(groupElement);
    });

    const list: HTMLElement = document.querySelector('.trans-list');
    data.transactions.forEach((item) => {
      const transItem = document.createElement('div'); 
      transItem.classList.add('trans-item', 'card', 'mb-1', 'container');
      transItem.innerHTML = `
      <button class="trans-item__btn">ПОДТВЕРДИТЬ</button>
      <div class="trans-item__header row col">
        <div class="trans-item__descr fw-bolder">${item.description}</div> 
      </div>
      <div class="trans-item__info row col">
        <div class="date col-4 col-sm-3 align-self-start">
          <div class="day">${item.day}</div>
          <div class="time">${item.time}</div>
        </div>
        <div class="trans-users col-5 col-sm-6 d-flex align-self-center justify-content-center"></div>
        <div class="cost col-3 align-self-center text-success">${item.cost}${item.currency}</div>
      </div>`;
      list.append(transItem);
      if (+item.cost > 0) {
        transItem.querySelector('.trans-item__btn').classList.add('invisible');
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

    this.events();
  }

  protected events(): void {
    const btnsSubmit  = document.querySelectorAll('.trans-item__btn');
    btnsSubmit.forEach((btn) => {
      btn.addEventListener('click', () => {
        btn.innerHTML = `<span class="material-icons">check</span>`;
      });
    });       
  }
}

