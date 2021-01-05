import { Page } from '../../Classes/Page';

const data = [
  {
    title : "Кругосветное путешествие",
    transactions : [
      {
        description: "Поезд Минск-Гродно",
        data: "12-10-2020",
        time: "15:20",
        balance: "-5$",
        submit: false,
        users: [
          {name : "Коля",
           avatar: "ooooo",
          }
        ]
      },
      {
        description: "Поезд Минск-Гродно",
        data: "12-10-2020",
        time: "15:20",
        balance: "-5$",
        submit: false,
        users: [
          {name : "Коля",
           avatar: "ooooo",
          }
        ]
      },
      {
        description: "Поезд Минск-Гродно",
        data: "12-10-2020",
        time: "15:20",
        balance: "15$",
        users: [
          {name : "Коля",
           avatar: "ooooo",
           cost: "-5$",
           submit: true,
          },
          {name : "Оля",
           avatar: "ooooo",
           cost: "-5$",
           submit: true,
          },
          {name : "Петя",
           avatar: "ooooo",
           cost: "-5$",
           submit: true,
          },
        ]
      }
    ],
  },
  {
    title : "Поход в лес",
    transactions : [
      {
        description: "Поезд Минск-Гродно",
        data: "12-10-2020",
        time: "15:20",
        balance: "-5$",
        submit: false,
        users: [
          {name : "Коля",
           avatar: "ooooo",
          }
        ]
      },
    ],
  },
];

export class TransactionsList extends Page {
  // onTransitionSignInPage: any;
  // onLogin: any;

  constructor(element: string) {
    super(element);
  }

  static create(element: string): TransactionsList {
    return new TransactionsList(element);
  }

  public render = (): void => {

    this.element.innerHTML = `
    <div class="translist-wrapper">
      <div class="translist-title">Список транзакций</div>
      <div class="group-info">
        <select class="group-list">
          <option class="translist-group-item" value="group1">Группа 1</option>
          <option class="translist-group-item" value="group2">Группа 2</option>
          <option class="translist-group-item" value="group3">Группа 3</option>
          <option class="translist-group-item" value="group4">Группа 4</option>
        </select>
        <div class="group-sum color-plus">+50$</div>  
      </div>
 
      <div class="translist-list">


        <div class="translist-item">
          <div class="translist-item-descr">Поезд Минск-Гродно</div>
          <div class="translist-item-group">Кругосветное путешествие</div>
          <div class="translist-item-info">
            <div class="translist-item-data">
              <div class="translist-item-day">31.12.2020</div>
              <div class="translist-item-time">21.50</div>            
            </div>
            <div class="translist-item-user">
              <div class="translist-user-image"></div>
              <div class="translist-user-name">Маша</div>   
            </div>
            <div class="translist-item-sum color-minus">-5$</div>

            <div class="mdc-form-field">
              <div class="mdc-checkbox">
                <input type="checkbox"
                      class="mdc-checkbox__native-control trans-submit"
                      id="checkbox-1"/>
                <div class="mdc-checkbox__background trans-submit">
                  <svg class="mdc-checkbox__checkmark"
                      viewBox="0 0 24 24">
                    <path class="mdc-checkbox__checkmark-path trans-submit"
                          fill="none"
                          d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
                  </svg>
                  <div class="mdc-checkbox__mixedmark"></div>
                </div>
                <div class="mdc-checkbox__ripple"></div>
              </div>
            </div>

          </div>
          <div class="add-list hidden">
            <div class="translist-item-submit">ПОДРОБНЕЕ</div>
          </div>
        </div>





        <div class="translist-item">
          <div class="translist-item-descr">Поезд Минск-Гродно</div>
          <div class="translist-item-group">Кругосветное путешествие</div>
          <div class="translist-item-info">
            <div class="translist-item-data">
              <div class="translist-item-day">31.12.2020</div>
              <div class="translist-item-time">21.50</div>            
            </div>
            <div class="translist-item-user">
              <div class="translist-user-image"></div>
              <div class="translist-user-name">Паша</div>   
            </div>
            <div class="translist-item-sum color-minus">-5$</div>

            <div class="mdc-form-field">
              <div class="mdc-checkbox">
                <input type="checkbox"
                      class="mdc-checkbox__native-control"
                      id="checkbox-1"/>
                <div class="mdc-checkbox__background">
                  <svg class="mdc-checkbox__checkmark"
                      viewBox="0 0 24 24">
                    <path class="mdc-checkbox__checkmark-path"
                          fill="none"
                          d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
                  </svg>
                  <div class="mdc-checkbox__mixedmark"></div>
                </div>
                <div class="mdc-checkbox__ripple"></div>
              </div>
            </div>

          </div>
          <div class="add-list hidden">
            <div class="translist-item-submit">ПОДРОБНЕЕ</div>
          </div>
          
        </div>


        <div class="translist-item">
        <div class="translist-item-descr">Поезд Минск-Гродно</div>
        <div class="translist-item-group">Кругосветное путешествие</div>
        <div class="translist-item-info">
          <div class="translist-item-data">
            <div class="translist-item-day">31.12.2020</div>
            <div class="translist-item-time">21.50</div>            
          </div>

          <div class="users-wrapper">
            <div class="translist-item-users">
              <div class="translist-user-image" style="background-color:red; z-index:1; position:absolute; left:0px;"></div>
              <div class="translist-user-image" style="background-color:green; z-index:2; position:absolute; left:20px;"></div>
              <div class="translist-user-image" style="background-color:blue; z-index:3; position:absolute; left:40px;"></div>          
            </div>
          </div>
       
          <div class="translist-item-sum color-plus">15$</div>

          <div class="mdc-form-field non-visible">
            <div class="mdc-checkbox">
              <input type="checkbox"
                    class="mdc-checkbox__native-control"
                    id="checkbox-1"/>
              <div class="mdc-checkbox__background">
                <svg class="mdc-checkbox__checkmark"
                    viewBox="0 0 24 24">
                  <path class="mdc-checkbox__checkmark-path"
                        fill="none"
                        d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
                </svg>
                <div class="mdc-checkbox__mixedmark"></div>
              </div>
              <div class="mdc-checkbox__ripple"></div>
            </div>
          </div>

        </div>
        <div class="add-list add-list-line hidden">

          <div class="add-item">
            <div class="add-user">
              <div class="translist-user-image" style="background-color:red"></div>
              <div class="translist-user-name">Саша</div> 
            </div>
            <div class="add-sum color-plus">+5$</div>
            <div class="add-submit><i class="material-icons">done</i></div>
          </div>

          <div class="add-item">
            <div class="add-user">
              <div class="translist-user-image" style="background-color:green"></div>
              <div class="translist-user-name">Паша</div> 
            </div>
            <div class="add-sum color-plus">+5$</div>
            <div class="add-submit><i class="material-icons">done</i></div>
          </div>

          <div class="add-item">
            <div class="add-user">
              <div class="translist-user-image" style="background-color:blue"></div>
              <div class="translist-user-name">Маша</div> 
            </div>
            <div class="add-sum color-plus">+5$</div>
            <div class="add-submit><i class="material-icons">done</i></div>
          </div>
          

          <div class="translist-item-submit">ПОБРОБНЕЕ</div>
        </div>
        
      </div>

      </div>
      <div class="mdc-touch-target-wrapper">
        <button class="mdc-fab mdc-fab--mini mdc-fab--touch newtrans-btn">
          <div class="mdc-fab__ripple"></div>
          <span class="material-icons mdc-fab__icon">add</span>
          <div class="mdc-fab__touch"></div>
        </button>
      </div>




  


      `;
    // const newTransactionBtn = document.querySelector('.mdc-touch-target-wrapper');  
    // newTransactionBtn.getBoundingClientRect().bottom = '100px';
    // newTransactionBtn.getBoundingClientRect().right= '100px';
    this.events();
  }

  protected events(): void {
       const listItems = document.querySelectorAll('.translist-item');
       listItems.forEach((item):void => {
         item.addEventListener('click', ():void => {
          
          item.querySelector('.add-list').classList.toggle('hidden');
          
         })
       });
  }
}
