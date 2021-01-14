import { Page } from '../../Classes/Page';
import { NewTransaction } from '../newTransaction/newTransaction';

export class TransactionsList extends Page {
  public newTrans: NewTransaction;


  static create(element: string): TransactionsList {
    return new TransactionsList(element);
  }

  public render = (): void => {

    this.element.innerHTML = `
    <div class="block__wrapper">
      <div class="block__content">
        <div class="block__header block__header--main">
          <p class="block__title">Список транзакций</p>
        </div>

        <div class="block__groups block--width-85">
          <select class="trans-list__groups form-select w-75" aria-label="Default select example">
          </select>
          <div class="user-balance text-center w-25">250$</div>
        </div>

        <div class="trans-list__list block__main">        
        </div>

        <div class="block__footer">
          <button class="new-trans-btn btn btn-primary" data-bs-toggle="modal" data-bs-target="#new-trans-modal">Новая транзакция</button>
        </div>
      </div>
    </div>

    <div class="modal fade new-trans__modal" id="new-trans-modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-wrapper modal-dialog modal-dialog-centered modal-dialog-scrollable">
      </div>
    </div>
      








   


     
    `;
   
    this.newTrans = NewTransaction.create('.modal-wrapper');
    this.newTrans.render();


    this.events();
  }

  addGroupToTransList = (groupID: string, groupTitle: string, currentGroup: string) => {
    const groups: HTMLFormElement = document.querySelector('.trans-list__groups');
    const groupElement = document.createElement('option');
    if (groupID === currentGroup) {
      groupElement.setAttribute('selected', '');
    }
    groupElement.classList.add('trans-list__group');
    groupElement.value = groupID;
    groupElement.innerText = groupTitle;
    groups.append(groupElement);
  }


  addMyTransactions = (transID:string, trans: any):void => {

    const dayOptions = {
      year: '2-digit',
      month: '2-digit',
      day: 'numeric',   
    };

    const timeOptions = {   
      hour: '2-digit',
      minute: '2-digit',
    };

    const date: Date = new Date(trans.date); 
    const localeDay: string = date.toLocaleString('ru-RU', dayOptions);
    const localeTime: string = date.toLocaleString('ru-RU', timeOptions);

    const listOfTrans: HTMLElement = document.querySelector('.trans-list__list');
    const transHTML: string = `
      <div class="trans-item d-flex flex-column block--width-85" id=${transID} data-time=${trans.date}>
        <p class="trans-item__header align-self-start row">
          <span class="trans-item__descr fw-bolder text-truncate">${trans.descripion}</span>
        </p>

        <div class="trans-item__info row">
          <div class="date col-4 col-sm-3 align-self-start">
            <div class="trans-item__day">${localeDay}</div>
            <div class="trans-item__time">${localeTime}</div>
          </div>
          <div class="trans-item__users col-5 col-sm-6 d-flex align-self-center justify-content-center"></div>
          <div class="cost col-3 align-self-center text-success">+${trans.totalCost} ${trans.currency}</div>
        </div>
        <div class="trans-item__buttons row">
          <button type="button" class="btn btn-outline-secondary btn-sm w-25">Подробнее</button>
        </div>

      </div>
    `;
    listOfTrans.insertAdjacentHTML('beforeend', transHTML);
  }

  _changeColor = (balance: number):void => {
    if (balance >= 0) {
      document.querySelector('.user-balance').classList.add('text-success');
    } else {
      document.querySelector('.user-balance').classList.add('text-danger');
    }
  }


  addUserToList = (transID: string, user: any, i:number) => {
    const usersList = document.getElementById(transID).querySelector('.trans-item__users');
    const userWrapper = document.createElement('div');
      userWrapper.classList.add('user', 'd-flex', 'flex-column', 'align-items-center');
      userWrapper.setAttribute('user-id', user.id); 
      userWrapper.innerHTML = `
        <div class="user__avatar"><img src=${user.avatar} alt=${user.userName}></div>
        <div class="user__name">${user.userName}</div>
      `;
      if (i >= 0 && i < 3) {
        userWrapper.style.left = `${-(i * 15)}px`;
      } else {
        userWrapper.style.display = 'none';
      }
      usersList.append(userWrapper);

      if (i > 0) {
        const names = usersList.querySelectorAll('.user__name');
        names.forEach((name: HTMLElement) => name.style.display = 'none');
      }

        if (i >= 3) {
          if (usersList.querySelector('.add-numb')) {
            usersList.querySelector('.add-numb').remove();
          }
        const addNumb = document.createElement('div');
        addNumb.classList.add('add-numb', 'align-self-center', 'position-relative');
        addNumb.innerText = `+${i - 2}`;
        addNumb.style.left = `${-(i * 10)}px`;
        usersList.append(addNumb);
      }
  }



  // addUsersBox = (transID: string, users: any[]) => {
  //   // console.log ('transID', transID);
  //   // console.log ('users=', users);
    
  //   // console.log ('users.length=', users.length);
  //   // console.log ('users[0]=', users[0]);
  //   let i = 0;
  //   while (i < users.length && i < 3) {
  //     console.log (i);
      
  //     userWrapper.style.left = `${-(i * 15)}px`;
  //     usersList.append(userWrapper);
  //     i += 1;
  //   }

  //   if (users.length > 1) {
  //     const names = usersList.querySelectorAll('.user__name');
  //     names.forEach((name) => name.classList.add('invisible'));
  //   }

  //   if (users.length > 3) {
  //     const addNumb = document.createElement('div');
  //     addNumb.classList.add('add-numb', 'align-self-center', 'position-relative');
  //     addNumb.innerText = `+${users.length - 3}`;
  //     addNumb.style.left = `${-(i * 10)}px`;
  //     usersList.append(addNumb);
  //   }
  // }

  

  

  

 






  protected events(): void {




    // const btnsSubmit = document.querySelectorAll('.trans-item__btn');
    // btnsSubmit.forEach((btn, i) => {
    //   btn.addEventListener('click', () => {
    //     btn.innerHTML = `<span class="material-icons">check</span>`;
    //     // this.onTransactionSubmit(i);
    //   });
    // });


    // const newTransBtn = document.querySelector('.new-trans-btn');
    // newTransBtn.addEventListener('click', () => {
      // this.newTrans = NewTransaction.create('.modal-wrapper');
      // this.newTrans.render();
    // });
  }
}


// const list: HTMLElement = document.querySelector('.trans-list');
// data.transactions.forEach((item: any, num: number) => {
//   const transItem = document.createElement('div');
//   transItem.classList.add('trans-item', 'card', 'mb-1', 'container');
//   transItem.innerHTML = `
//   <button class="trans-item__btn"></button>
//   <div class="trans-item__header row">
//     <div class="trans-item__descr fw-bolder col-8 text-truncate">${item.description}</div>
//   </div>
//   <div class="trans-item__info row">
//     <div class="date col-4 col-sm-3 align-self-start">
//       <div class="day">${item.day}</div>
//       <div class="time">${item.time}</div>
//     </div>
//     <div class="trans-users col-5 col-sm-6 d-flex align-self-center justify-content-center"></div>
//     <div class="cost col-3 align-self-center text-success">${item.cost}${item.currency}</div>
//   </div>`;

//   if (item.users.length > 1) {
//     transItem.setAttribute('data-bs-toggle', 'collapse');
//     transItem.setAttribute('data-bs-target', `#addlist-${num}`);
//     transItem.innerHTML += `
//       <div class="collapse" id="addlist-${num}">
//       <div class="add-list conatiner card card-body overflow-auto">
//       </div>
//     </div>
//     `;
//     const addList = transItem.querySelector('.add-list');
//     item.users.forEach((user: any) => {
//       const addHTML = `
//         <div class="add-user row align-items-center">
//           <div class="col-3 d-flex flex-column">
//             <div class="add-user__image">
//               <img src="#" alt="#">
//             </div>
//             <div class="add-user__name">${user.name}</div>
//           </div>
//           <div class="add-user__cost col-2 col-sm-3 text-danger">${user.cost}${user.currency}</div>
//           <div class="add-user__submit col-2 col-sm-3"></div>
//           <div class="add-user__comment col-5 col-sm-3 text-secondary">${user.comment}</div>
//         </div>
//       `;
//       addList.insertAdjacentHTML('beforeend', addHTML);
//     });

//     const addBtnsSubmit = addList.querySelectorAll('.add-user__submit');
//     addBtnsSubmit.forEach((btn, i) => {
//       if (item.users[i].submit) {
//         btn.innerHTML = '<span class="material-icons text-success">check</span>';
//       } else {
//         btn.innerHTML = '<span class="material-icons text-danger">remove</span>';
//       }
//     });
//   }

//   list.append(transItem);

//   const btnSubmit = transItem.querySelector('.trans-item__btn');
//   if (data.transactions.submit) {
//     btnSubmit.innerHTML = `<span class="material-icons">check</span>`;
//   } else {
//     btnSubmit.innerHTML = 'ПОДТВЕРДИТЬ';
//   }
//   if (+item.cost > 0) {
//     btnSubmit.classList.add('invisible');
//   } else {
//     transItem.querySelector('.cost').classList.add('text-danger');
//   }

//   const usersList = transItem.querySelector('.trans-users');
//   let i = 0;
//   while (i < item.users.length && i < 3) {
//     const userWrapper = document.createElement('div');
//     userWrapper.classList.add('user', 'd-flex', 'flex-column', 'align-items-center');
//     userWrapper.innerHTML = `
//       <div class="user__avatar"></div>
//       <div class="user__name">${item.users[i].name}</div>
//     `;
//     userWrapper.style.left = `${-(i * 15)}px`;
//     usersList.append(userWrapper);
//     i += 1;
//   }

//   if (item.users.length > 1) {
//     const names = usersList.querySelectorAll('.user__name');
//     names.forEach((name) => name.classList.add('invisible'));
//   }

//   if (item.users.length > 3) {
//     const addNumb = document.createElement('div');
//     addNumb.classList.add('add-numb', 'align-self-center', 'position-relative');
//     addNumb.innerText = `+${item.users.length - 3}`;
//     addNumb.style.left = `${-(i * 10)}px`;
//     usersList.append(addNumb);
//   }
// });

