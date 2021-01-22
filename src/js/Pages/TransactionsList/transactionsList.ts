import { Page } from '../../Classes/Page';
import { NewTransaction } from '../newTransaction/newTransaction';
import { Modal } from 'bootstrap';
import { getDate } from './getDate';

export class TransactionsList extends Page {
  onChangeState: any;
  onGetTransInfo: any;
  onEditTransaction: any;
  onDeleteTransaction: any;
  detailsModal:any;

  public newTrans: NewTransaction;


  static create(element: string): TransactionsList {
    return new TransactionsList(element);
  }

  public render = (): void => {

    this.element.innerHTML = `
    <div class="block__wrapper">
      <div class="block__content">
        <div class="translist__header translist__header--main">
          <p class="block__title">Список транзакций</p>
        </div>

        <div class="block__groups block--width-85">
          <select class="trans-list__groups form-select w-75" aria-label="Default select example">
            <option value="all-trans">Все </option>
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

    <div class="details modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content details__wrapper">
        </div>
      </div>
    </div>
    `;

    this.newTrans = NewTransaction.create('.modal-wrapper');
    this.newTrans.render();
    this.events();
    this.detailsModal = new Modal(document.querySelector('.details'));

  }

  addGroupToTransList = (groupID: string, groupTitle: string) => {
    const groups: HTMLFormElement = document.querySelector('.trans-list__groups');
    const groupElement = document.createElement('option');
    groupElement.classList.add('trans-list__group');
    groupElement.value = groupID;
    groupElement.innerText = groupTitle;
    groups.prepend(groupElement);
  }

  addTransactionWrapper = (transID: string) => {
    const listOfTrans: HTMLElement = document.querySelector('.trans-list__list');
    const transaction: HTMLElement = document.createElement('div');
    transaction.setAttribute('id', transID);
    listOfTrans.prepend(transaction);
  }

  addMyTransactions = (transID: string, trans: any, owner: boolean, ownUID: string): void => {
    const styles = this.setStyles(trans, owner, ownUID);
    const date: any = getDate(trans.date);
    const transaction: HTMLElement = document.getElementById(transID);
    transaction.className = `trans-item ${styles.border} flex-column justify-content-between block--width-85`;
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
      <div class="trans-item__buttons d-flex w-100 justify-content-between">
        <div></div>
        <div class="trans-item__addform ${styles.btnDisplay}">
          <select class="trans-item__state form-select" aria-label="Default select example">
            <option ${styles.selectPending} value="pending">ожидание</option>
            <option ${styles.selectApprove} value="approve">подтвердить</option>
            <option ${styles.selectAbort} value="abort">отклонить</option>
          </select>
        </div>
      </div>

     
    `;

    const selectState: HTMLSelectElement = transaction.querySelector('.trans-item__state');
    this.changeSelectState(selectState, transaction, transID);
    const detailsModalWrapper: HTMLElement = document.querySelector('.details__wrapper');
    transaction.addEventListener('click', (e) => {
      const { target }: any = e;
      if(!target.closest('.trans-item__state')) {
        this.detailsModal.show();
        this.renderOutTrans(detailsModalWrapper, transID, trans, owner, ownUID, selectState.value);
       
      }
    });
  }

  changeSelectState = (select: HTMLSelectElement, trans: HTMLElement, transID: string): void => {
    select.addEventListener('change', () => {
      this.onChangeState(select.value, transID);
      if (select.value === 'approve') {
        trans.classList.remove('border-success', 'border-danger');
      } else if (select.value === 'abort') {
        trans.classList.remove('border-success');
        trans.classList.add('border-danger');
      } else if (select.value === 'pending') {
        trans.classList.remove('border-danger');
        trans.classList.add('border-success');
      }
    });
  }

  addUserToList = (transID: string, user: any, i: number, owner: boolean) => {

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

  setStyles = (trans: any, owner: boolean, ownUID: string) => {

    let btnDisplay: string;
    let cost: string;
    let colorCost: string;

    if (owner) {
      btnDisplay = 'd-none';
      cost = `+${(+trans.totalCost).toFixed(2)}`;
      colorCost = 'text-success';
    } else {
      btnDisplay = 'd-flex';
      const user: any[] = Object.entries(trans.toUserList).find((user: any) => user[0] === ownUID);
      cost = `-${(+user[1].cost).toFixed(2)}`;
      colorCost = 'text-danger';
    }

    let selectPending: string = '';
    let selectAbort: string = '';
    let selectApprove: string = '';
    let border: string = '';
    if (!owner) {
      Object.entries(trans.toUserList).forEach((user: any) => {
        if (user[0] === ownUID) {
          if (user[1].state === 'pending') {
            selectPending = 'selected';
            border = 'border-success';
          } else if (user[1].state === 'abort') {
            selectAbort = 'selected';
            border = 'border-danger';
          } else if (user[1].state === 'approve') {
            selectApprove = 'selected';
            btnDisplay = 'd-none';
          }
        }
      });
    } else if (Object.entries(trans.toUserList).some((user: any) => user[1].state === 'abort')) {
      border = 'border-danger';
    } else if (Object.entries(trans.toUserList).some((user: any) => user[1].state === 'pending')) {
      border = 'border-warning';
    }

    return {
      btnDisplay,
      cost,
      colorCost,
      border,
      selectPending,
      selectAbort,
      selectApprove
    };
  }

  renderOutTrans = (wrapper: HTMLElement, transID: string, trans: any, owner: boolean, ownUID: string, selectValue: string): void => {

    if (!trans.photo) {
      trans.photo = '';
    }
    const userList: any[] = Object.entries(trans.toUserList);
    let ownComment: string = '';
    let ownCost: string = '';
    userList.forEach ((user) => {
      if (user[0] === ownUID) {
        ownComment = user[1].comment;
        ownCost = (+user[1].cost).toFixed(2);
      }
    });

    let ownerDisplay: string;
    let colorText: string;
    let cost: string;
    let membDisplay: string;
    let commentDisplay: string;
    let selectDisplay: string;
    if (owner) {
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

    let btnSaveDisplay: string = '';
    if (!owner) {
      btnSaveDisplay = 'd-none';
    } 


    let checkDisplay: string;
    if (trans.photo) {
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

        <div class="details__date d-flex">
          <div class="details__day">${date.localeDay}</div>
          <div class="details__time">${date.localeTime}</div>
        </div>

        <div class="details__group"></div>
    
        <div class="${ownerDisplay} details__owner d-flex align-items-center">
          <div>Плательщик: </div>
          <div class="details__owner-info d-flex flex-column align-items-center">
          </div>
        </div>

        <div class="details__cost">
          <span>Сумма:</span>&nbsp;
          <span class="fs-5 ${colorText}">${cost}</span>&nbsp;
          <span class="fs-5 ${colorText}">${trans.currency}</span>
        </div>

        <div class="${commentDisplay} details__comment-box d-flex">
          <div>Комментарий: </div>
          <div class="details__comment">${ownComment}</div>
        </div>
      
        <div class="${checkDisplay} details__check align-items-center d-flex">
          <div>Чек: </div>
          <div class="details__icon-wrapper"><img class="details__icon" src=${trans.photo[0]} alt="check"></div>
        </div>

        <div class="${selectDisplay} details__state-wrapper">       
          <select class="details__state form-select" aria-label="Default select example">
            <option value="pending">ожидание</option>
            <option value="approve">подтвердить</option>
            <option value="abort">отклонить</option>
          </select>
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
      <div class="modal-footer ${btnSaveDisplay}">
        <button type="button" class="details__delete btn btn-danger">Удалить</button>
        <button type="button" class="details__save btn btn-primary">Сохранить</button>
      </div>
    `;
    wrapper.insertAdjacentHTML('beforeend', baseHTML);

    this.onGetTransInfo(trans, trans.groupID);

    const detailsSelectWrapper: HTMLElement = wrapper.querySelector('.details__state-wrapper');
    const detailsSelect: HTMLSelectElement = wrapper.querySelector('.details__state');
    const options: NodeListOf<HTMLElement> = detailsSelect.querySelectorAll('option');
    options.forEach((opt: HTMLOptionElement) => {
      if (opt.value === selectValue) {
        opt.setAttribute('selected', '');
      }
      if (selectValue === 'approve') {
        detailsSelectWrapper.innerHTML = 'Подтверждено';
      }
    });

    detailsSelect.addEventListener('change', () => {
      this.onChangeState(detailsSelect.value, transID);
      const optInCardSelect = document.getElementById(transID).querySelector('.trans-item__state').querySelectorAll('option');
      const trans = document.getElementById(transID);
      optInCardSelect.forEach((opt: HTMLOptionElement) => {
        if (opt.value === detailsSelect.value) {
          opt.setAttribute('selected', '');
        } else {
          opt.removeAttribute('selected');
        }

        if (detailsSelect.value === 'approve') {
          trans.classList.remove('border-success', 'border-danger');
        } else if (detailsSelect.value === 'abort') {
          trans.classList.remove('border-success');
          trans.classList.add('border-danger');
        } else if (detailsSelect.value === 'pending') {
          trans.classList.remove('border-danger');
          trans.classList.add('border-success');
        }
        
      });
    });

    const checkBox = wrapper.querySelector('.details__check-box');
    if (trans.photo) {
      trans.photo.forEach((photo: string) => {
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

    const btnSaveEdit = wrapper.querySelector('.details__save');
    btnSaveEdit.addEventListener('click', (e) => {
      e.preventDefault();
      const editData = this.getDataforEditTransaction(wrapper);
      this.onEditTransaction(editData, transID, trans);
      this.detailsModal.hide();
    });

    const btnDelete = wrapper.querySelector('.details__delete');
    btnDelete.addEventListener('click', (e) => {
      e.preventDefault();
      const groupID = wrapper.querySelector('.details__group').getAttribute('groupID');
      this.detailsModal.hide();
      const transCard = document.getElementById(transID);
      transCard.remove();
      this.onDeleteTransaction(groupID, transID);
    });
 
  }

  addGroupTitle = (groupID: string, title: string) =>  {
    const modalWrapper: HTMLElement = document.querySelector('.details__wrapper');
    const titleElement: HTMLElement = modalWrapper.querySelector('.details__group');
    titleElement.setAttribute('groupID', groupID);
    titleElement.innerText = `Группа: ${title}`;
  }

  addOwnerInfo = (owner: any) => {    
    const modalWrapper: HTMLElement = document.querySelector('.details__wrapper');
    const ownerWrapper: HTMLElement = modalWrapper.querySelector('.details__owner-info');
    ownerWrapper.innerHTML = `
      <div class="details__owner-name">${owner.name}</div>
    `;
  }

  addMemberOfTransaction = (trans: any, user: any) => {    
    const modalWrapper: HTMLElement = document.querySelector('.details__wrapper');
    const membersWrapper: HTMLElement = modalWrapper.querySelector('.details__members');
    const notMembersWrapper: HTMLElement = modalWrapper.querySelector('.details__not-members');
    const member: HTMLElement = document.createElement('div');
    const currUser: any[] = Object.entries(trans.toUserList).find((userTrans: any) => userTrans[0] === user.key);

    if (currUser) {
      member.className = 'details__memb-wrapper details__memb--checked d-flex justify-content-between';
      member.setAttribute('user-id', user.key);
      member.setAttribute('user-state', currUser[1].state);
      member.innerHTML = `
        <div class="details__member d-flex flex-column align-items-center">
          <div class="details__avatar"><img src="${user.avatar}" alt=${user.name}></div>
          <div class="details__name">${user.name}</div>
        </div>
        <input class="details__member-cost form-control form-control-sm ${currUser[1].costFix}" type="text" value=${(+currUser[1].cost).toFixed(2)}>
        <textarea class="details__member-comment form-control" placeholder="Комментарий">${currUser[1].comment}</textarea>
        <div class="details__member-state d-flex justify-content-center"></div>
        <button class="details__member-delete btn btn-outline-secondary btn-sm"><i class="material-icons">clear</i></button>
      `;

      const state: HTMLElement = member.querySelector('.details__member-state');
      if (currUser[1].state === 'pending') {
        state.innerHTML = 'ожидание';
      } else if (currUser[1].state === 'approve') {
        state.innerHTML = `<i class="material-icons text-success">done</i>`;
        member.querySelector('.details__member-delete').classList.add('invisible');
      } else if (currUser[1].state === 'abort') {
        state.innerHTML = `<i class="material-icons text-danger">minimize</i>`;
      }
      membersWrapper.append(member);

    } else {
      member.className = 'details__memb-wrapper details__memb--not-checked d-flex justify-content-between';
      member.setAttribute('user-id', user.key);
      member.innerHTML = `
        <div class="details__member d-flex flex-column align-items-center">
          <div class="details__avatar"><img src="${user.avatar}" alt=${user.name}></div>
          <div class="details__name">${user.name}</div>
        </div>
        <input class="details__member-cost form-control form-control-sm non-fixed" type="text" value="0.00">
        <textarea class="details__member-comment form-control" placeholder="Комментарий"></textarea>
        <div class="details__member-state d-flex justify-content-center"></div>
        <button class="details__member-delete btn btn-outline-secondary btn-sm"><i class="material-icons">add</i></button>
      `;
      notMembersWrapper.append(member);
    }
    const btnAddMembers: HTMLButtonElement = modalWrapper.querySelector('.details__add-memb');
    const notMembers: NodeListOf<HTMLElement> = notMembersWrapper.querySelectorAll('.details__memb-wrapper');
    if (notMembers.length === 0) {
      btnAddMembers.style.display = 'none';
    } else {
      btnAddMembers.style.display = '';
    }

    const membInput: HTMLInputElement = member.querySelector('.details__member-cost');
    membInput.addEventListener('input', () => {
      if(+membInput.value >= 0 ) {
        membInput.classList.add('fixed');
        membInput.classList.remove('non-fixed');
        this.editSum(trans, modalWrapper, membInput);
      } 
    });
    
    member.querySelector('.details__member-delete').addEventListener('click', () => {
      if (member.querySelector('.details__member-delete').innerText === 'clear') {
        notMembersWrapper.append(member);
        member.classList.add('details__memb--not-checked');
        member.classList.remove('details__memb--checked');
        member.querySelector('.details__member-cost').value = '0.00';
        member.querySelector('.details__member-cost').classList.add('non-fixed');
        member.querySelector('.details__member-comment').value = '';
        member.querySelector('.details__member-state').innerHTML = '';
        member.querySelector('.details__member-delete').innerHTML = '<i class="material-icons">add</i>';
      } else {
        membersWrapper.append(member);
        member.classList.remove('details__memb--not-checked');
        member.classList.add('details__memb--checked');
        member.setAttribute('user-state', 'pending');
        member.querySelector('.details__member-state').innerHTML = 'ожидание';
        member.querySelector('.details__member-delete').innerHTML = '<i class="material-icons">clear</i>';       
      }
      this.editSum(trans, modalWrapper);
      const notMembers = notMembersWrapper.querySelectorAll('.details__memb-wrapper');
      if (notMembers.length === 0) {
        btnAddMembers.style.display = 'none';
      } else {
        btnAddMembers.style.display = 'block';
      }
    });
  }

  editSum = (trans: any, wrapper: HTMLElement, membInput?:HTMLInputElement) => {
    
    const membersWrapper: HTMLElement = wrapper.querySelector('.details__members');
    const fixedSums = membersWrapper.querySelectorAll('.fixed');
    const nonFixedSums = membersWrapper.querySelectorAll('.non-fixed');  
    const btnSaveEdit = wrapper.querySelector('.details__save');
    if (nonFixedSums) {
      const numb: number = nonFixedSums.length;
      let sumOfFixed: number = 0;
      fixedSums.forEach((sum: HTMLFormElement) => {
        sumOfFixed += +sum.value;
      });   
      const restSum: number = +((+trans.totalCost - sumOfFixed) / numb).toFixed(2);
      if (restSum > 0) {
        nonFixedSums.forEach((sum: HTMLFormElement) => {
          sum.value = +restSum.toFixed(2);
          if (membInput) {
            membInput.classList.remove('text-danger');
            btnSaveEdit.classList.remove('disabled'); 
          }
        }) 
      } else {
        membInput.classList.add('text-danger');
        btnSaveEdit.classList.add('disabled');
      }      
    }
  
  }

  getDataforEditTransaction = (transWrapper:HTMLElement) => {
    const newUsers: any[] = [];
    const newMembers = transWrapper.querySelectorAll('.details__memb--checked');
    newMembers.forEach((member: HTMLElement) => {
      const newUser: any = {};
      newUser.userID = member.getAttribute('user-id');
      newUser.cost = member.querySelector('.details__member-cost').value;
      newUser.comment = member.querySelector('.details__member-comment').value;
      newUser.state = member.getAttribute('user-state');
      if (member.querySelector('.details__member-cost').classList.contains('fixed')) {
        newUser.costFix = 'fixed';
      } else {
        newUser.costFix = 'non-fixed';
      }
      if (+newUser.cost > 0 ) {
        newUsers.push(newUser);
      }
    });
    return newUsers;
  }

  protected events(): void {
    const groups: HTMLFormElement = document.querySelector('.trans-list__groups');
    groups.addEventListener('change', () => {
      const transList: NodeListOf<HTMLElement> = document.querySelectorAll('.trans-item');
      const groupID = groups.value;

      transList.forEach((transItem: HTMLElement) => {
        const itemGroupID = transItem.getAttribute('group-id');
        
        if (itemGroupID === groupID || groups.value === "all-trans") {
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
          const members: HTMLElement = document.querySelector('.new-trans__members-list');
          const checkedMembersList: HTMLElement = document.querySelector('.checked-members');
          members.innerHTML = '';
          checkedMembersList.innerHTML = '';
          this.newTrans.onShowMembersOfGroup(groupID);
        } else {
          opt.removeAttribute('selected');
        }
      });
    });
  }
}








