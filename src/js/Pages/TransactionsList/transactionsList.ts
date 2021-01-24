import { Page } from '../../Classes/Page';
import { NewTransaction } from '../newTransaction/newTransaction';
import { Modal } from 'bootstrap';
import { getDate } from './getDate';
import { editSum } from './editSum';
import { setCardStyles } from './setCardStyles'; 
import { setDetailsStyles } from './setDetailsStyles';
import { renderDetailsHTML } from './renderDetailsHTML';
import { renderTransListHTML } from './renderTransListHTML';
import { renderTransCardHTML } from './renderTransCardHTML';
import { renderCheckedMember } from './renderCheckedMember';
import { renderNonCheckedMember } from './renderNonCheckedMember';

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

    this.element.innerHTML = renderTransListHTML();
    this.newTrans = NewTransaction.create('.modal-wrapper');
    this.newTrans.render();
    this.events();
    this.detailsModal = new Modal(document.querySelector('.details'));

  }

  addTotalBalance = (balance: number, currency: string): void => {
     const balanceElement: HTMLElement = document.querySelector('.user-balance');
     balanceElement.innerHTML = `
       <div>${balance}&nbsp;${currency}</div>
     ` ;
     if (balance >= 0) {
       balanceElement.classList.add('text-success');
     } else {
      balanceElement.classList.add('text-danger');
     }
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
    const styles = setCardStyles(trans, owner, ownUID);
    const date: any = getDate(trans.date);
    const transaction: HTMLElement = document.getElementById(transID);
    transaction.className = `trans-item ${styles.border} flex-column justify-content-between block--width-85`;
    transaction.setAttribute('group-id', trans.groupID);
    transaction.setAttribute('data-time', trans.date);
    transaction.innerHTML = renderTransCardHTML(trans, date, styles);

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
      this.changeCardStyle(trans, select.value );
    });
  }

  changeCardStyle = (transaction: HTMLElement, selectValue: string) => {
    if (selectValue === 'approve') {
      transaction.classList.remove('border-success', 'border-danger');
    } else if (selectValue === 'abort') {
      transaction.classList.remove('border-success');
      transaction.classList.add('border-danger');
    } else if (selectValue === 'pending') {
      transaction.classList.remove('border-danger');
      transaction.classList.add('border-success');
    }
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

  renderOutTrans = (wrapper: HTMLElement, transID: string, trans: any, owner: boolean, ownUID: string, selectValue: string): void => {
    
    const styles = setDetailsStyles(trans, owner, ownUID);
    if (!trans.photo) {
      trans.photo = '';
    }
    wrapper.innerHTML = '';
    const date: any = getDate(trans.date);
    const baseHTML = renderDetailsHTML(trans, date, styles);
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
      const transaction = document.getElementById(transID);
      optInCardSelect.forEach((opt: HTMLOptionElement) => {
        if (opt.value === detailsSelect.value) {
          opt.setAttribute('selected', '');
        } else {
          opt.removeAttribute('selected');
        }
     
        this.changeCardStyle(transaction, detailsSelect.value,);       
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
      member.innerHTML = renderCheckedMember(user, currUser); 

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
      member.innerHTML = renderNonCheckedMember(user);
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
        editSum(trans, modalWrapper, membInput);
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
      editSum(trans, modalWrapper);
      const notMembers = notMembersWrapper.querySelectorAll('.details__memb-wrapper');
      if (notMembers.length === 0) {
        btnAddMembers.style.display = 'none';
      } else {
        btnAddMembers.style.display = 'block';
      }
    });
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
