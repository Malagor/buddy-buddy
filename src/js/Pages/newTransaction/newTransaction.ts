import { Page } from '../../Classes/Page';

const data = {
  groupList: ['group1', 'group2', 'group3'],
  userList: ["Маша", "Саша", "Петя", "Катя", "Вася", "Юля", "Оля"] 
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
    <div class="trans-wrapper> 
      <div class="trans-title">Новая транзакция</div>
      <select class="trans-group"></select>
      <textarea class="trans-descr" placeholder="Описание..." rows="2"></textarea>
      <div class="trans-sum-wrapper">
        <input class="trans-sum" placeholder="Введите сумму">
        <select class="trans-group">
          <option>$</option>
          <option>BY</option>
          <option>Евро</option>
          <option>RU</option>
        </select>  
      </div>
      <div class="check-wrapper">
        <div class="check-text">Добавить чек:</div>
        <input type="file" accept="image/*">
      </div>
      <div class="all-members-wrapper">
        <div class="all-members"></div>
        <button class="for-all">НА ВСЕХ</button>
      </div>
      <div class="checked-members"></div>
      <input type="submit" class="create-trans" value="СОЗДАТЬ ТРАНЗАКЦИЮ">
    </div>
    `;
      


    

    this.events();
  };

  protected events(): void {
    
  }
}