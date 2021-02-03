import { Page } from '../../Classes/Page';
import { NewTransaction } from '../NewTransaction/NewTransaction';
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
import { changeBalanceStyle } from './changeBalanceStyle';
import { Currencies } from '../../Classes/Currencies';

import { i18n } from '@lingui/core';
import { messagesRU } from '../../languages/RU/messages';
import { messagesENG } from '../../languages/ENG/messages';
import { loadLanguage } from '../../Util/saveLoadLanguage';
i18n.load('RU', messagesRU);
i18n.load('ENG', messagesENG);

const locale = loadLanguage();
i18n.activate(locale);

export class TransactionsList extends Page {
  onChangeState: any;
  onGetTransInfo: any;
  onEditTransaction: any;
  onDeleteTransaction: any;
  detailsModal: any;
  onRenderGroupBalance: any;
  onRenderTotalBalance: any;

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
    const balanceElement: HTMLElement = document.querySelector('.trans-list__user-balance');
    const fromUsd = Currencies.fromUSD(currency);
    fromUsd(balance)
      .then((resBalance: number) => {
        if (resBalance > 0) {
          balanceElement.innerHTML = `
            <div>+${resBalance.toFixed(2)} ${currency}</div>
          `;
        } else {
          balanceElement.innerHTML = `
            <div>${resBalance.toFixed(2)} ${currency}</div>
          `;
        }
        changeBalanceStyle(resBalance, balanceElement);
      });
  }

  addGroupBalance = (data: any): void => {
    const balanceElement: HTMLElement = document.querySelector('.trans-list__user-balance');
    const fromUsd = Currencies.fromUSD(data.currency);
    fromUsd(data.balance)
      .then((resBalance: number) => {
        if (resBalance > 0) {
          balanceElement.innerHTML = `
            <div>+${resBalance.toFixed(2)} ${data.currency}</div>
          `;
        } else {
          balanceElement.innerHTML = `
            <div>${resBalance.toFixed(2)} ${data.currency}</div>
          `;
        }
        changeBalanceStyle(resBalance, balanceElement);
      });
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
    transaction.className = `trans-item ${styles.border} flex-column justify-content-start block--width-85`;
    transaction.setAttribute('group-id', trans.groupID);
    transaction.setAttribute('data-time', trans.date);
    transaction.innerHTML = renderTransCardHTML(trans, date, styles);

    const selectState: HTMLSelectElement = transaction.querySelector('.trans-item__state');
    this.changeSelectState(selectState, transaction, transID);
    const detailsModalWrapper: HTMLElement = document.querySelector('.details__wrapper');
    const transactionWrapper = transaction.querySelector('.trans-item__wrapper');
    transactionWrapper.addEventListener('click', (e) => {
      const { target }: any = e;
      if (!target.closest('.trans-item__state')) {
        this.detailsModal.show();
        this.renderOutTrans(detailsModalWrapper, transID, trans, owner, ownUID, selectState.value);
      }
    });
  }

  changeSelectState = (select: HTMLSelectElement, trans: HTMLElement, transID: string): void => {
    select.addEventListener('change', () => {
      this.onChangeState(select.value, transID);
      this.changeCardStyle(select, trans, select.value );
    });
  }

  changeCardStyle = (select: HTMLSelectElement, transaction: HTMLElement, selectValue: string) => {
    if (selectValue === 'approve') {
      transaction.classList.remove('border-success', 'border-danger');
      select.classList.add('d-none');
    } else if (selectValue === 'decline') {
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

    const membersWrapper: HTMLElement = wrapper.querySelector('.details__members');
    const notMembersWrapper: HTMLElement = wrapper.querySelector('.details__not-members');
    membersWrapper.innerHTML = '';
    notMembersWrapper.innerHTML = '';

    this.onGetTransInfo(transID, trans.groupID);
    const detailsSelectWrapper: HTMLElement = wrapper.querySelector('.details__state-wrap');
    const detailsSelect: HTMLSelectElement = wrapper.querySelector('.details__state');
    const options: NodeListOf<HTMLElement> = detailsSelect.querySelectorAll('option');
    options.forEach((opt: HTMLOptionElement) => {
      if (opt.value === selectValue) {
        opt.setAttribute('selected', '');
      }
      if (selectValue === 'approve') {
        detailsSelectWrapper.innerHTML = `${i18n._('Approved')}`;
      }
    });

    detailsSelect.addEventListener('change', () => {
      this.onChangeState(detailsSelect.value, transID);
      if (detailsSelect.value === 'approve') {
        detailsSelect.setAttribute('disabled', '');
      }
      const optInCardSelect = document.getElementById(transID).querySelector('.trans-item__state').querySelectorAll('option');
      const cardSelect: HTMLSelectElement = document.getElementById(transID).querySelector('.trans-item__state');
      const transaction: HTMLElement = document.getElementById(transID);
      optInCardSelect.forEach((opt: HTMLOptionElement) => {
        if (opt.value === detailsSelect.value) {
          opt.setAttribute('selected', '');
        } else {
          opt.removeAttribute('selected');
        }
        this.changeCardStyle(cardSelect, transaction, detailsSelect.value);
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
      setTimeout(() => {this.changeBalance(); }, 300);
    });

    const btnDelete = wrapper.querySelector('.details__delete');
    btnDelete.addEventListener('click', (e) => {
      e.preventDefault();
      const groupID = wrapper.querySelector('.details__group').getAttribute('groupID');
      this.detailsModal.hide();
      const transCard = document.getElementById(transID);
      transCard.remove();
      this.onDeleteTransaction(groupID, transID);
      this.changeBalance();
    });
  }

  changeBalance = () => {
    const groups: HTMLFormElement = document.querySelector('.trans-list__groups');
    const groupID = groups.value;
    if (groups.value === 'all-trans') {
      this.onRenderTotalBalance();
    } else {
      this.onRenderGroupBalance(groupID);
    }
  }

  addGroupTitle = (groupID: string, title: string) =>  {
    const modalWrapper: HTMLElement = document.querySelector('.details__wrapper');
    const titleElement: HTMLElement = modalWrapper.querySelector('.details__group');
    titleElement.setAttribute('groupID', groupID);
     titleElement.innerHTML = `
       <div class="col-5 col-sm-4">${i18n._('Group')}:</div>
       <div class="col-7 col-sm-8">${title}</div>
     `;
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
        state.innerHTML = `${i18n._('pending')}`;
      } else if (currUser[1].state === 'approve') {
        state.innerHTML = `<i class="material-icons text-success">done</i>`;
        member.querySelector('.details__member-delete').classList.add('invisible');
      } else if (currUser[1].state === 'decline') {
        state.innerHTML = `<i class="material-icons text-danger">minimize</i>`;
      }
      membersWrapper.append(member);

    } else {
      member.className = 'details__memb-wrapper details__memb--not-checked d-flex justify-content-start';
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
    const membDeleteBtn: HTMLButtonElement = member.querySelector('.details__member-delete');
    const membComment: HTMLFormElement = member.querySelector('.details__member-comment');
    const membState: HTMLElement = member.querySelector('.details__member-state');

    membInput.addEventListener('input', () => {
      if (+membInput.value >= 0 ) {
        membInput.classList.add('fixed');
        membInput.classList.remove('non-fixed');
        editSum(trans, modalWrapper, membInput);
      }
    });

    membDeleteBtn.addEventListener('click', () => {
      if (membDeleteBtn.innerText === 'clear') {
        notMembersWrapper.append(member);
        member.classList.add('details__memb--not-checked', 'justify-content-start');
        member.classList.remove('details__memb--checked', 'justify-content-between');
        membInput.value = '';
        membInput.classList.add('non-fixed', 'd-none');
        membInput.classList.remove('fixed');
        membComment.value = '';
        membComment.classList.add('d-none');
        membState.innerHTML = '';
        membState.classList.add('d-none');
        membDeleteBtn.innerHTML = '<i class="material-icons">add</i>';
        membDeleteBtn.classList.add('ms-3');
      } else {
        membersWrapper.append(member);
        member.classList.remove('details__memb--not-checked', 'justify-content-start');
        member.classList.add('details__memb--checked', 'justify-content-between');
        member.setAttribute('user-state', 'pending');
        membState.innerHTML = 'ожидание';
        membDeleteBtn.innerHTML = '<i class="material-icons">clear</i>';
        membState.classList.remove('d-none');
        membComment.classList.remove('d-none');
        membInput.classList.remove('d-none');
        membDeleteBtn.classList.remove('ms-3');
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

  getDataforEditTransaction = (transWrapper: HTMLElement) => {
    const newUsers: any[] = [];
    const newMembers = transWrapper.querySelectorAll('.details__memb--checked');
    newMembers.forEach((member: HTMLElement) => {
      const newUser: any = {};
      const membInput: HTMLInputElement = member.querySelector('.details__member-cost');
      const membComment: HTMLFormElement = member.querySelector('.details__member-comment');
      newUser.userID = member.getAttribute('user-id');
      newUser.cost = membInput.value;
      newUser.comment = membComment.value;
      newUser.state = member.getAttribute('user-state');
      if (membInput.classList.contains('fixed')) {
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
      if (groups.value === 'all-trans') {
        this.onRenderTotalBalance();
      } else {
        this.onRenderGroupBalance(groupID);
      }
      transList.forEach((transItem: HTMLElement) => {
        const itemGroupID = transItem.getAttribute('group-id');

        if (itemGroupID === groupID || groups.value === 'all-trans') {
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
