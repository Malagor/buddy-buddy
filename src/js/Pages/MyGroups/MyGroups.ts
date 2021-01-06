import { Page } from '../../Classes/Page';

export class MyGroups extends Page {
  onCreateNewGroup: any;
  onAddMember: any;

  static create(el: string): MyGroups {
    const page = new MyGroups(el);
    page.addMembersGroup.bind(page);
    return page;
  }

  render(data?: any): void {
    console.log('data Group:', data);
    let html = '<div class="groups">';
    if (data != null) {
      data.forEach((group: { title: string; description: string; dateCreate: Date; }) => {
        html += `
        <div class="card group">
          <div class="card__content">
               <div><span><strong>Title</strong> </span><span>${group.title}</span></div>
               <div><span><strong>Description</strong> </span><span>${group.description}</span></div>
               <div><span><strong>Create Date</strong> </span><span>${group.dateCreate}</span></div>
          </div>
        </div>
        `;
      });
    } else {
      html += 'No groups yet. Would you like to create the first group?';
    }

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

  modal() {
    return `
    <div class="modal fade" id="addNewGroupModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">
      <div class="modal-dialog modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Create New Group</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form class="form-floating row g-3" id="newGroupForm">
              <div class="form-floating col-12">
                <input type="text" class="form-control" id="formTitle" name="title" placeholder="Title">
                <label for="formTitle" class="form-label">Title</label>
              </div>
              <div class="form-floating col-12">
                <textarea class="form-control" id="formDesc" rows="4" name="description" placeholder="Description"></textarea>
                <label for="formDesc" class="form-label">Description</label>
              </div>
              <div class="input-group col-12">
<!--                <select class="form-select" aria-label="Default select example" id="formMembers">-->
<!--                  <option selected>Open this select menu</option>-->
<!--                  <option value="1">One</option>-->
<!--                  <option value="2">Two</option>-->
<!--                  <option value="3">Three</option>-->
<!--                </select>-->
                <span class="input-group-text" id="basic-addon1">@</span>
                <input type="text" class="form-control" id="formMembers" placeholder="Members" aria-label="Username" aria-describedby="basic-addon1">
<!--                <label for="formMembers">Members</label>-->
                <button type="button" class="btn btn-primary" id="addNewGroupMember"><span class="material-icons">person_search</span></button>
              </div>
               <div class="col-12 group-members-avatar"></div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" id="createGroupBtn">Create New Group</button>
          </div>
        </div>
      </div>
    </div>
    `;
  }

  protected events(): void {
    const addGroupBtn = document.querySelector('#createGroupBtn');
    addGroupBtn.addEventListener('click', () => {
      // const title: string = (<HTMLInputElement>document.getElementById('formTitle')).value;
      // const description: string = (<HTMLInputElement>document.getElementById('formDesc')).value;
      // const membersName = document.querySelectorAll()
      // const users = [];
      // const groupData = {
      //   title,
      //   description,
      //   dataCreate: new Date(),
      //   dateClose: null,
      //   userList,
      //   transactionList: []
      // };

      // this.onCreateNewGroup(groupData);
    });

    const addGroupMember = document.querySelector('#addNewGroupMember');
    addGroupMember.addEventListener('click', (ev) => {
      ev.preventDefault();
      console.log('Add new Member');
      const member: HTMLFormElement = document.querySelector('#formMembers');
      this.onAddMember(member.value);
    });
  }

  addMembersGroup(data: any): void {
    const members = document.querySelector('.group-members-avatar');
    members.insertAdjacentHTML('beforeend', `
    <div class="member">
      <div class="member__avatar">
        <img src="${data.avatar}" alt="${data.name}">
      </div>
      <div class="member__name">${data.name}</div>
    </div>
    `);
  }
}


