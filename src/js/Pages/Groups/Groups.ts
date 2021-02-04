import { Page } from '../../Classes/Page';
import { IGroupData, IGroupDataAll } from '../../Interfaces/IGroupData';
import { getFormData } from '../../Util/getFormData';
import { ChartBar } from '../../Classes/ChartBar';

import { Modal } from 'bootstrap';
import { eventForContactsList } from '../Contacts/eventForContactsList';
import { onClickContactInContactsList } from '../Contacts/onClickContactInContactsList';
import { i18n } from '@lingui/core';

const defaultGroupLogo = require('../../../assets/images/default-group-logo.png');

export class Groups extends Page {
  onCreateNewGroup: any;
  closeGroup: any;
  clearCurrentGroup: any;
  onAddMember: any;
  addMemberInDetailGroup: any;
  fillContactsList: any;
  onAddInfoForModalDetailGroup: any;
  addBalanceInGroupPage: any;
  addUserBalanceInModalCardUser: any;
  getUserBalanceInGroup: any;
  changeUserStatusInGroup: any;


  static create(el: string): Groups {
    const page = new Groups(el);
    page.addMembersGroup = page.addMembersGroup.bind(page);
    page.createGroupList = page.createGroupList.bind(page);
    return page;
  }

  render(): void {

    let html = `
      <div class="block__wrapper">
        <div class="block__content">
          <div class="block__header block__header--main">
            <p class="block__title">${i18n._('Groups')}</p>
          </div>
          <div class="block__main">
            <div id="contentGroup" class="container container-group">
              <div id="divForListOpenGroups" class="block--width-85 accordion-main">
                <div class="card-body data-is-not">
                  <h5 class="card-title">${i18n._('No groups')}</h5>
                  <p class="card-text">${i18n._('Would')}</p>
                </div>
              </div>
              <div class="accordion accordion-main group-hidden block--width-85" id="accordionForClosedGroup">
                <div class="accordion-item">
                  <h2 class="accordion-header" id="headingOne">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                      ${i18n._('Closed Group')}
                    </button>
                  </h2>
                  <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionForClosedGroup">
                    <div id="divForListClosedGroups" class="accordion-body">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="block__footer">
            <button type="button" class="btn btn-primary btn-primary-alternate add-new-group" data-bs-toggle="modal" data-bs-target="#addNewGroupModal">${i18n._('New group')}</button>
          </div>
        </div>
      </div>
    `;

    html += this.modalGroupDetail();
    html += this.modalNewGroup();
    this.element.innerHTML = html;
    this.events();
  }

  renderChart() {
    const chart: any = ChartBar.create('.modal-chart');
    return chart.buildingChart;
  }

  createGroupList = (data: any) => {
    document.querySelector('.data-is-not').classList.add('group-hidden');

    const HTMLListOpenGroups = document.getElementById('divForListOpenGroups');
    const HTMLListClosedGroups = document.getElementById('divForListClosedGroups');

    if (!data.dataGroup.dateClose) {
      HTMLListOpenGroups.insertAdjacentHTML('afterbegin', this.createCard(data));
      this.eventsAddEventListenerForGroup(data);
      this.addBalanceInGroupPage(data.groupKey, data.thisUid);
    } else {
      document.querySelector('#accordionForClosedGroup').classList.remove('group-hidden');
      HTMLListClosedGroups.insertAdjacentHTML('afterbegin', this.createCard(data));
    }
  }

  addUserInGroupCard(data: any) {
    const usersListObj = data.dataGroup.userList;
    const thisUid = data.thisUid;

    if (usersListObj[thisUid].state === 'pending') {
      const cardGroup = document.querySelector(`#${data.groupKey}`);
      cardGroup.classList.add('card-group--new-group');
    }

    const arrayUsers = data.arrayUsers;
    arrayUsers.forEach((userObj: any) => {
      if (userObj.userId === thisUid &&
        userObj.currentGroup === data.groupKey) {
          const divCurrentGroup = document.querySelector(`#${data.groupKey}`);
          divCurrentGroup.classList.add('card-group__box-content--current');
      }
    });

    const NUM_OF_IMG_IN_GROUP_CARD: number = 5;
    const listUsers = data.arrayUsers;

    const cardGroup: HTMLElement = document.getElementById(`${data.groupKey}`);
    const divForUserList: HTMLElement = cardGroup.querySelector('#userList');

    let countApproveUsers: number = 0;
    const participantsImg: string[] = [];

    listUsers.forEach((user: any) => {
      const stateUser = user.groupList[data.groupKey].state;
      if (stateUser === 'approve') {

        if (countApproveUsers < NUM_OF_IMG_IN_GROUP_CARD) {
          participantsImg.push(`<img class="card-group__img-avatar--mini" src="${user.avatar}" alt="icon">`);
        }
        countApproveUsers += 1;
      }
    });

    if (countApproveUsers > NUM_OF_IMG_IN_GROUP_CARD) {
      participantsImg.push('+');
      participantsImg.push(String(countApproveUsers - NUM_OF_IMG_IN_GROUP_CARD));
    }

    divForUserList.insertAdjacentHTML('afterbegin', participantsImg.join(''));
  }

  addBalanceInGroupCard(data: any) {
    const divCardGroup = document.querySelector(`#${data.groupId}`);
    const divForBalanceInCardGroup = divCardGroup.querySelector(`#balanceGroup`);

    const html = `<h5 class="card-group__date"">${data.balance.toFixed(2)} ${data.currencyName}</h5>`;
    divForBalanceInCardGroup.insertAdjacentHTML('afterbegin', html);
  }

  createCard(data: any) {
    const dateCreate: Date = new Date(data.dataGroup.dateCreate);
    const dataCreateGroup: string = dateCreate.toLocaleString();
    let dataCloseGroup: string | null = null;

    if (data.dataGroup.dateClose) {
      const dateClose: Date = new Date(data.dataGroup.dateClose);
      dataCloseGroup = dateClose.toLocaleString();
    }

    return `
      <div id=${data.groupKey} class="card mb-3 card-group block--width-85-md">
        <div class="row g-0 col">
          <div class="col-3 card-group__box-logo-group">
            <img class="card-group__img-avatar" src="${data.dataGroup.icon ? data.dataGroup.icon : defaultGroupLogo}" alt="icon-group">
          </div>

          <div class="col-9 card-group__box-content">

            <div class="row col">
              <div class="col-7">
                <h5 class="card-group__title">${data.dataGroup.title}</h5>
              </div>
              <div class="col-5">
                <h5 class="card-group__date">${dataCreateGroup.slice(0, 10)}</h5>
              </div>
            </div>

            <div class="row col">
              <div id="userList" class="col-7">

              </div>
              <div id="balanceGroup" class="col-5 card-group__balance">
                <h5  class="card-group__date">${dataCloseGroup ? dataCloseGroup.slice(0, 10) : ''}</h5>
              </div>
            </div>

          </div>

        </div>
      </div>
    `;
  }

  modalNewGroup() {
    return `
    <div class="modal fade" id="addNewGroupModal" tabindex="-1">
      <div class="modal-dialog modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${i18n._('Create New Group')}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form class="form-floating row g-3 form-group" id="newGroupForm">

            <div class="row modal-top d-flex justify-content-between">

              <div class="col-3">
                <div class="block__common-image-wrapper">
                  <div class="block__image-wrapper">
                    <img src="${defaultGroupLogo}" alt="logoGroup" class="block__image">
                  </div>
                  <div class="block__form-change-photo form-group">
                    <label for="file" class="block__button-change-photo">
                      <i class="material-icons">add_a_photo</i>
                    </label>
                    <input type="file" id="inputImg" name="logoGroup" class="block__form-change-photo input-logo-group">
                  </div>
                </div>
              </div>

              <div class="col-9 form-title">
                <div>
                  <input type="text" class="form-control" id="formTitle" name="title" autocomplete="off" placeholder="${i18n._('Title*')}" required>
                  <div class="invalid-feedback">
                    ${i18n._('Please input title')}
                  </div>
                </div>

                <div>
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" id="currentGroup" checked>
                    <label class="form-check-label" for="currentGroup">${i18n._('Make the group current')}</label>
                  </div>
                </div>
              </div>

            </div>

              <div class="row ">
                <div class="dropdown col-8 col-sm-9 modal-dropdown">
                  <input class="form-control dropdown-toggle" type="text" id="activeContact" data-bs-toggle="dropdown" aria-expanded="false" placeholder="${i18n._('Members')}" autocomplete="off" name="name">
                  <input type="text" name="key" class="contact-user-id" hidden>
                  <ul id="members-dropdown-menu" class="dropdown-menu contacts-user-list members-dropdown-menu" aria-labelledby="${i18n._('Group Members')}">
                  </ul>
                </div>

                <div class="col-4 col-sm-3 modal-wrapper-btn">
                  <button type="button" class="btn btn-primary modal-btn-primary btn-primary-alternate" id="addNewGroupMember"><span>${i18n._('Add')}</span></button>
                </div>
              </div>

               <div class="row col-12 group-members-avatar"></div>

              <div class="col-12">
                <textarea class="form-control" id="formDesc" rows="3" name="description" placeholder="${i18n._('Description')}"></textarea>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${i18n._('Close')}</button>
                <button type="submit" class="btn btn-primary btn-primary-alternate" id="createGroupBtn">${i18n._('Create New Group')}</button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
    `;
  }

  modalGroupDetail() {
    return `
      <div class="modal" id="modalGroupDetail" tabindex="-1" role="dialog">
        <div class="modal-dialog container-group-detail" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${i18n._('Group details')}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div class="row g-0 col modal-wrapper-content">
              <div class="col-12 col-md-6">
                <div id="modalContent" class="modal-body">
                  <p>Modal body text goes here.</p>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="modal-chart">
                </div>
              </div>
            </div>

            <div class="modal-footer">
            <button type="button" class="btn btn-primary btn-primary-alternate" data-bs-dismiss="modal">${i18n._('Close')}</button>
          </div>
          </div>
        </div>
      </div>
    `;
  }

  protected events(): void {
    const modalNewGroup = new Modal(document.getElementById('addNewGroupModal'));

    const btnAddNewGroup = document.querySelector('.add-new-group');
    btnAddNewGroup.addEventListener('click', () => {

      document.querySelector('.contacts-user-list').innerHTML = '';
      this.fillContactsList();
      modalNewGroup.show();
    });

    // Auto-filter contacts in member group list
    const formMembers: HTMLInputElement = document.querySelector('#activeContact');
    eventForContactsList(formMembers);
    // Add user contact to Member input
    onClickContactInContactsList('.contacts-user-list');

    // Set focus in Input when modal is open
    const myModal = document.getElementById('addNewGroupModal');
    const myInput = document.getElementById('formTitle');
    myModal.addEventListener('shown.bs.modal', function() {
      myInput.focus();
    });

    const { newGroupForm }: any = document.forms;
    const form: HTMLFormElement = newGroupForm;

    const formPhoto: HTMLFormElement = this.element.querySelector('.form-group');
    const inputPhoto: HTMLInputElement = this.element.querySelector('#inputImg');

    let logoGroupImgData: any = null;
    inputPhoto.addEventListener('change', (): void => {
      if (inputPhoto.files[0]) {
        logoGroupImgData = getFormData(
          formPhoto,
          this.element.querySelector('.block__image'),
        );
      }
    });

    form.onsubmit = (event) => {

      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
      event.preventDefault();

      const title: string = (<HTMLInputElement>document.getElementById('formTitle')).value;
      const description: string = (<HTMLInputElement>document.getElementById('formDesc')).value;
      const members: NodeListOf<HTMLElement> = document.querySelectorAll('.member');
      const users: string[] = [];
      const currentGroup: boolean = (<HTMLInputElement>document.getElementById('currentGroup')).checked;

      members.forEach(member => {
        users.push(member.getAttribute('data-id'));
      });

      const groupData: IGroupData = {
        title,
        description,
        dateCreate: Date.now(),
        dateClose: null,
        transactionList: [],
        icon: logoGroupImgData ? logoGroupImgData.logoGroup : '',
      };

      const groupDataAll: IGroupDataAll = {
        groupData: groupData,
        userList: users,
        currentGroup: currentGroup
      };

      const oldCurrentGroup = document.querySelector('.card-group__box-content--current');
      if (oldCurrentGroup && currentGroup) oldCurrentGroup.classList.remove('card-group__box-content--current');

      this.onCreateNewGroup(groupDataAll);
      modalNewGroup.hide();
    };

    const addGroupMember = document.querySelector('#addNewGroupMember');
    addGroupMember.addEventListener('click', (ev) => {
      ev.preventDefault();
      const member: HTMLFormElement = document.querySelector('.contact-user-id');
      this.onAddMember(member.value);
    });
  }

  addInfoForModalDetailGroup(data: any) {
    const divModalContent =  document.getElementById('modalContent');

    const dateCreate: Date = new Date(data.dataGroup.dateCreate);
    const dataCreateGroup: string = dateCreate.toLocaleString();
    const dateClose: Date = new Date(data.dataGroup.dateClose);
    const dataCloseGroup: string = dateClose.toLocaleString();

    divModalContent.innerHTML = `
      <div class="card mb-3 card-detail">
        <div class="row g-0 col">
          <div class="col-3 card-detail__box-logo-group">
            <img class="card-detail__img-avatar" src="${data.dataGroup.icon ? data.dataGroup.icon : defaultGroupLogo}" alt="icon-group">
          </div>
          <div class="col-6 card-detail__box-logo-group">
            <h5 class="card-detail__title">${data.dataGroup.title}</h5>
            <p class="card-detail__date">${i18n._('Create date')}: ${ dataCreateGroup.slice(0, 10) }</p>
            <p class="card-detail__date">${i18n._('Close date')}: ${ data.dataGroup.dateClose ? dataCloseGroup : i18n._('group is active')}</p>
          </div>
          <div id="balanceModalGroup" class="col-3 card-detail__box-logo-group">
          <h5 class="card-detail__balance">${i18n._('Balance')}</h5>
        </div>
        </div>

        <div class="row g-0 col card-detail__box-description">
          <h5 class="card-detail__description">${i18n._('Description')}</h5>
          <p class="card-text card-detail__text">${data.dataGroup.description ? data.dataGroup.description : i18n._('No description')}</p>
        </div>
        <div id="modalUserListApprove" class="card-detail__user-list">
          <h5 class="card-detail__participants">${i18n._('Participants')}</h5>
        </div>
        <div id="modalUserListPending" class="card-detail__user-list group-hidden">
          <p class="card-detail__pending">Pending</p>
        </div>
      </div>
    `;
  }

  addBalanceForModalGroupDetail(data: any) {
    const divForBalanceModalCard = document.querySelector('#balanceModalGroup');
    const html = `<h5>${data.balance.toFixed(2)} ${data.currencyName}</h5>`;
    divForBalanceModalCard.insertAdjacentHTML('beforeend', html);
  }

  addModalUserData = (data: any) => {
    const thisUser = data.thisUid;
    const userId = data.userId;
    const author = data.dataGroup.author;
    const stateUser = data.user.groupList[data.groupId].state;
    const divForUserListApprove = document.getElementById('modalUserListApprove');
    const divForUserListPending = document.getElementById('modalUserListPending');
    const divModalContent = document.getElementById('modalContent');
    const dataForBalanceInModalCard = {
      groupId: data.groupId,
      userId: data.userId,
      thisUid: data.thisUid
    };
    let isBtmForDeleteUser = false;

    if (author !== thisUser) {
      this._clearCloseGroupBtn();
    }

    const addEventListenerFromButtonDelUserInModal = (data: any) => {
      if (author === thisUser && userId !== author) {
        this._addEventListenerFromButtonDelUser(data);
      }
    };

    if (author === thisUser && userId !== author) {
      isBtmForDeleteUser = true;
    }
    const html = this._createUserCardForModalDetail(data, isBtmForDeleteUser);

    const htmlBtn = `
    <div class="modal-detail__button-container">
      <button id="btn-prove" type="button" class="btn btn-primary-alternate modal-detail__button-confirmation">Prove</button>
      <button id="btn-disprove" type="button" class="btn btn-secondary modal-detail__button-confirmation">Disprove</button>
    </div>
    `;

    if (stateUser === 'approve') {
      divForUserListApprove.insertAdjacentHTML('beforeend', html);
      addEventListenerFromButtonDelUserInModal(data);
      this.addUserBalanceInModalCardUser(dataForBalanceInModalCard);
    } else if (stateUser === 'pending') {
      divForUserListPending.classList.remove('group-hidden');
      divForUserListPending.insertAdjacentHTML('beforeend', html);
      addEventListenerFromButtonDelUserInModal(data);
    }

    // Add author special
    if (userId === author) {
      const cardAuthor = document.querySelector(`[data-user-id-for-group="${userId}"]`);
      cardAuthor.classList.add('modal-detail--author');
    }

    // Add user card btn prove or disprove
    if (stateUser ===  'pending' &&  userId === thisUser) {
      const cardThisUser = document.querySelector(`[data-user-id-for-group="${userId}"]`);
      cardThisUser.insertAdjacentHTML('beforeend', htmlBtn);

      const btnProve = document.querySelector('#btn-prove');
      const btnDisprove = document.querySelector('#btn-disprove');

      btnProve.addEventListener('click', () => {
        this.addUserToGroup(data);
      });

      btnDisprove.addEventListener('click', () => {
        this.deleteUserToGroup(data);
      });
    }

    if (author === thisUser && !document.querySelector('#addUserInGroupDetail')) {
      this._addCloseGroupBtn(data);

      const htmlAddMember = `
        <div id="addUserInGroupDetail" class="row ">
          <div class="dropdown col-12 modal-dropdown">
            <input class="form-control dropdown-toggle modal-input" type="text" id="activeContact" data-bs-toggle="dropdown" aria-expanded="false" placeholder="Members" autocomplete="off" name="name">
            <ul id="members-dropdown-menu" class="dropdown-menu contacts-user-list-detail members-dropdown-menu" aria-labelledby="Group Members">
            </ul>
            <button type="button" class="btn btn-primary btn-primary-alternate modal-btn-primary" id="addNewGroupMemberInDetail"><span>${i18n._('Add')}</span></button>
          </div>

          <div class="col modal-error-text text-danger">
          </div>

        </div>
      `;
      divModalContent.insertAdjacentHTML('beforeend', htmlAddMember);

      document.querySelector('.contacts-user-list-detail').innerHTML = '';
      this.fillContactsList('.contacts-user-list-detail');


      // Auto-filter contacts in member group list
      const formMembers: HTMLInputElement = document.querySelector('#activeContact');
      eventForContactsList(formMembers);

      onClickContactInContactsList('.contacts-user-list-detail');

      const addGroupMember = document.querySelector('#addNewGroupMemberInDetail');
      addGroupMember.addEventListener('click', (ev) => {
        document.querySelector('.modal-error-text').innerHTML = '';

        ev.preventDefault();
        const member: HTMLFormElement = document.querySelector('#activeContact');

        // Check input
        let userAccount = null;
        const myRe = /@.+$/gm;

        try {
          userAccount = myRe.exec(member.value)[0].slice(1);
          if (userAccount.slice(-1) === '>') {
            userAccount =  userAccount.slice(0, -1);
          }
        } catch {
          const textError = `${i18n._('The user account was entered incorrectly, for example: @account')}`;
          this.addTextInHtmlBlock('.modal-error-text', textError);
        }

        if (userAccount) {
          const dataForAddMember = {
            account: userAccount,
            groupId: data.groupId
          };
          this.addMemberInDetailGroup(dataForAddMember);
        }

        document.getElementById('activeContact').value = '';
      });
    }
  }

  addTextInHtmlBlock(selector: string, text: string) {
    const div = document.querySelector(selector);
    const html = `<p>${text}</p>`;
    div.insertAdjacentHTML('beforeend', html);
  }

  addNewUserInDetailGroup = (data: any, errorData: string) => {
    if (errorData) {
      if (errorData === 'User is missing') {
        const error = `${i18n._('User is missing')}`;
        this.addTextInHtmlBlock('.modal-error-text', error);
      } else if (errorData === 'The user is in the group') {
        const error = `${i18n._('The user is in the group')}`;
        this.addTextInHtmlBlock('.modal-error-text', error);
      }

    } else {
      document.querySelector('#modalUserListPending').classList.remove('group-hidden');

      const divForUserListPending = document.getElementById('modalUserListPending');
      const html = this._createUserCardForModalDetail(data, true);

      divForUserListPending.insertAdjacentHTML('beforeend', html);
      this._addEventListenerFromButtonDelUser(data);
    }
  }

  _addEventListenerFromButtonDelUser(data: any) {
    const buttonDeleteUser = document.querySelector(`[data-id-user="${data.userId}"]`);

    buttonDeleteUser.addEventListener('click', (e) => {

      const userId = e['toElement']['attributes']['data-id-user']['value'];
      const groupId = e['toElement']['attributes']['data-id-group']['value'];

      const data = {
        userId: userId,
        groupId: groupId
      };

      this.getUserBalanceInGroup(data);
    });
  }

  _createUserCardForModalDetail(data: any, isBtn: boolean = false) {
    const htmlButtonDeleteUser = `<button type="button" class="btn-close" data-id-user="${data.userId}" data-id-group="${data.groupId}" aria-label="Close"></button>`;

    return `
        <div data-user-id-for-group=${data.userId} class="card modal-detail">

          <div class="modal-detail__wrapper">
            <div class="modal-detail__img-name">
              <div>
                <img class="modal-detail__img" src="${data.user.avatar}" alt="avatar">
              </div>
              <div class="modal-detail__name-account">
                <p  class="modal-detail__name">${data.user.name}</p>
                <p  class="modal-detail__account">${data.user.account}</p>
              </div>
            </div>
          </div>

          <div>
            <div class="modal-detail__button">
              ${isBtn ? htmlButtonDeleteUser : ''}
            </div>
          </div>

        </div>
      `;
  }

  _clearCloseGroupBtn = (): void => {
    const closeGroupBtn = document.querySelector('#closeGroupBtn');
    if (closeGroupBtn) {
      closeGroupBtn.remove();
    }
  }

  answerDataBaseForClosedGroup = (isSuccess: boolean, selector: null | string = null) => {
    if (isSuccess) {
      document.querySelector('.btn-close').click();
      document.querySelector(`#${selector}`).remove();

    } else {
      const error = 'Balance is not zero - you do not close group';
      this.addTextInHtmlBlock('.modal-error-text', error);
    }
  }

  _addCloseGroupBtn(data: any) {
    this._clearCloseGroupBtn();
    const groupId = data.groupId;

    const divFooterModal = document.querySelector('.modal-footer');
    const htmlBtnCloseGroup = `
    <div class="">
      <button id="closeGroupBtn" type="button" class="btn btn-secondary">${i18n._('Close group')}</button>
    </div>
    `;
    divFooterModal.insertAdjacentHTML('afterbegin', htmlBtnCloseGroup);

    const closeGroupBtn = document.querySelector('#closeGroupBtn');
    closeGroupBtn.addEventListener('click', () => {
      document.querySelector('.modal-error-text').innerHTML = '';
      const userList = Object.keys(data.dataGroup.userList);

      const dataForCloseGroup = {
        userList: userList,
        groupId: groupId,
        currentGroup: data.user.currentGroup
      };
      this.closeGroup(dataForCloseGroup);
      this.clearCurrentGroup(data.thisUid, data.groupId);
    });
  }

  private addUserToGroup(data: any) {
    const thisUid = data.thisUid;
    const divUserCard = document.querySelector(`[data-user-id-for-group="${thisUid}"]`);
    const divApproveUser = document.querySelector('#modalUserListApprove');

    const userAvatar = divUserCard.querySelector('img');
    const userName = divUserCard.querySelector('.modal-detail__name');
    const userAccount = divUserCard.querySelector('.modal-detail__account');

    const html = `
      <div class="card modal-detail">
        ${userAvatar.outerHTML}
        <div>
          ${userName.outerHTML}
          ${userAccount.outerHTML}
        </div>
      </div>
    `;
    const dataForChangeUserStatus = {
      userId: thisUid,
      groupId: data.groupId,
      state: 'approve'

    };
    this.changeUserStatusInGroup(dataForChangeUserStatus);

    divUserCard.remove();
    divApproveUser.insertAdjacentHTML('beforeend', html);
  }

  private deleteUserToGroup(data: any) {
    const thisUid = data.thisUid;
    const groupId = data.groupId;
    const divUserCard = document.querySelector(`[data-user-id-for-group="${thisUid}"]`);
    const divCardGroup = document.querySelector(`#${groupId}`);

    const dataForChangeUserStatus = {
      userId: thisUid,
      groupId: groupId,
      state: 'decline'
    };
    this.changeUserStatusInGroup(dataForChangeUserStatus);
    divCardGroup.classList.add('group-hidden');
    divUserCard.remove();
  }

  deleteUserFromGroup = (data: any) => {
    if (data.balance === 0) {
      const dataForChangeUserStatus = {
        userId: data.userId,
        groupId: data.groupId,
        state: 'decline'
      };
      this.changeUserStatusInGroup(dataForChangeUserStatus);

      const divUserCard = document.querySelector(`[data-user-id-for-group="${data.userId}"]`);
      divUserCard.remove();

      const divForPending = document.querySelector('#modalUserListPending');
      if (!divForPending.querySelector('.modal-detail')) {
        divForPending.classList.add('group-hidden');
      }
    } else {
      const errorData = 'The user\'s balance must be zero';
      this.addTextInHtmlBlock('.modal-error-text', errorData);
    }
  }

  addUserBalanceInModalDetailGroup(data: any) {
    const divCardUser = document.querySelector(`[data-user-id-for-group="${data.userId}"]`);
    const divForBtb = divCardUser.querySelector('.modal-detail__wrapper');

    const html = `
      <div class="modal-detail__balance">
        <span>${data.balance.toFixed(2)} ${data.currency}</span>
      </div>
    `;
    divForBtb.insertAdjacentHTML('beforeend', html);

    const divForBalance = divCardUser.querySelector('.modal-detail__balance');
    if (data.balance > 0) {
      divForBalance.classList.add('text-success');
    } else if (data.balance < 0) {
      divForBalance.classList.add('text-danger');
    }
  }

  protected eventsAddEventListenerForGroup(data: any) {
    const divGroupDetail = document.getElementById('modalGroupDetail');
    const modalGroupDetail = new Modal(divGroupDetail);

    const keyGroup = data.groupKey;
    const divGroup = document.getElementById(`${data.groupKey}`);

    divGroup.addEventListener('click', () => {
      this.onAddInfoForModalDetailGroup(keyGroup, data.thisUid);
      modalGroupDetail.show();
    });
  }

  addMembersGroup(data: any): void {
    if (data) {
      const members = document.querySelector('.group-members-avatar');

      const html = `
        <div class="col-3 col-sm-2 member" data-id="${data.key}">
          <div class="member__avatar text-center">
            <img class="member__img" src="${data.avatar}" alt="${data.name}">
          </div>
          <div class="member__name text-center">${data.name}</div>
        </div>
      `;
      members.insertAdjacentHTML('beforeend', html);
      const input: HTMLFormElement = document.querySelector('#activeContact');
      input.value = '';
    }
  }
}
