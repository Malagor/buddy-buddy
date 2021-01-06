import { Page } from '../../Classes/Page';
import { GroupPage } from '../../Pages/GroupsPages/GroupsPage';

export class Sidebar extends Page {
  onGroupPage: any;
  private goToGroupPage: GroupPage;

  constructor(element: string) {
    super(element);

    this.goToGroupPage = GroupPage.create('main');

    this.init();
  }

  static create(element: string): Sidebar {
    return new Sidebar(element);
  }

  private init() {
    this.element.className = 'mdc-drawer mdc-drawer--dismissible mdc-top-app-bar--fixed-adjust mdc-drawer--modal';
  }

  public render = (data: any) => {
    console.log(this.element);
    this.element.innerHTML = `
        <div class="mdc-drawer__header sidebar">
        <div class="sidebar-avatar__wrapper">
          <img class="sidebar-avatar__image" src="${data.avatar}" alt="${data.name}">
        </div>
        <h3 class="mdc-drawer__title sidebar__user-name">${data.name}</h3>
        <h6 class="mdc-drawer__subtitle sidebar__account">@malagor</h6>
      </div>
      <div class="mdc-drawer__content">
        <nav class="mdc-list">
          <a class="mdc-list-item mdc-list-item--activated" href="#" aria-current="page">
            <span class="mdc-list-item__ripple"></span>
            <i class="material-icons mdc-list-item__graphic" aria-hidden="true">house</i>
            <span class="mdc-list-item__text">Главная</span>
          </a>
          <a class="mdc-list-item" href="#" id="groups">
            <span class="mdc-list-item__ripple"></span>
            <i class="material-icons mdc-list-item__graphic" aria-hidden="true">groups</i>
            <span class="mdc-list-item__text">Группы</span>
          </a>
          <a class="mdc-list-item" href="#">
            <span class="mdc-list-item__ripple"></span>
            <i class="material-icons mdc-list-item__graphic" aria-hidden="true">receipt_long</i>
            <span class="mdc-list-item__text">Транзакции</span>
          </a>
          <a class="mdc-list-item" href="#">
            <span class="mdc-list-item__ripple"></span>
            <i class="material-icons mdc-list-item__graphic" aria-hidden="true">bar_chart</i>
            <span class="mdc-list-item__text">Статистика</span>
          </a>

          <hr class="mdc-list-divider">
          <a class="mdc-list-item" href="#">
            <span class="mdc-list-item__ripple"></span>
            <i class="material-icons mdc-list-item__graphic" aria-hidden="true">settings</i>
            <span class="mdc-list-item__text">Настройки</span>
          </a>
          <a class="mdc-list-item" href="#">
            <span class="mdc-list-item__ripple"></span>
            <i class="material-icons mdc-list-item__graphic" aria-hidden="true">help_outline</i>
            <span class="mdc-list-item__text">Помощь</span>
          </a>
          <a class="mdc-list-item" href="#" id="signOut">
            <span class="mdc-list-item__ripple"></span>
            <i class="material-icons mdc-list-item__graphic" aria-hidden="true">power_settings_new</i>
            <span class="mdc-list-item__text">Выход</span>
          </a>
        </nav>
      </div>
    `;

    this.events();
    Sidebar.setSidebarInfo(data.avatar, data.name);
  };

  protected events(): void {
    //super.events();

    this.element.addEventListener('click', ev => {
      const { target }: any = ev;
      console.log('Sideebar');

      if (target.closest('#signOut')) {
        console.log('SignOut');
      }

      if (target.closest('#groups')) {
        console.log('groups');
        this.goToGroupPage.render();
      }
    });
  }

  static setSidebarInfo(img: string, name: string) {
    const menuAvatar: Element = document.querySelector('.sidebar-avatar__image');
    const menuUserName: Element = document.querySelector('.sidebar__user-name');

    menuAvatar.setAttribute('src', img);
    menuAvatar.setAttribute('alt', name);

    menuUserName.textContent = name;
  }
}
