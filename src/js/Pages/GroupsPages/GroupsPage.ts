import { Page } from '../../Classes/Page';
const NUM_OF_IMG_IN_GROUP_CARD: number = 3;

// DATA SERVER
const dataGroup: any = [
  {
    id: '1',
    title: 'Title',
    description: 'Description...',
    dateCreate: '12/12/12',
    dateClose: null,
    styles: {
      color: 'red',
      icon: 'https://i1.sndcdn.com/avatars-000549236160-xswcpb-t500x500.jpg',
      background: 'gray'
    },
    userList: [
      '1', '2', '3'
    ],
    state: true,
    balance: '-2'
  },
  {
    id: '2',
    title: 'Title2',
    description: 'Description2...',
    dateCreate: '12/12/12',
    dateClose: null,
    styles: {
      color: 'red',
      icon: 'https://i1.sndcdn.com/avatars-000549236160-xswcpb-t500x500.jpg',
      background: 'gray'
    },
    userList: [
      '1', '2'
    ],
    state: true,
    balance: '+7'
  },
  {
    id: '3',
    title: 'Title3',
    description: 'Description3...',
    dateCreate: '12/12/12',
    dateClose: null,
    styles: {
      color: 'red',
      icon: 'https://i1.sndcdn.com/avatars-000549236160-xswcpb-t500x500.jpg',
      background: 'gray'
    },
    userList: [
      '1', '2', '3', '4', '5', '6'
    ],
    state: true,
    balance: '0'
  },
  {
    id: '4',
    title: 'Title4',
    description: 'Description4...',
    dateCreate: '12/12/12',
    dateClose: null,
    styles: {
      color: 'red',
      icon: 'https://i1.sndcdn.com/avatars-000549236160-xswcpb-t500x500.jpg',
      background: 'gray'
    },
    userList: [
      '1', '2', '3', '4', '5'
    ],
    state: false,
    balance: null
  },
];

export class GroupPage extends Page {

  constructor(element: string) {
    super(element);
  }

  static create(element: string): GroupPage {
    return new GroupPage(element);
  }

  render = (): void => {
    this.element.innerHTML = `
    <div class="title-group">
      <div class="title-group_name"><h2>Groups</h2></div>
      <div class="title-group_name"><h2>Balance $5</h2></div>
    </div>

    <div id="open" class="open-group"></div>
    <div id="closed" class="closed-group">
      <br>
      <div class="title-group_name"><h2>Closed groups - pop-up list</h2></div>
    </div>

    <div id="btn-new-group" class="mdc-touch-target-wrapper position-add-button">
      <button class="mdc-fab mdc-fab--mini mdc-fab--touch">
        <div class="mdc-fab__ripple"></div>
          <span class="material-icons mdc-fab__icon">add</span>
        <div class="mdc-fab__touch"></div>
      </button>
    </div>
    `;

    dataGroup.forEach((element: any, index: number) => {
      const divOpenGroup = document.getElementById('open');
      const divClosedGroup = document.getElementById('closed');

      const card = document.createElement('div');
      const participantsId = element.userList;

      let participantsImg: string[] = [];
      participantsId.forEach((participant: any) => {
        if(participantsImg.length < NUM_OF_IMG_IN_GROUP_CARD) {
          participantsImg.push(`<img class="mdc-card-wrapper__content__bottom__image" src="${dataGroup[index].styles.icon}" alt="icon${participant}">`);
        }  
      });
      // добавляем троеточие если участников больше чем NUM_OF_IMG_IN_GROUP_CARD
      if(participantsId.length > NUM_OF_IMG_IN_GROUP_CARD) participantsImg.push(`<img class="mdc-card-wrapper__content__bottom__image" src="https://img1.freepng.ru/20180328/wtq/kisspng-dots-computer-icons-encapsulated-postscript-dots-5abb909a5fb1a5.051672361522241690392.jpg" alt="icon">`);

      let balanceGroup: string = ''
      if(dataGroup[index].balance < 0) {
        balanceGroup = `<h3 class="mdc-card-wrapper__content__bottom__balance">Balance $<span class="balance-negative-color">${dataGroup[index].balance}</span></h3>`;
      } else if (dataGroup[index].balance >= 0) {
        balanceGroup = `<h3 class="mdc-card-wrapper__content__bottom__balance">Balance $<span class="balance-positive-color">${dataGroup[index].balance}</span></h3>`;
      }

      
      card.innerHTML = `
        <div class="mdc-card">
          <div class="mdc-card-wrapper">
            <div class="mdc-card-wrapper__logo">
              <img class="sidebar-avatar__image" src="${dataGroup[index].styles.icon}" alt="iconGroup">
            </div>
            <div class="mdc-card-wrapper__content">
              <div class="mdc-card-wrapper__content__top">
                <h3 class="mdc-card-wrapper__content__top__title">${dataGroup[index].title}</h3>
                <h3 class="mdc-card-wrapper__content__top__date">${dataGroup[index].dateCreate}</h3>
              </div>
              <div class="mdc-card-wrapper__content__bottom">
                <div>${participantsImg.join('')}</div>
                <h3>${participantsId.length}</h3>
                ${balanceGroup}
              </div>
            </div>
          </div>
        </div>
      `;

      if(element.state) {
        divOpenGroup.appendChild(card);
      } else if (!element.state) {
        divClosedGroup.appendChild(card);
      }
    });

    this.events();
  }
  
  protected events(): void {

    this.element.addEventListener('click', ev => {
      const { target }: any = ev;

      if (target.closest('#btn-new-group')) {
        console.log('create new group');
      }
    });
  }
}
