import { Page } from '../../Classes/Page';
import { IGroupData } from '../../Interfaces/IGroupData';

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
    let html = '<div class="groups">';
    html += `
    <button type="button" class="btn btn-success add-new-group" data-bs-toggle="modal" data-bs-target="#addNewGroupModal">
      <i class="material-icons">add</i>
    </button>
    `;

    html += '</div>';

    html += this.modal();

    this.element.innerHTML = html;

    this.events();
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
            <form class="form-floating row g-3" id="newGroupForm">
              <div class="form-floating col-12">
                <input type="text" class="form-control" id="formTitle" name="title" placeholder="Title" required>
                <label for="formTitle" class="form-label">Title*</label>
                <div class="invalid-feedback">
                  Please input title.
                </div>
              </div>
              <div class="<!--form-floating--> col-12">
                <textarea class="form-control" id="formDesc" rows="3" name="description" placeholder="Description"></textarea>
<!--                <label for="formDesc" class="form-label">Description</label>-->
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

    // Set focus in Input when modal is open
    const myModal = document.getElementById('addNewGroupModal');
    const myInput = document.getElementById('formTitle');
    myModal.addEventListener('shown.bs.modal', function() {
      myInput.focus();
    });

    const { newGroupForm }: any = document.forms;
    const form: HTMLFormElement = newGroupForm;

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
        style: null,
      };
      this.onCreateNewGroup(groupData);
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


