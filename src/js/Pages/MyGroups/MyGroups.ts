import { Page } from '../../Classes/Page';
import { IGroupData } from '../../Interfaces/IGroupData';
import { getFormData } from '../../Util/getFormData';

import { Modal } from 'bootstrap';

export class MyGroups extends Page {
  onCreateNewGroup: any;
  onAddMember: any;

  static create(el: string): MyGroups {
    const page = new MyGroups(el);
    page.addMembersGroup = page.addMembersGroup.bind(page);
    page.addGroupToList = page.addGroupToList.bind(page);
    return page;
  }


  render(): void {

    let html = `
      <div id="contentGroup" class="container">
        <div class="row justify-content-between">
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

    html += `</div>`;

    html += this.modal();
    this.element.innerHTML = html;
    this.events();
  }

  createGroupList(data: any) {
    document.querySelector('.data-is-not').classList.add('closed-group-hidden');

    const HTMLListOpenGroups = document.getElementById('divForListOpenGroups');
    const HTMLListClosedGroups = document.getElementById('divForListClosedGroups');

    console.log(Boolean(data));
    console.log(data);
    console.log();

    if (data.dataGroup) {
      if (!data.dataGroup.dateClose) {
        HTMLListOpenGroups.insertAdjacentHTML('afterbegin', createCardGroup(data));
        // HTMLListOpenGroups.insertAdjacentHTML('afterbegin', this.createCard(data));
      } else {
        HTMLListClosedGroups.insertAdjacentHTML('afterbegin', createCardGroup(data));
      }
    } else if (!document.querySelector('.data-is-not')) {
      HTMLListOpenGroups.insertAdjacentHTML('afterbegin', contentForNoData());
    }


    function createCardGroup(data: any, balanceGroup: number | null = null) {
      const NUM_OF_IMG_IN_GROUP_CARD: number = 3;
      const date: Date = new Date(data.dataGroup.dateCreate);
      const dataCreateGroup: string = date.toLocaleString();
      const listImgUsers = data.arrayUserImg;

      const participantsImg: string[] = [];
      listImgUsers.forEach((imgUser: any) => {
        if (participantsImg.length < 3) {
          participantsImg.push(`<img class="card-group__img-avatar--mini" src="${imgUser}" alt="icon">`);
        }
      });
      if (listImgUsers.length > NUM_OF_IMG_IN_GROUP_CARD) {
        participantsImg.push('+');
        participantsImg.push(String(listImgUsers.length));
      }

      const groupCard = `
        <div class="card mb-3 card-group">
          <div class="row g-0 col">
            <div class="col-3 card-group__box-logo-group">
              <img class="card-group__img-avatar" src="${data.dataGroup.style.icon}" alt="icon-group">
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

    function contentForNoData() {
      const html = `
        <div class="card-body data-is-not">
          <h5 class="card-title">No groups yet.</h5>
          <p class="card-text">Would you like to create the first group?</p>
        </div>
      `;
      return html;
    }

  }


  createCard(data: any, balanceGroup: number | null = null) {
    console.log('ok');

    const NUM_OF_IMG_IN_GROUP_CARD: number = 3;
    const date: Date = new Date(data.dataGroup.dateCreate);
    const dataCreateGroup: string = date.toLocaleString();
    const listImgUsers = data.arrayUserImg;

    const participantsImg: string[] = [];
    listImgUsers.forEach((imgUser: any) => {
      if (participantsImg.length < 3) {
        participantsImg.push(`<img class="card-group__img-avatar--mini" src="${imgUser}" alt="icon">`);
      }
    });
    if (listImgUsers.length > NUM_OF_IMG_IN_GROUP_CARD) {
      participantsImg.push('+');
      participantsImg.push(String(listImgUsers.length));
    }

    const groupCard = `
      <div class="card mb-3 card-group">
        <div class="row g-0 col">
          <div class="col-3 card-group__box-logo-group">
            <img class="card-group__img-avatar" src="${data.dataGroup.Styles.Icon}" alt="icon-group">
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
              <div class="form-floating col-12">
                <input type="text" class="form-control" id="formTitle" name="title" placeholder="Title" required>
                <label for="formTitle" class="form-label">Title*</label>
                <div class="invalid-feedback">
                  Please input title.
                </div>
              </div>

              <div class="form-group">
                <label for="exampleFormControlFile1">Add logo group</label>
                <input type="file" class="form-control-file input-logo-group" id="formImg" name="logoGroup">
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


    let logoGroupImg = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_nfXkbg7F-gw1LndLRRcgoQxmEtlGcBpKIw&usqp=CAU';
    const formPhoto: HTMLFormElement = this.element.querySelector('.form-group');
    const inputPhoto: HTMLInputElement = this.element.querySelector('.input-logo-group');

    inputPhoto.addEventListener('change', (): void => {
      if (inputPhoto.files[0]) {
          const newData = getFormData(
          formPhoto,
          this.element.querySelector('.form-control-file'),
        );
        logoGroupImg = newData.logoGroup;
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
        style: {'icon': logoGroupImg},
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

  addGroupToList(group: any) {
    const list = this.element.querySelector('.groups');
    let date: Date = new Date(group.dateCreate);
    const localDate: string = date.toLocaleString();
    if (group) {
      const html = `
          <div class="card group">
            <div class="card__content">
                 <div><span><strong>Title</strong> </span><span>${group.title}</span></div>
                 <div><span><strong>Description</strong> </span><span>${group.description}</span></div>
                 <div><span><strong>Create Date</strong> </span><span>${localDate}</span></div>
                 <div><span><strong>User list</strong> </span><span>${group.userList}</span></div>
            </div>
          </div>
        `;

      list.insertAdjacentHTML('afterbegin', html);
    } else {
      console.log('No data');
    }
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