import { Page } from '../../Classes/Page';

let currentGroup = 'группа2';
const datafail = [{title: "группа1",
                ID: "1-1",
                userList: [{name: "Маша", 
                            ID: "1", 
                            image: "URL"},
                            {name: "Паша", 
                             ID: "2", 
                            image: "URL"}, 
                            {name: "Саша", 
                            ID: "3", 
                            image: "URL"}]},
              {title: 'группа2',
               ID: "2-2", 
               userList: [{name: "Соня", 
                          userID: "4", 
                          image: "URL"},
                          {name: "Петя", 
                          userID: "5", 
                          image: "URL"}, 
                          {name: "Коля", 
                          userID: "6", 
                          image: "URL"}]}, 
              {title: 'группа3',
               ID: "3-3",
               userList: [{name: "Оля", 
                        userID: "7", 
                        image: "URL"},
                        {name: "Лена", 
                        userID: "8", 
                        image: "URL"}, 
                        {name: "Катя", 
                        userID: "9", 
                        image: "URL"}]},                           
                          ];

const userList = [
  {ID: '111', name: "Оля", avatar: "#"},
  {ID: '222', name: "Коля", avatar: "#"},
  {ID: '333', name: "Маша", avatar: "#"},
  {ID: '444', name: "Саша", avatar: "#"},
  {ID: '555', name: "Паша", avatar: "#"},
  {ID: '666', name: "Лена", avatar: "#"},
];                       
export class NewTransaction extends Page {
 
  constructor(element: string) {
    super(element);
  }

  static create(element: string): NewTransaction {
    return new NewTransaction(element);
  }

  render = (): void => {
   
    this.element.innerHTML = `
      <div class="new-trans modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Новая транзакция</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
    
          <div class="input-group mb-2">
            <span class="input-group-text">Группа</span>
            <select class="new-trans__groups-list form-select"></select>
          </div>

          <div class="input-group mb-2">
            <span class="input-group-text">Описание</span>
            <textarea class="new-trans__descr form-control"></textarea>
          </div>

          <div class="input-group mb-2">
            <span class="input-group-text w-30">Общая сумма</span>
            <input type="text" class="total-sum form-control w-50">
            <select class="new-trans__currency-list form-select w-20"></select>
          </div>

          <div class="add-check input-group mb-2">
            <label class="add-check__wrapper">
              <div class="add-check__text">Добавить чек</div>
              <i class="material-icons">attach_file</i>
              <input type="file" accept="image/*" class="add-check__file" name="check">
            </label>
          </div>

          <div class="new-trans__members">
            <div class="new-trans__members-list d-flex flex-wrap justify-content-center"></div>
            <div class="d-flex justify-content-center">
              <button type="button" class="all-btn btn btn-secondary btn-sm">Выбрать всех</button>
            </div> 
          </div>
          
          <div class="checked-members"></div>

        </div>
            
        <div class="modal-footer">
          <button type="button" class="new-trans__create-btn btn btn-primary w-100" data-bs-dismiss="modal">Создать транзакцию</button>
        </div>
      </div>
    `;

    this.addGroupsList(datafail);
    this.addMembersOfGroup(userList);  

    this.events();
  }

  addGroupsList = (dataX: any) => {
    const groups: HTMLInputElement = document.querySelector('.new-trans__groups-list');
    dataX.forEach((group: any) => {
      const groupElement = document.createElement('option');
      groups.value = currentGroup;
      if(group.title === currentGroup) {
        groupElement.setAttribute('selected', '');
      }
      groupElement.classList.add('new-trans__groups-item');
      groupElement.setAttribute('group-id', `${group.ID}`)
      groupElement.value = group.title;
      groupElement.innerText = group.title;
      groups.append(groupElement);
    });
  }

  addMembersOfGroup = (dataX: any) => {
   const members = document.querySelector('.new-trans__members-list'); 
   dataX.forEach((user: any) => {
    const userElement = document.createElement('div');
      userElement.classList.add('member', 'd-flex', 'flex-column', 'align-items-center');
      userElement.setAttribute('user-id', `${user.ID}`);
      userElement.innerHTML = `
        <div class="member__avatar">
          <img src="${user.avatar}" alt="#">
        </div>
        <div class="member__name">${user.name}</div>
      `;
      members.append(userElement);
   });
  }

  protected events(): void {
    const groups: HTMLInputElement = document.querySelector('.new-trans__groups-list');
    const ckeckedMembersList: HTMLElement = document.querySelector('.checked-members');
    const allBtn: HTMLFormElement = document.querySelector('.all-btn');
    const sumInput: HTMLFormElement = document.querySelector('.total-sum');
    const allMembers = document.querySelectorAll('.member'); 

    groups.addEventListener('change', () => {
      currentGroup = groups.value;
    });

    

    sumInput.addEventListener('keyup', () => {
      if (typeof +sumInput.value === 'number') {
        divideSum();
      }
    });

    allMembers.forEach((user) => {
        user.addEventListener('click', () => {
          const userAvatar = user.querySelector('.member__avatar');
          const userName = user.querySelector('.member__name').innerHTML;
          const userID = user.getAttribute('user-id');
          userAvatar.classList.toggle('checked');
          if (userAvatar.classList.contains('checked')) {
            const checkedUserHTML = `
            <div class="checked-member-wrapper d-flex align-items-center justify-content-between">
              <div class="checked-member d-flex flex-column align-items-center">
                <div class="checked-member__avatar"></div>
                <div class="checked-member__name" user-id=${userID}>${userName}</div>
              </div>          
              <input class="checked-member__sum checked-member__sum--evenly form-control form-control-sm" type="text">          
              <textarea class="checked-member__comment form-control" placeholder="Комментарий"></textarea>          
            </div>
            `;
            ckeckedMembersList.insertAdjacentHTML('beforeend', checkedUserHTML);
          } else {
            const checkedMembers = document.querySelectorAll('.checked-member-wrapper');
            checkedMembers.forEach((memb) => {
              if(memb.querySelector('.checked-member__name').innerHTML === userName) {
                memb.remove();
              }
            });
          }
          divideSum();
        });
      });
  
    
    allBtn.addEventListener('click', () => {
      ckeckedMembersList.innerHTML = '';
      allMembers.forEach((user) => {
        const userAvatar = user.querySelector('.member__avatar');
        const userName = user.querySelector('.member__name').innerHTML;
        const userID = user.getAttribute('user-id');
        userAvatar.classList.add('checked');
        const checkedUserHTML = `
            <div class="checked-member-wrapper d-flex align-items-center justify-content-between">
              <div class="checked-member d-flex flex-column align-items-center">
                <div class="checked-member__avatar"></div>
                <div class="checked-member__name" user-id=${userID}>${userName}</div>
              </div>
              <input class="checked-member__sum checked-member__sum--evenly form-control form-control-sm" type="text">
              <textarea class="checked-member__comment form-control" placeholder="Комментарий"></textarea>
            </div>
            `;
        ckeckedMembersList.insertAdjacentHTML('beforeend', checkedUserHTML);    

      });
   
      divideSum();    
    });

    const inputCheck = document.querySelector('.add-check__file');
    const inputCheckWrapper = document.querySelector('.add-check__wrapper');

    inputCheck.addEventListener('change', () => {
      inputCheckWrapper.innerHTML = `<div class="add-check__text">Чек добавлен</div>
      <i class="material-icons">check</i>
      <input type="file" accept="image/*" class="add-check__file" name="check">`;
    });
  }  
}










const divideSum = ():void => {
  const sumInput: HTMLFormElement = document.querySelector('.total-sum');
  const membersSumInputs = document.querySelectorAll('.checked-member__sum');
  let membersSumEvenly: any = document.querySelectorAll('.checked-member__sum--evenly');
  let membersSumNotEvenly: any = document.querySelectorAll('.checked-member__sum--notevenly'); 
  let numbOfmembers: number = membersSumEvenly.length;

  membersSumInputs.forEach((memberSum: HTMLInputElement) => {
    memberSum.addEventListener('keyup', () => {
      console.log ('suminput', +memberSum.value);
      if(typeof +memberSum.value === 'number' && +memberSum.value > 0) {
        memberSum.classList.remove('checked-member__sum--evenly');
        memberSum.classList.add('checked-member__sum--notevenly');     
      } else if (+memberSum.value === 0)  {
        console.log('here');
        memberSum.classList.add('checked-member__sum--evenly');
        memberSum.classList.remove('checked-member__sum--notevenly');
          
      } else return;

      membersSumEvenly = document.querySelectorAll('.checked-member__sum--evenly');
      numbOfmembers = membersSumEvenly.length;
      membersSumNotEvenly = document.querySelectorAll('.checked-member__sum--notevenly');

      let sumNotEvenly: number = 0;
      membersSumNotEvenly.forEach((input: any) => {
        sumNotEvenly += +input.value;
      });
      const totalSum = (+sumInput.value) - sumNotEvenly; 

      if (totalSum >= 0) {
        membersSumEvenly.forEach((input: HTMLFormElement) => {
          input.setAttribute('placeholder',`${(totalSum / numbOfmembers).toFixed(1)}`);
        });
      } else {
        membersSumInputs.forEach((input: HTMLFormElement) => {
          input.setAttribute('placeholder','0.0');
        });
      }                     
    });
  });


  membersSumEvenly = document.querySelectorAll('.checked-member__sum--evenly');
  numbOfmembers = membersSumEvenly.length;
  membersSumNotEvenly = document.querySelectorAll('.checked-member__sum--notevenly');

  let sumNotEvenly: number = 0;
  membersSumNotEvenly.forEach((input: any) => {
    sumNotEvenly += +input.value;
  });
  const totalSum = (+sumInput.value) - sumNotEvenly; 

  if (totalSum >= 0) {
    membersSumEvenly.forEach((input: HTMLFormElement) => {
      input.setAttribute('placeholder',`${(totalSum / numbOfmembers).toFixed(1)}`);
    });
  } else {
    membersSumInputs.forEach((input: HTMLFormElement) => {
      input.setAttribute('placeholder','0.0');
    });
  }     
}






