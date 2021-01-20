import { Page } from '../../Classes/Page';
import { NewTransaction } from '../newTransaction/newTransaction';
import { Modal } from 'bootstrap';
import { getDate } from './getDate';

export class TransactionsList extends Page {
  onChangeState: any;
  onGetTransInfo: any;
  // onGetMembers: any;

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
          <div class="user-balance text-center w-25"></div>
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
    groups.prepend(groupElement);
  }

  addTransactionWrapper = (transID:string) => {
    const listOfTrans: HTMLElement = document.querySelector('.trans-list__list');
    const transaction: HTMLElement = document.createElement('div');
    transaction.setAttribute('id', transID);
    listOfTrans.prepend(transaction);
  }

  addMyTransactions = (transID:string, trans: any, currentGroup: string, owner: boolean, ownUID:string):void => {

    const styles = this.setStyles(trans, currentGroup, owner, ownUID);
    const date: any = getDate(trans.date);
    const transaction: HTMLElement = document.getElementById(transID);
    transaction.className = `trans-item ${styles.transDisplay} ${styles.border} flex-column justify-content-between block--width-85`;
    transaction.setAttribute('group-id', trans.groupID);
    transaction.setAttribute('data-time', trans.date);
    transaction.innerHTML = `
      <p class="trans-item__header align-self-start row">
        <span class="trans-item__descr fw-bolder text-truncate">${trans.description}</span>
      </p>
      <div class="trans-item__info row">
        <div class="date col-3 align-self-start">
          <div class="trans-item__day">${date.localeDay}</div>
          <div class="trans-item__time">${date.localeTime}</div>
        </div>
        <div class="trans-item__users col-5  d-flex align-self-center justify-content-center"></div>
        <div class="trans-item__cost col-4  align-self-center ${styles.colorCost}  justify-content-end text-end">${styles.cost} ${trans.currency}</div>
      </div>
      <div class="trans-item__buttons d-flex justify-content-between">
        <button type="button" class="trans-item__more btn btn-outline-secondary btn-sm">Подробнее</button>
        <div class="trans-item__addform ${styles.btnDisplay}">
          <select class="trans-item__state form-select" aria-label="Default select example">
            <option ${styles.selectPending} value="pending">ожидание</option>
            <option value="approve">подтвердить</option>
            <option ${styles.selectAbort} value="abort">отклонить</option>
          </select>
        </div>
      </div>

      <div class="details modal fade" id=${transID} data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content details__wrapper">      
          </div>
        </div>
      </div> 
    `;

    const selectState: HTMLSelectElement = transaction.querySelector('.trans-item__state');
    this.changeSelectState(selectState, transaction, transID);
    const detailsModal = new Modal(transaction.querySelector('.details'));
    const detailsModalWrapper:HTMLElement = transaction.querySelector('.details__wrapper');
    const btnDetails: HTMLElement = transaction.querySelector('.trans-item__more');
    btnDetails.addEventListener('click',() => {

      this.renderOutTrans(detailsModalWrapper, transID, trans, owner, ownUID, selectState.value);
      detailsModal.show();

      // this.modalEvents(detailsModalWrapper);

    });
  }

  changeSelectState = (select: HTMLSelectElement, trans: HTMLElement, transID: string):void => {
    select.addEventListener('change', () => {
      this.onChangeState(select.value, transID);
      if(select.value === "approve") {
        trans.classList.remove('border', 'border-2', 'border-success', 'border-danger');
      } else if (select.value === "abort") {
        trans.classList.remove('border-success');
        trans.classList.add('border', 'border-2', 'border-danger');
      } else if (select.value === "pending") {
        trans.classList.remove('border-danger');
        trans.classList.add('border', 'border-2', 'border-success');
      }
    });
  }

  addUserToList = (transID: string, user: any, i:number, owner: boolean) => {
   
    let nameDisplay: string;
    if (owner) {
      nameDisplay = 'd-none';
    } else {
      nameDisplay = 'd-block';   
    }
    const usersList: HTMLElement = document.getElementById(transID).querySelector('.trans-item__users');
    const userWrapper: HTMLElement = document.createElement('div');
      userWrapper.classList.add('user');
      userWrapper.setAttribute('user-id', user.id); 
      userWrapper.innerHTML = `
        <div class="user__avatar"><img src=${user.avatar} alt=${user.userName}></div>
        <div class="user__name ${nameDisplay}">${user.userName}</div>
      `;

      usersList.append(userWrapper);

        if (i > 3) {
          if (usersList.querySelector('.add-numb')) {
            usersList.querySelector('.add-numb').remove();
          }
        const addNumb = document.createElement('div');
        addNumb.classList.add('add-numb', 'align-self-end');
        addNumb.innerText = `+${i - 3}`;
        usersList.append(addNumb);
      }
  }

  setStyles = (trans: any, currentGroup: string, owner: boolean, ownUID:string) => {
    let currentG: string;
    const transList: HTMLFormElement = document.querySelector('.trans-list__groups');
    if (transList.value) {    
      currentG = transList.value;
     
    } else {
      currentG = currentGroup;   
    }

    let btnDisplay: string;
    let cost: string;
    let colorCost: string;
    let transDisplay: string;
    
    if (owner) {
      btnDisplay = 'd-none';
      cost = `+${(+trans.totalCost).toFixed(2)}`;
      colorCost = 'text-success';
    } else {
      btnDisplay = 'd-flex';
      const user:any[] = Object.entries(trans.toUserList).find((user: any) => user[0] === ownUID);
      cost = `-${(+user[1].cost).toFixed(2)}`;
      colorCost = 'text-danger';
    }

    if (trans.groupID === currentG) {
      transDisplay = 'd-flex';
    } else {
      transDisplay = 'd-none';
    }

    let selectPending: string = '';
    let selectAbort: string = '';
    let border: string = '';
    if (!owner) {
      Object.entries(trans.toUserList).forEach((user: any) => {
        if(user[0] === ownUID) {
          const select = user[1].state;
          if (user[1].state === 'pending') {
            selectPending = 'selected';
            border = 'border border-2 border-success';
          } else if (user[1].state === 'abort') {
            selectAbort = 'selected';
            border = 'border border-2 border-danger';
          } else if (user[1].state === 'approve') {
            btnDisplay = 'd-none';
          }
        }
      });
    } else if (Object.entries(trans.toUserList).some((user:any) => user[1].state === 'abort')) {
      border = 'border border-2 border-danger';
    } else if (Object.entries(trans.toUserList).some((user:any) => user[1].state === 'pending')) {
      border = 'border border-2 border-warning';
    } 

    return {
      currentG,
      btnDisplay,
      cost,
      colorCost,
      transDisplay,
      border,
      selectPending,
      selectAbort
    }
  }

  renderOutTrans = (wrapper:HTMLElement, transID: string, trans: any, owner:boolean, ownUID: string, selectValue:string):void => {

    if (!trans.photo) {
      trans.photo = '';
    }
    const userList: any[] = Object.entries(trans.toUserList);
    let ownComment: string = '';
    let ownCost: string = '';
    userList.forEach ((user) => {
      if (user[0] === ownUID) {
        ownComment = user[1].comment;
        ownCost = user[1].cost;
      } 
    });
   
    let ownerDisplay: string; 
    let colorText: string;
    let cost: string;
    let membDisplay: string;
    let commentDisplay: string;
    let selectDisplay: string;
    if(owner) {
      ownerDisplay = 'd-none';
    
      colorText = 'text-success';
      cost = `+${trans.totalCost}`;
      membDisplay = '';
      commentDisplay = 'd-none';
      selectDisplay = 'd-none';
       
    } else {
      ownerDisplay = '';

      colorText = 'text-danger';
      cost = `-${ownCost}`;
      membDisplay = 'd-none';
      commentDisplay = '';
      selectDisplay = '';
    } 


    let checkDisplay: string;
    if (trans.photo && owner) {
      checkDisplay = 'd-flex';
    } else {
      checkDisplay = 'd-none';
    }
    wrapper.innerHTML = '';
    const date: any = getDate(trans.date);
    const baseHTML = `    
      <div class="details__header modal-header">
        <h5 class="details__descr modal-title fw-bolder">${trans.description}</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="details__info modal-body">
        <div class="details__group"></div>
        <div class="details__date">
          <div class="details__day">${date.localeDay}</div>
          <div class="details__time">${date.localeTime}</div>
        </div>

        <div class="${ownerDisplay} details__owner d-flex align-items-center">
          <div>Плательщик: </div>
          <div class="details__owner-info d-flex flex-column align-items-center">
          </div>
        </div>

        <div class="details__cost">
          <span>Сумма:</span>&nbsp;
          <span class="fs-4 ${colorText}">${cost}</span>&nbsp;
          <span class="fs-4 ${colorText}">${trans.currency}</span>
        </div>

        <div class="${commentDisplay} details__comment-box d-flex">
          <div>Комментарий: </div>
          <div details__comment>${ownComment}</div>
        </div>

        <select class="${selectDisplay} details__state form-select" aria-label="Default select example">
            <option value="pending">ожидание</option>
            <option value="approve">подтвердить</option>
            <option value="abort">отклонить</option>
        </select>

        <div class="details__check ${checkDisplay} align-items-center">
          <div>Чек: </div>
          <div class="details__icon-wrapper"><img class="details__icon" src=${trans.photo[0]} alt="check"></div>
        </div>

        <div class="modal fade details__check-modal" id="check" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content p-2 d-flex flex-column">
                <button type="button" class="btn-close align-self-end details__close-check" aria-label="Close"></button>
                <div class="p-2 details__check-box">              
                </div>
            </div>
          </div>
        </div>

      </div>
      <div class="${membDisplay} details__members modal-body">      
      </div>     
      <button class=" ${membDisplay} details__add-memb btn btn-secondary btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#notMembers">Добавить участников</button>
      <div class=" ${membDisplay} details__not-members modal-body collapse" id="notMembers">     
      </div>
      <div class="modal-footer">
        <button type="button" class="details__save btn btn-primary">Save changes</button>
      </div> 
    `;
    wrapper.insertAdjacentHTML('beforeend', baseHTML);
    this.onGetTransInfo(trans, transID, trans.groupID);
    const detailsSelect: HTMLElement = wrapper.querySelector('.details__state');
    const options: NodeListOf<HTMLElement> = detailsSelect.querySelectorAll('option');
    options.forEach((opt: HTMLOptionElement) => {
      if(opt.value === selectValue) {
        opt.setAttribute('selected', '');
      }
    });

    const checkBox = wrapper.querySelector('.details__check-box');
    console.log ('checkbox', checkBox);
    if (trans.photo) {
      trans.photo.forEach((photo: string) => {
         console.log ('photo', photo);
         const photoElement: string = `
            <div class="details__check-wrapper">
              <img class="details__check-image" src=${photo} alt="check">
            </div>
         `;
         checkBox.insertAdjacentHTML('beforeend', photoElement);
      });
    }

    const checkModal = new Modal(wrapper.querySelector('.details__check-modal'));
    const checkIcon: HTMLElement  = wrapper.querySelector('.details__icon-wrapper');
    const closeCheckBtn: HTMLElement = wrapper.querySelector('.details__close-check');
    checkIcon.addEventListener('click', () => {
      checkModal.show();
    });
    closeCheckBtn.addEventListener('click', () => {
      checkModal.hide();
    });

    

  }

  addGroupTitle = (transID: string, title: string) =>  {
    const modalWrapper: HTMLElement = document.getElementById(transID);
    const titleElement: HTMLElement = modalWrapper.querySelector('.details__group');
    titleElement.innerText = `Группа: ${title}`;
  }

  addOwnerInfo = (transID:string, owner: any) => {
    const modalWrapper: HTMLElement = document.getElementById(transID);
    const ownerWrapper: HTMLElement = modalWrapper.querySelector('.details__owner-info');
    ownerWrapper.innerHTML = `
      <div class="details__owner-avatar"><img src="${owner.avatar}" alt=${owner.name}></div>
      <div class="details__owner-name">${owner.name}</div>
    `;
  }


  addMemberOfTransaction = (transID: string, trans: any, user: any) => {
    console.log ('trans', trans);  
    const modalWrapper: HTMLElement = document.getElementById(transID);
    const membersWrapper: HTMLElement = modalWrapper.querySelector('.details__members');
    const notMembersWrapper: HTMLElement = modalWrapper.querySelector('.details__not-members');
    const member: HTMLElement = document.createElement('div');
    const currUser: any[] = Object.entries(trans.toUserList).find((userTrans: any) => userTrans[0] === user.key)

    if (currUser){

      member.className = 'details__memb-wrapper details__memb--checked d-flex justify-content-between';
      member.setAttribute('id', user.key);
      member.innerHTML =`
        <div class="details__member d-flex flex-column align-items-center">
          <div class="details__avatar"><img src="${user.avatar}" alt=${user.name}></div>
          <div class="details__name">${user.name}</div>
        </div>
        <input class="details__member-cost form-control form-control-sm" type="text" value=${currUser[1].cost.toFixed(2)}>
        <textarea class="details__member-comment form-control" placeholder="Комментарий">${currUser[1].comment}</textarea>
        <div class="details__member-state d-flex justify-content-center"></div>
        <button class="details__member-delete btn btn-outline-secondary btn-sm"><i class="material-icons">clear</i></button>
      `;

      const state: HTMLElement = member.querySelector('.details__member-state');
      if (currUser[1].state === 'pending') {
        state.innerHTML = 'pending';
      } else if (currUser[1].state === 'approve'){
        state.innerHTML = `<i class="material-icons text-success">done</i>`;
      } else if (currUser[1].state === 'abort') {
        state.innerHTML = `<i class="material-icons text-danger">minimize</i>`;
      }      
      membersWrapper.append(member);

    } else {
      member.className = 'details__memb-wrapper details__memb--not-checked d-flex justify-content-between';
      member.setAttribute('id', user.key);
      member.innerHTML =`
        <div class="details__member d-flex flex-column align-items-center">
          <div class="details__avatar"><img src="${user.avatar}" alt=${user.name}></div>
          <div class="details__name">${user.name}</div>
        </div>
        <input class="details__member-cost form-control form-control-sm" type="text" value="0.00">
        <textarea class="details__member-comment form-control" placeholder="Комментарий"></textarea>
        <div class="details__member-state d-flex justify-content-center"></div>
        <button class="details__member-delete btn btn-outline-secondary btn-sm"><i class="material-icons">add</i></button>
      `;

      notMembersWrapper.append(member);
    }
    const btnAddMembers:HTMLButtonElement = modalWrapper.querySelector('.details__add-memb');
    const notMembers: NodeListOf<HTMLElement> = notMembersWrapper.querySelectorAll('.details__memb-wrapper');
    console.log ('not memb', notMembers);
    if (notMembers.length === 0) {
      btnAddMembers.style.display = 'none';
    } else {
      btnAddMembers.style.display = '';
    }
   
  }

  protected events(): void {
    const groups: HTMLFormElement = document.querySelector('.trans-list__groups');
    groups.addEventListener('change', () => {
      const transList:NodeListOf<HTMLElement> = document.querySelectorAll('.trans-item');
      const groupID = groups.value;
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

      const groupsInModal: HTMLElement = document.querySelector('.new-trans__groups-list');
      const optionsModal: NodeListOf<HTMLOptionElement> = groupsInModal.querySelectorAll('option');
      optionsModal.forEach((opt: HTMLOptionElement) => {
        if (opt.value === groupID) {
          opt.setAttribute('selected', '');
        } else {
          opt.removeAttribute('selected');
        }
      });

      const members: HTMLElement = document.querySelector('.new-trans__members-list');
      const checkedMembersList: HTMLElement = document.querySelector('.checked-members');
      members.innerHTML = '';
      checkedMembersList.innerHTML = '';
      this.newTrans.onShowMembersOfGroup(groupID);
    });
  }
}








