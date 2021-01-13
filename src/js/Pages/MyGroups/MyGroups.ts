import { Page } from '../../Classes/Page';
import { IGroupData } from '../../Interfaces/IGroupData';
import { getFormData } from  '../../Util/getFormData';

import { Modal } from 'bootstrap';
// const DEFAULT_LOGO_IMG_GROUP = 'data:image/png;base64,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';
const defaultGroupLogo = require('../../../assets/images/default-group-logo.png') //'../../../assets/images/default-group-logo.png';

export class MyGroups extends Page {
  onCreateNewGroup: any;
  onAddMember: any;

  static create(el: string): MyGroups {
    const page = new MyGroups(el);
    page.addMembersGroup = page.addMembersGroup.bind(page);
    page.createGroupList = page.createGroupList.bind(page);
    return page;
  }

  render(): void {

    let html = `
      <div class="block__wrapper d-flex align-items-center flex-column">
        <div class="block__content d-flex align-items-center flex-column w-100">
          <div id="contentGroup" class="container">
            <div class="row justify-content-between block__title">
              <div class="col-6">
                <h2>Groups</h2>
              </div>
            </div>

            <div id="divForListOpenGroups">
              <div class="card-body data-is-not">
                <h5 class="card-title">No groups yet.</h5>
                <p class="card-text">Would you like to create the first group?</p>
              </div>
            </div>

            <div class="accordion closed-group-hidden" id="accordionExample">
              <div class="accordion-item">
                <h2 class="accordion-header" id="headingOne">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                    Closed Group
                  </button>
                </h2>
                <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                  <div id="divForListClosedGroups" class="accordion-body">

                  </div>
                </div>
              </div>
            </div>
    `;

    html += `
    <button type="button" class="btn btn-success add-new-group" data-bs-toggle="modal" data-bs-target="#addNewGroupModal">
      <i class="material-icons add-new-group__icon">add</i>
    </button>
    `;

    html += `</div></div></div>`;

    html += this.modal();
    this.element.innerHTML = html;
    this.events();
  }

  createGroupList = (data: any) => {
    document.querySelector('.data-is-not').classList.add('closed-group-hidden');

    const HTMLListOpenGroups = document.getElementById('divForListOpenGroups');
    const HTMLListClosedGroups = document.getElementById('divForListClosedGroups');


    if (!data.dataGroup.dateClose) {
      HTMLListOpenGroups.insertAdjacentHTML('afterbegin', this.createCard(data));
    } else {
      HTMLListClosedGroups.insertAdjacentHTML('afterbegin', this.createCard(data));
    }
  }

  createCard(data: any, balanceGroup: number | null = null) {
    const NUM_OF_IMG_IN_GROUP_CARD: number = 3;
    const date: Date = new Date(data.dataGroup.dateCreate);
    const dataCreateGroup: string = date.toLocaleString();
    const listUsers = data.arrayUsers;

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

    const groupCard = `
      <div class="card mb-3 card-group">
        <div class="row g-0 col">
          <div class="col-3 card-group__box-logo-group">
            <img class="card-group__img-avatar" src="${data.dataGroup.style.icon ? data.dataGroup.style.icon: defaultGroupLogo}" alt="icon-group">
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
              <div class="col-7">
                ${participantsImg.join('')}
              </div>
              <div class="col-5">
                ${balanceGroup}
              </div>
            </div>

          </div>

        </div>
      </div>
    `;

    return groupCard;
  }

  modal() {
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

            <div class="row modal-top">

              <div class="col-3">
                <div class="block__image-wrapper position-relative">
                  <img src="${defaultGroupLogo}" alt="logoGroup" class="block__image position-absolute top-50 start-50 translate-middle">
                  <div class="form-group-test">
                    <label class="account__form-change-photo justify-content-center align-items-center" for="exampleFormControlFile1">
                      <i class="material-icons position-material-icons">add_a_photo</i>
                    </label>
                    <input type="file" class="account__form-change-photo justify-content-center align-items-center transparent" id="inputImg" name="logoGroup">
                  </div>
                </div>
              </div>


              <div class="form-floating col-9 d-flex align-items-center  modal-top__input-title">
                <input type="text" class="form-control" id="formTitle" name="title" placeholder="Title" required>
                <label for="formTitle" class="form-label">Title*</label>
                <div class="invalid-feedback">
                  Please input title.
                </div>
              </div>

            </div>



              <div class="<!--form-floating--> col-12">
                <textarea class="form-control" id="formDesc" rows="3" name="description" placeholder="Description"></textarea>
<!--                <label for="formDesc-" class="form-label">Description</label>-->
              </div>
              <div class="input-group col-12">
                <span class="input-group-text" id="basic-addon1">@</span>
                <input type="text" class="form-control" id="formMembers" placeholder="Members" aria-label="Username" aria-describedby="basic-addon1">
<!--                <label for="formMembers">Members</label>-->
                <button type="button" class="btn btn-primary" id="addNewGroupMember"><span class="material-icons">person_search</span></button>
              </div>
               <div class="col-12 group-members-avatar"></div>
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

  protected events(): void {
    const modal = new Modal(document.getElementById('addNewGroupModal'));

    const btnAddNewGroup = document.querySelector('.add-new-group');
    btnAddNewGroup.addEventListener('click', () => {
      modal.show();
    });

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

    let logoGroupImgData: any = null
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


      members.forEach(member => {
        users.push(member.getAttribute('data-id'));
      });

      const groupData: IGroupData = {
        title,
        description,
        dateCreate: Date.now(),
        dateClose: null,
        userList: users,
        transactionList: [],
        style: {'icon': logoGroupImgData ? logoGroupImgData.logoGroup: ''},
      };
      this.onCreateNewGroup(groupData);
      modal.hide();
    };

    const addGroupMember = document.querySelector('#addNewGroupMember');
    addGroupMember.addEventListener('click', (ev) => {
      ev.preventDefault();
      console.log('Add new Member');
      const member: HTMLFormElement = document.querySelector('#formMembers');
      this.onAddMember(member.value);
    });
  }

  addMembersGroup(data: any): void {
    console.log('addMembersGroup - data:', data);
    if (data) {
      const members = document.querySelector('.group-members-avatar');
      members.insertAdjacentHTML('beforeend', `
    <div class="member" data-id="${data.key}">
      <div class="member__avatar">
        <img src="${data.avatar}" alt="${data.name}">
      </div>
      <div class="member__name">${data.name}</div>
    </div>
    `);
      const input: HTMLFormElement = document.querySelector('#formMembers');
      input.value = '';
    }
  }
}


/// FOR BALANSE

/* let balanceGroup: string = '';
if (element.balance < 0) {
  balanceGroup = `
    <h5 class="card-group__balance">
      ${element.balance ? element.currency : ''}<span class="card-group__balance--negative">${element.balance ? element.balance : formatDate(element.dateCreate)}</span>
    </h5>
  `;
} else if (element.balance >= 0) {
  balanceGroup = `
    <h5 class="card-group__balance">
      ${element.balance ? element.currency : ''}<span class="card-group__balance--positive">${element.balance ? element.balance : formatDate(element.dateCreate)}</span>
    </h5>
  `;
} */