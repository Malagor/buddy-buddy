import { Page } from '../../Classes/Page';
import { formatDate } from './formatDate';
const NUM_OF_IMG_IN_GROUP_CARD: number = 3;


export class GroupPage extends Page {
  onCreateNewGroup: any;
  onAddMember: any;

  static create(element: string): GroupPage {
    return new GroupPage(element);
  }

  render = (data: any): void => {
    let html = `
      <div class="container">
        <div class="row justify-content-between">
          <div class="col-6">
            <h2>Groups</h2>
          </div>
    `;

    html += this.createGroupList(data);

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

  createGroupList(data: any) {
    let HTMLGroups = '';

    if (data) {
      let openGroupHTMLCard = '';
      let closedGroupHTMLCard = '';

      data.forEach((element: any) => {
        const participantsId = element.userList;

        let participantsImg: string[] = [];
        participantsId.forEach((participant: any) => {
          if (participantsImg.length < NUM_OF_IMG_IN_GROUP_CARD) {
            participantsImg.push(`<img class="card-group__img-avatar--mini" src="${element.style.icon}" alt="icon${participant}">`);
          }
        });
        if (participantsId.length > NUM_OF_IMG_IN_GROUP_CARD) participantsImg.push(`<span>+${participantsId.length - NUM_OF_IMG_IN_GROUP_CARD}</span>`);

        let balanceGroup: string = '';
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
        }

        const groupCard = `
          <div class="card mb-3 card-group">
            <div class="row g-0 col">
              <div class="col-3 card-group__box-logo-group">
                <img class="card-group__img-avatar" src="${element.style.icon}" alt="icon-group">
              </div>

              <div class="col-9 card-group__box-content">

                <div class="row col">
                  <div class="col-7">
                    <h5>${element.title}</h5>
                  </div>
                  <div class="col-5">
                    <h5>${formatDate(element.dateCreate)}</h5>
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

        if (!element.dateClose) {
          openGroupHTMLCard += groupCard;
        } else if (element.dateClose) {
          closedGroupHTMLCard += groupCard;
        }
      });

      HTMLGroups += `
        <div class="col-6">
          <h2>Balance $5</h2>
        </div>
      `;
      HTMLGroups += `</div>`;

      HTMLGroups += `
        <div id="openGroup" class="open-group">
          ${openGroupHTMLCard}
        </div>
        <div id="closedGroup" class="closed-group ">

          <div class="accordion" id="accordionExample">
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingOne">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                  Closed Group
                </button>
              </h2>
              <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                <div id="closedGroupBoxCard" class="accordion-body">
                  ${closedGroupHTMLCard}
                </div>
              </div>
            </div>
          </div>

        </div>
      `;
    } else {
      HTMLGroups += `</div>`;
      HTMLGroups += `
      <div class="card">
          <div class="card-body">
            <h5 class="card-title">No groups yet.</h5>
            <p class="card-text">Would you like to create the first group?</p>
          </div>
        </div>
      </div>
      `;
    }
    return HTMLGroups;
  }

  protected events(): void {
    const addGroupBtn = document.querySelector('#createGroupBtn');
    addGroupBtn.addEventListener('click', () => {
    });

    const addGroupMember = document.querySelector('#addNewGroupMember');
    addGroupMember.addEventListener('click', (ev) => {
      ev.preventDefault();
      console.log('Add new Member');
      const member: HTMLFormElement = document.querySelector('#formMembers');
      this.onAddMember(member.value);
    });
  }
}