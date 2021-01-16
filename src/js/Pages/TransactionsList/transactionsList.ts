import { Page } from '../../Classes/Page';
import { NewTransaction } from '../newTransaction/newTransaction';

export class TransactionsList extends Page {
  onChangeState: any;

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



        <div class="trans-list__list"> 
               
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


  addMyTransactions = (transID:string, trans: any, currentGroup: string, owner: boolean, ownUID:string):void => {
    console.log ('currentGroup', currentGroup);
    console.log ( 'trans-list', document.querySelector('.trans-list__groups').innerHTML);
    console.log ('trans', trans);
    
    let currentG;
    const transList: HTMLFormElement = document.querySelector('.trans-list__groups');
    if (transList.value) {    
      currentG = document.querySelector('.trans-list__groups').value;
      console.log ('currentG1', currentG);
    } else {
      currentG = currentGroup;
      console.log ('currentG2', currentG);
    }

    let btnDisplay;
    let cost;
    let colorCost;
    
    if (owner) {
      btnDisplay = 'd-none';
      cost = `+${(+trans.totalCost).toFixed(2)}`;
      colorCost = 'text-success';
    } else {
      btnDisplay = 'd-flex';
      cost = `-${(+trans.toUserList.find((user: any) => user.userID === ownUID).cost).toFixed(2)}`;
      colorCost = 'text-danger';
    }

    let transDisplay;
    if (trans.groupID === currentG) {
      transDisplay = 'd-flex';
    } else {
      transDisplay = 'd-none';
    }

    let selectPending = '';
    let selectAbort = '';
    let border = '';
    if (!owner) {
      trans.toUserList.forEach((user: any) => {
        if(user.userID === ownUID) {
          const select = user.state;
          if (user.state === 'pending') {
            selectPending = 'selected';
            border = 'border border-2 border-success';
          } else if (user.state === 'abort') {
            selectAbort = 'selected';
            border = '';
          } else if (user.state === 'approve') {
            btnDisplay = 'd-none';
          }
        }
      });
    } else if (trans.toUserList.some((user:any) => user.state === 'abort')) {
      border = 'border border-2 border-danger';
    } else if (trans.toUserList.some((user:any) => user.state === 'pending')) {
      border = 'border border-2 border-warning';
    } 
  
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
    const transaction = document.createElement('div');
    transaction.className = `trans-item ${transDisplay} ${border} flex-column block--width-85`;
    transaction.setAttribute('group-id', trans.groupID);
    transaction.setAttribute('id', transID);
    transaction.setAttribute('data-time', trans.date);
    transaction.innerHTML = `
      <p class="trans-item__header align-self-start row">
        <span class="trans-item__descr fw-bolder text-truncate">${trans.descripion}</span>
      </p>
      <div class="trans-item__info row">
        <div class="date col-3 align-self-start">
          <div class="trans-item__day">${localeDay}</div>
          <div class="trans-item__time">${localeTime}</div>
        </div>
        <div class="trans-item__users col-5  d-flex align-self-center justify-content-center"></div>
        <div class="trans-item__cost col-4  align-self-center ${colorCost}  justify-content-end text-end">${cost} ${trans.currency}</div>
      </div>
      <div class="trans-item__buttons d-flex justify-content-between">
        <button type="button" class="trans-item__more btn btn-outline-secondary btn-sm">Подробнее</button>
        <div class="trans-item__addform ${btnDisplay}">
          <select class="trans-item__state form-select" aria-label="Default select example">
            <option ${selectPending} value="pending">ожидание</option>
            <option value="approve">подтвердить</option>
            <option ${selectAbort} value="abort">отклонить</option>
          </select>
        </div>
      </div>
    `;

    listOfTrans.prepend(transaction);

    const selectState: HTMLSelectElement = transaction.querySelector('.trans-item__state');
    selectState.addEventListener('change', () => {
      this.onChangeState(selectState.value, transID);
      if(selectState.value === "approve") {
        transaction.classList.remove('border', 'border-2', 'border-success', 'border-danger');
      } else if (selectState.value === "abort") {
        transaction.classList.remove('border-success');
        transaction.classList.add('border', 'border-2', 'border-danger');
      } else if (selectState.value === "pending") {
        transaction.classList.remove('border-danger');
        transaction.classList.add('border', 'border-2', 'border-success');
      }
    });
  }



  addUserToList = (transID: string, user: any, i:number, owner: boolean) => {
   
    let nameDisplay;
    if (owner) {
      nameDisplay = 'd-none';
    } else {
      nameDisplay = 'd-block';   
    }
    const usersList = document.getElementById(transID).querySelector('.trans-item__users');
    const userWrapper = document.createElement('div');
      userWrapper.classList.add('user');
      userWrapper.setAttribute('user-id', user.id); 
      userWrapper.innerHTML = `
        <div class="user__avatar"><img src=${user.avatar} alt=${user.userName}></div>
        <div class="user__name ${nameDisplay}">${user.userName}</div>
      `;

      usersList.append(userWrapper);

        if (i >= 3) {
          if (usersList.querySelector('.add-numb')) {
            usersList.querySelector('.add-numb').remove();
          }
        const addNumb = document.createElement('div');
        addNumb.classList.add('add-numb', 'align-self-end');
        addNumb.innerText = `+${i - 2}`;
        usersList.append(addNumb);
      }
  }

  protected events(): void {
    const groups: HTMLFormElement = document.querySelector('.trans-list__groups');
    groups.addEventListener('change', () => {
      const transList:NodeListOf<HTMLElement> = document.querySelectorAll('.trans-item');
      const groupID = groups.value;
      console.log ('groupValue', groupID);
      // console.log ('groupTitle', groups.inner);
      transList.forEach((transItem: HTMLElement) => {
        const itemGroupID = transItem.getAttribute('group-id');
        if (itemGroupID === groupID) {
          transItem.classList.add('d-flex');
          transItem.classList.remove('d-none');
        } else {
          transItem.classList.add('d-none');
          transItem.classList.remove('d-flex');
        }
      });

      const groupsInModal = document.querySelector('.new-trans__groups-list');
      const optionsModal = groupsInModal.querySelectorAll('option');
      optionsModal.forEach((opt: HTMLOptionElement) => {
        if (opt.value === groupID) {
          opt.setAttribute('selected', '');
        } else {
          opt.removeAttribute('selected');
        }
      });

      const members = document.querySelector('.new-trans__members-list');
      const checkedMembersList: HTMLElement = document.querySelector('.checked-members');
      members.innerHTML = '';
      checkedMembersList.innerHTML = '';
      this.newTrans.onShowMembersOfGroup(groupID);
    });
  }







}









// const transHTML: string = `
// <div class="trans-item ${transDisplay} ${border} flex-column block--width-85" group-id =${trans.groupID} id=${transID} data-time=${trans.date}>
//   <p class="trans-item__header align-self-start row">
//     <span class="trans-item__descr fw-bolder text-truncate">${trans.descripion}</span>
//   </p>

//   <div class="trans-item__info row">
//     <div class="date col-3 align-self-start">
//       <div class="trans-item__day">${localeDay}</div>
//       <div class="trans-item__time">${localeTime}</div>
//     </div>
//     <div class="trans-item__users col-5  d-flex align-self-center justify-content-center"></div>
//     <div class="trans-item__cost col-4  align-self-center ${colorCost}  justify-content-end text-end">${cost} ${trans.currency}</div>
//   </div>
//   <div class="trans-item__buttons d-flex justify-content-between">
//     <button type="button" class="trans-item__more btn btn-outline-secondary btn-sm">Подробнее</button>
//     <div class="trans-item__addform ${btnDisplay}">
//       <select class="trans-item__state form-select" aria-label="Default select example">
//         <option ${selectPending} value="pending">ожидание</option>
//         <option value="approve">подтвердить</option>
//         <option ${selectAbort} value="abort">отклонить</option>
//       </select>
//     </div>

//   </div>

// </div>
// `;