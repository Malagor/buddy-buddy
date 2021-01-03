import { Page } from '../../Classes/Page';

const data = {
  groupList: ['Группа1', 'Группа2', 'Группа3'],
  userList: ["Маша", "Саша", "Петя", "Катя", "Вася", "Юля"] 
}
export class NewTransactionPage extends Page {
 
  constructor(element: string) {
    super(element);
  }

  static create(element: string): NewTransactionPage {
    return new NewTransactionPage(element);
  }

  render = (): void => {

    this.element.innerHTML = `
    <div class="trans-wrapper"> 
      <div class="trans-title">Новая транзакция</div>
      <div class="trans-group-wrapper">
        <div class="trans-group-text">Выберите группу: </div>
        <select class="trans-group"></select>
      </div>
      <textarea class="trans-descr" placeholder="Описание..."></textarea>
      <div class="trans-sum-wrapper">
        <input class="trans-sum" placeholder="Введите сумму">
        <select class="trans-currency">
          <option>$</option>
          <option>&euro;</option>
          <option>BYN</option>
          <option>RU</option>
        </select>  
      </div>
      <div class="check-wrapper">
        <div class="check-text">Чек:</div>
        <input type="file" accept="image/*" class="check">
      </div>
      <div class="all-members-wrapper">
        <div class="all-members"></div>
        <button class="mdc-button all-btn">
          <div class="mdc-button__ripple"></div>
          <span class="mdc-button__label">ВЫБРАТЬ ВСЕХ</span>
        </button>
      </div>
      <div class="checked-members"></div>   
    </div>
    <button class="mdc-button mdc-button--raised create-trans">
      <span class="mdc-button__label">СОЗДАТЬ ТРАНЗАКЦИЮ</span>
    </button>
    `;

    const members = document.querySelector('.all-members');
    data.userList.forEach((user) => {
      const userElement = document.createElement('div');
      userElement.classList.add('all-members-user');
      userElement.innerHTML = `
        <div class="user-avatar"></div>
        <div class="user-name">${user}</div>
      `;
      members.append(userElement);
    });

    const groups = document.querySelector('.trans-group')
    data.groupList.forEach((group) => {
      const groupItem = document.createElement('option');
      groupItem.classList.add('group-item');
      groupItem.innerText = group;
      groups.append(groupItem);
    });



    

    this.events();
  };

  protected events(): void {
    const membersList = document.querySelector('.checked-members');

    const users = document.querySelectorAll('.all-members-user');
    users.forEach((user) => {
      user.addEventListener('click', () => {
        const userAvatar = user.querySelector('.user-avatar');
        const userName = user.querySelector('.user-name').innerHTML;
        userAvatar.classList.toggle('user-checked');
        if (userAvatar.classList.contains('user-checked')) {
          const memberWrapper = document.createElement('div');
          memberWrapper.classList.add('checked-member-wrapper');
          memberWrapper.innerHTML = `
          <div class="member">
            <div class="user-avatar"></div>
            <div class="user-name">${userName}</div>
          </div>
          <input class="member-sum" type="text">
          `;
        membersList.append(memberWrapper); 
        } else {
          const members = document.querySelectorAll('.checked-member-wrapper');
          members.forEach((memb) => {
            if(memb.querySelector('.user-name').innerHTML === userName) {
              memb.remove();
            }
          });
        }
      });
    });
  }
}