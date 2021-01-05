import { Page } from '../../Classes/Page';
import { Modal } from '../../Classes/Modal';

export class Sidebar extends Page {
  public onSignOut: any;
  private signOutModal: Modal;
  public onMainPage: any;
  public onGroupsPage: any;
  public onTransactionsPage: any;
  public onStatisticsPage: any;
  public onSettingsPage: any;
  public onHelpPage: any;

  constructor(element: string) {
    super(element);
    if (element) {
      this.signOutModal = Modal.create();
      this.signOutModal.render();
      this.signOutModal.setOkHandler(this.onSignOutHandler);
    }
    // this.init();
  }

  onSignOutHandler = () => {
    this.onSignOut();
  }

  static create(element: string): Sidebar {
    return new Sidebar(element);
  }

  private init() {
    this.element.className = 'mdc-drawer mdc-drawer--dismissible mdc-top-app-bar--fixed-adjust mdc-drawer--modal';
  }

  public render = (data: any) => {
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
          <a class="mdc-list-item mdc-list-item--activated" href="#" aria-current="page" id="sidebarMainLink">
            <span class="mdc-list-item__ripple"></span>
            <i class="material-icons mdc-list-item__graphic" aria-hidden="true">house</i>
            <span class="mdc-list-item__text">Главная</span>
          </a>
          <a class="mdc-list-item" href="#" id="sidebarGroupsLink">
            <span class="mdc-list-item__ripple"></span>
            <i class="material-icons mdc-list-item__graphic" aria-hidden="true">groups</i>
            <span class="mdc-list-item__text">Группы</span>
          </a>
          <a class="mdc-list-item" href="#" id="sidebarTransactionsLink">
            <span class="mdc-list-item__ripple"></span>
            <i class="material-icons mdc-list-item__graphic" aria-hidden="true">receipt_long</i>
            <span class="mdc-list-item__text">Транзакции</span>
          </a>
          <a class="mdc-list-item" href="#" id="sidebarStatisticsLink">
            <span class="mdc-list-item__ripple"></span>
            <i class="material-icons mdc-list-item__graphic" aria-hidden="true">bar_chart</i>
            <span class="mdc-list-item__text">Статистика</span>
          </a>

          <hr class="mdc-list-divider">
          <a class="mdc-list-item" href="#" id="sidebarSettingsLink">
            <span class="mdc-list-item__ripple"></span>
            <i class="material-icons mdc-list-item__graphic" aria-hidden="true">settings</i>
            <span class="mdc-list-item__text">Настройки</span>
          </a>
          <a class="mdc-list-item" href="#" id="sidebarHelpLink">
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
  }

  protected events(): void {
    this.element.addEventListener('click', ev => {
      const { target }: any = ev;

      if (target.closest('#signOut')) {
        this.signOutModal.open();
      }

      if (target.closest('#sidebarMainLink')) {
        this.onMainPage();
      }

      if (target.closest('#sidebarGroupsLink')) {
        this.onGroupsPage();
      }

      if (target.closest('#sidebarTransactionsLink')) {
        this.onTransactionsPage();
      }

      if (target.closest('#sidebarStatisticsLink')) {
        this.onStatisticsPage();
      }

      if (target.closest('#sidebarSettingsLink')) {
        this.onSettingsPage();
      }

      if (target.closest('#sidebarHelpLink')) {
        this.onHelpPage();
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
