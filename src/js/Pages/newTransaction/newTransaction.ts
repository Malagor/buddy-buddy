import { groupCollapsed } from 'console';
import { Page } from '../../Classes/Page';

const data = {
  groupList: ['Группа1', 'Группа2', 'Группа3'],
  userList: ["Маша", "Саша", "Петя", "Катя", "Вася", "Юля"] 
}

// const data = [['Группа1', ["Маша", "Саша", "Петя"]], ['Группа2', ["Катя", "Лена", "Коля"]], ['Группа3', ["Ваня", "Юля", "Соня"]] ];
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
        <div class="trans-group">
          <input type="text" class="trans-group-current">
          <div class="trans-group-list hidden"></div>
        </div>   
      </div>
      <textarea class="trans-descr" placeholder="Описание..."></textarea>
      <div class="trans-sum-wrapper">
        <input class="trans-sum" placeholder="Введите сумму">
        <div class="currency-wrapper">
          <input class="trans-currency" value="$">
          <div class="currency-list hidden">
            <div class="currency-item">$</div>
            <div class="currency-item">&euro;</div>
            <div class="currency-item">BYN</div>
            <div class="currency-item">RU</div>
          </div>
        </div>       
      </div>

      <div class="check-wrapper">
        <label class="add-check">
          <div class="add-check-text">Добавить чек</div>
          <i class="material-icons">attach_file</i>
          <input type="file" accept="image/*" class="input-file">
        </label>
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

    const groupsList: HTMLElement = document.querySelector('.trans-group-list');
    data.groupList.forEach((group) => {
      const groupItem = document.createElement('div');
      groupItem.classList.add('group-item');
      groupItem.innerText = group;
      groupsList.append(groupItem);
    });
    
    
    




    

    this.events();
  };

  protected events(): void {
    const membersList: HTMLElement = document.querySelector('.checked-members');
    const users = document.querySelectorAll('.all-members-user');
    const allBtn: HTMLFormElement = document.querySelector('.all-btn');
    const sumInput: HTMLFormElement = document.querySelector('.trans-sum');

    sumInput.addEventListener('keyup', () => {
      divideSum();
    });

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
          <input class="member-sum sum-evenly" type="text">
          <textarea class="member-comment" type="text" placeholder="Комментарий..."></textarea>
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
        divideSum();
      });
    });

    allBtn.addEventListener('click', () => {
      membersList.innerHTML = '';
      users.forEach((user) => {
        const userAvatar = user.querySelector('.user-avatar');
        const userName = user.querySelector('.user-name').innerHTML;
        userAvatar.classList.add('user-checked'); 
        const memberWrapper = document.createElement('div');
          memberWrapper.classList.add('checked-member-wrapper');
          memberWrapper.innerHTML = `
          <div class="member">
            <div class="user-avatar"></div>
            <div class="user-name">${userName}</div>
          </div>
          <input class="member-sum sum-evenly" type="text">
          <textarea class="member-comment" type="text" placeholder="Комментарий..."></textarea>
          `;
        membersList.append(memberWrapper); 
      });
      divideSum();    
    });

    const inputCheck = document.querySelector('.input-file');
    const inputWrapper = document.querySelector('.add-check');
    
    inputCheck.addEventListener('change', () => {
      inputWrapper.innerHTML = `<div class="add-check-text">Чек добавлен</div>
      <i class="material-icons">check</i>
      <input type="file" accept="image/*" class="input-file">`;
    });


    const inputGroup: HTMLFormElement = document.querySelector('.trans-group-current');
    const groupsList: HTMLElement = document.querySelector('.trans-group-list');
    const groups = document.querySelectorAll('.group-item');
  
    inputGroup.addEventListener('click', () => {
       groupsList.classList.toggle('hidden');
    });

    groups.forEach((group) => {
      group.addEventListener('click', () => {
        groupsList.classList.add('hidden');
        inputGroup.value = group.innerHTML;
      });
    });

    const currencyInput: HTMLFormElement = document.querySelector('.trans-currency');
    const currencyList: HTMLElement = document.querySelector('.currency-list');
    const currencyItems = document.querySelectorAll('.currency-item');
    
    currencyInput.addEventListener('click', () => {
      currencyList.classList.toggle('hidden');
    });

    currencyItems.forEach((item) => {
      item.addEventListener('click', () => {
        currencyList.classList.add('hidden');
        currencyInput.value = item.innerHTML;
      });
    });

    const divideSum = ():void => {
      let membersSumInputs: any = document.querySelectorAll('.sum-evenly'); 
      let numbOfmembers: number = membersSumInputs.length;
      let totalSum: number = +sumInput.value;

      membersSumInputs.forEach((memberSum: HTMLInputElement) => {
        memberSum.addEventListener('keyup', () => {
          if(typeof +memberSum.value === 'number') {
            console.log(true);
            memberSum.classList.remove('sum-evenly');
            memberSum.classList.add('not-evenly');
            membersSumInputs = document.querySelectorAll('.sum-evenly');
            numbOfmembers = membersSumInputs.length;
            totalSum = (+sumInput.value) - (+memberSum.value);
            if (totalSum >= 0) {
              membersSumInputs.forEach((input: HTMLFormElement) => {
                input.setAttribute('placeholder',`${(totalSum / numbOfmembers).toFixed(1)}`);
              });
            }           
          }  
        });
      });

      const membersSumNotEvenly = document.querySelectorAll('.not-evenly');
      let addSum: number = 0;
      membersSumNotEvenly.forEach((input: HTMLInputElement) => {
        addSum += +input.value; 
      }); 
      totalSum = (+sumInput.value) - addSum;
      if (totalSum >= 0) {
        membersSumInputs.forEach((input: HTMLFormElement) => {
          input.setAttribute('placeholder',`${(totalSum / numbOfmembers).toFixed(1)}`);
        });
      } 
    } 


   

  }
}







// console.log(membersSumInputs);
// membersSumInputs.forEach((memberSum: HTMLFormElement, i: number) => {

//   memberSum.addEventListener('keyup', () => {
//   membersSumInputs.splice(i, 1);
//   console.log(membersSumInputs);

//   // вынести в отдельную функцию
//   const numbOfmembers = membersSumInputs.length;
//   const totalSum = +sumInput.value;
//   membersSumInputs.forEach((sumInput: HTMLFormElement) => {
//     sumInput.setAttribute('placeholder',`${(totalSum / numbOfmembers).toFixed(1)}${currencyInput.value}`);
//   });


//   });
// });