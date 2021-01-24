import { Page } from '../../Classes/Page';
import { IGroupData, IGroupDataAll } from '../../Interfaces/IGroupData';
import { getFormData } from '../../Util/getFormData';

import { Modal } from 'bootstrap';
import { eventForContactsList } from '../Contacts/eventForContactsList';
import { onClickContactInContactsList } from '../Contacts/onClickContactInContactsList';
import { stringify } from 'querystring';

const defaultGroupLogo = require('../../../assets/images/default-group-logo.png');
const defaultUserAvatar =  require('../../../assets/images/default-user-avatar.jpg');

export class MyGroups extends Page {
  onCreateNewGroup: any;
  deleteGroup: any;
  deleteMemberFromGroup: any;
  onAddMember: any;
  fillContactsList: any;
  onAddInfoForModalDetailGroup: any;
  addBalanceInGroupPage: any;
  addUserBalanceInModalCardUser: any;

  static create(el: string): MyGroups {
    const page = new MyGroups(el);
    page.addMembersGroup = page.addMembersGroup.bind(page);
    page.createGroupList = page.createGroupList.bind(page);
    return page;
  }

  render(): void {

    let html = `
      <div class="block__wrapper">
        <div class="block__content">
          <div class="block__header block__header--main">
            <p class="block__title">Groups</p>
          </div>
          <div class="block__main">
            <div id="contentGroup" class="container">
              <div id="divForListOpenGroups">
                <div class="card-body data-is-not">
                  <h5 class="card-title">No groups yet.</h5>
                  <p class="card-text">Would you like to create the first group?</p>
                </div>
              </div>
              <div class="accordion group-hidden" id="accordionForClosedGroup">
                <div class="accordion-item">
                  <h2 class="accordion-header" id="headingOne">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                      Closed Group
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
            <button type="button" class="btn btn-primary add-new-group" data-bs-toggle="modal" data-bs-target="#addNewGroupModal">New group</button>
          </div>
        </div>
      </div>
    `;

    html += this.modalGroupDetail();
    html += this.modalNewGroup();
    this.element.innerHTML = html;
    this.events();
  }

  createGroupList = (data: any) => {
    document.querySelector('.data-is-not').classList.add('group-hidden');

    const HTMLListOpenGroups = document.getElementById('divForListOpenGroups');
    const HTMLListClosedGroups = document.getElementById('divForListClosedGroups');

    if (!data.dataGroup.dateClose) {
      HTMLListOpenGroups.insertAdjacentHTML('afterbegin', this.createCard(data));
      this.eventsAddEventListenerForGroup(data);
    } else {
      document.querySelector('#accordionForClosedGroup').classList.remove('group-hidden');
      HTMLListClosedGroups.insertAdjacentHTML('afterbegin', this.createCard(data));
    }

    this.addBalanceInGroupPage(data.groupKey);
  }

  addUserInGroupCard(data: any) {
    const NUM_OF_IMG_IN_GROUP_CARD: number = 5;
    const listUsers = data.arrayUsers;

    const cardGroup: HTMLElement = document.getElementById(`${data.groupKey}`);
    const divForUserList: HTMLElement = cardGroup.querySelector('#userList');

    const participantsImg: string[] = [];
    listUsers.forEach((user: any) => {
      if (participantsImg.length < NUM_OF_IMG_IN_GROUP_CARD) {
        participantsImg.push(`<img class="card-group__img-avatar--mini" src="${user.avatar}" alt="icon">`);
      }
    });
    if (listUsers.length > NUM_OF_IMG_IN_GROUP_CARD) {
      participantsImg.push('+');
      participantsImg.push(String(listUsers.length - NUM_OF_IMG_IN_GROUP_CARD));
    }
    divForUserList.insertAdjacentHTML('afterbegin', participantsImg.join(''));
  }

  addBalanceInGroupCard(data: any) {
    const divCardGroup = document.querySelector(`#${data.groupId}`);
    const divForBalanceInCardGroup = divCardGroup.querySelector(`#balanceGroup`);

    const html = `<p>Balance ${data.balance} </p>`;
    divForBalanceInCardGroup.insertAdjacentHTML('afterbegin', html);
  }

  createCard(data: any) {
    const date: Date = new Date(data.dataGroup.dateCreate);
    const dataCreateGroup: string = date.toLocaleString();

    return `
      <div id=${data.groupKey} class="card mb-3 card-group">
        <div class="row g-0 col">
          <div class="col-3 card-group__box-logo-group">
            <img class="card-group__img-avatar" src="${data.dataGroup.icon ? data.dataGroup.icon : defaultGroupLogo}" alt="icon-group">
          </div>

          <div class="col-9 card-group__box-content">

            <div class="row col">
              <div class="col-7">
                <h5>${data.dataGroup.title}</h5>
              </div>
              <div class="col-5">
                <h5>${dataCreateGroup.slice(0, 10)}</h5>
              </div>
            </div>

            <div class="row col">
              <div id="userList" class="col-7">

              </div>
              <div id="balanceGroup" class="col-5">

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
            <h5 class="modal-title">Create New Group</h5>
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
                  <input type="text" class="form-control" id="formTitle" name="title" placeholder="Title*" required>
                  <div class="invalid-feedback">
                    Please input title.
                  </div>
                </div>

                <div>
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" id="currentGroup" checked>
                    <label class="form-check-label" for="currentGroup">Make the group current</label>
                  </div>
                </div>
              </div>

            </div>

              <div class="row ">
                <div class="dropdown col-10 modal-dropdown">
                  <input class="form-control dropdown-toggle" type="text" id="activeContact" data-bs-toggle="dropdown" aria-expanded="false" placeholder="Members" autocomplete="off" name="name">
                  <input type="text" name="key" class="contact-user-id" hidden>
                  <ul id="members-dropdown-menu" class="dropdown-menu contacts-user-list members-dropdown-menu" aria-labelledby="Group Members">
                  </ul>
                </div>

                <div class="col-2 modal-wrapper-btn">
                  <button type="button" class="btn btn-primary modal-btn-primary" id="addNewGroupMember"><span>add</span></button>
                </div>
              </div>

               <div class="row col-12 group-members-avatar"></div>

              <div class="col-12">
                <textarea class="form-control" id="formDesc" rows="3" name="description" placeholder="Description"></textarea>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" class="btn btn-primary" id="createGroupBtn">Create New Group</button>
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
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Group details</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div id="modalContent" class="modal-body">
              <p>Modal body text goes here.</p>
            </div>
            <div class="modal-footer">
              <button id="buttonSaveModal" type="button" class="btn btn-primary group-hidden">Save changes</button>
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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
    onClickContactInContactsList();

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
      this.onCreateNewGroup(groupDataAll);
      modalNewGroup.hide();
    };

    const addGroupMember = document.querySelector('#addNewGroupMember');
    addGroupMember.addEventListener('click', (ev) => {
      ev.preventDefault();
      // console.log('Add new Member');
      const member: HTMLFormElement = document.querySelector('.contact-user-id');
      // console.log('member.value', member.value);
      this.onAddMember(member.value);
    });
  }

  addInfoForModalDetailGroup(data: any) {
    const divModalContent =  document.getElementById('modalContent');
    const btnSaveModal = document.querySelector('#buttonSaveModal');

    const dateCreate: Date = new Date(data.dataGroup.dateCreate);
    const dataCreateGroup: string = dateCreate.toLocaleString();
    const dateClose: Date = new Date(data.dataGroup.dateClose);
    const dataCloseGroup: string = dateClose.toLocaleString();

    btnSaveModal.classList.add('group-hidden');

    divModalContent.innerHTML = `
      <div class="card mb-3 card-detail">
        <div class="row g-0 col">
          <div class="col-3 card-detail__box-logo-group">
            <img class="card-detail__img-avatar" src="${data.dataGroup.icon ? data.dataGroup.icon : defaultGroupLogo}" alt="icon-group">
          </div>
          <div class="col-6 card-detail__box-logo-group">
            <h5>${data.dataGroup.title}</h5>
            <p>Create date: ${ dataCreateGroup.slice(0, 10) }</p>
            <p>Close date:  ${ data.dataGroup.dateClose ? dataCloseGroup : 'group is active' }</p>
          </div>
          <div id="balanceModalGroup" class="col-3 card-detail__box-logo-group">
          <h5>Balance</h5>
        </div>
        </div>

        <div class="row g-0 col card-detail__box-description">
          <h5>Description</h5>
          <p class="card-text">${data.dataGroup.description ? data.dataGroup.description : 'No description...'}</p>
        </div>
        <div id="modalUserList" class="card-detail__user-list">
          <h5>Participants</h5>
        </div>


      </div>
    `;
  }

  addBalanceForModalGroupDetail(data: any) {
    const divForBalanceModalCard = document.querySelector('#balanceModalGroup');
    const html = `<h5>${data.balance}</h5>`;
    divForBalanceModalCard.insertAdjacentHTML('beforeend', html);
  }

   addModalUserData = (data: any) => {
    const userId = data.userId;
    const author = data.dataGroup.author;
    const divForUserList = document.getElementById('modalUserList');
    const btnSaveModal = document.querySelector('#buttonSaveModal');
    let htmlButtonDeleteUser = null;

    if (author === data.thisUid && userId !== author) {
      btnSaveModal.classList.remove('group-hidden');
      htmlButtonDeleteUser = `<button type="button" class="btn-close"  aria-label="Close"></button>`;
    }

    const html = `
      <div id="${data.user.account}" user-id-${data.userId} class="card modal-detail">
        <img class="modal-detail__img" src="${data.user.avatar}" alt="avatar">
        <div>
          <p  class="modal-detail__name">${data.user.name}</p>
          <p  class="modal-detail__account">${data.user.account}</p>
        </div>
        <div class="modal-detail__button">
          ${ htmlButtonDeleteUser ?  htmlButtonDeleteUser : ''}
        </div>
      </div>
    `;
    divForUserList.insertAdjacentHTML('beforeend', html);

    // выделение автора группы при прорисовке
    if (userId === author) {
      const cardAuthor = document.getElementById(`${data.user.account}`);
      cardAuthor.classList.add('modal-detail--author');
    }

    const dataForBalanceInModalCard = {
      userId: data.userId,
      groupId: data.groupId
    };
    this.addUserBalanceInModalCardUser(dataForBalanceInModalCard);
  }

  addUserBalanceInModalDetailGroup(data: any) {
    const divCardUser = document.querySelector(`[user-id-${data.userId}]`);


    const html = `
      <div class="modal-detail__balance">
        <span>${Math.round(data.balance * 100) / 100}</span>
      </div>
    `
    divCardUser.insertAdjacentHTML('beforeend', html);

    const divForBalance = divCardUser.querySelector('.modal-detail__balance')
    if(data.balance > 0) {
      divForBalance.classList.add('modal-detail__balance--positive')
    } else if(data.balance < 0) {
      divForBalance.classList.add('modal-detail__balance--negative')
    }
  }

  protected eventsAddEventListenerForGroup(data: any) {
    const divGroupDetail = document.getElementById('modalGroupDetail');
    const modalGroupDetail = new Modal(divGroupDetail);

    const keyGroup = data.groupKey;
    const divGroup = document.getElementById(`${data.groupKey}`);

    divGroup.addEventListener('click', () => {
      this.onAddInfoForModalDetailGroup(keyGroup);
      modalGroupDetail.show();
    });
  }

  deleteMemberGroup(data: any): void {

  }

  addMembersGroup(data: any): void {
    if (data) {
      const members = document.querySelector('.group-members-avatar');
      members.insertAdjacentHTML('beforeend', `
    <div class="col-3 col-sm-2 member" data-id="${data.key}">
      <div class="member__avatar text-center">
        <img class="member__img" src="${data.avatar}" alt="${data.name}">
      </div>
      <div class="member__name text-center">${data.name}</div>
    </div>
    `);
      const input: HTMLFormElement = document.querySelector('#activeContact');
      input.value = '';
    }
  }
}