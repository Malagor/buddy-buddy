import { Page } from '../../Classes/Page';
import { Modal } from 'bootstrap';
import { currentYear } from '../../Util/currentYear';

const defAvatar = require('../../../assets/images/default-user-avatar.jpg');
const logo = require('../../../assets/icons/team.svg');
const githubLogo = require('../../../assets/icons/github.svg');
const rssLogo = require('../../../assets/icons/rs_school_js.svg');

export class Layout extends Page {
  onMainPage: any;
  onGroupsPage: any;
  onTransactionsPage: any;
  onStatisticsPage: any;
  onSettingsPage: any;
  onHelpPage: any;
  onSignOut: any;
  onAccountPage: any;
  onMessagesPage: any;

  static create(el: string) {
    return new Layout(el);
  }

  render(): void {
    this.element.innerHTML = `
    <header class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
      <a class="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="#">${logo} Buddy-Buddy</a>
      <button class="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    </header>

    <div class="container">
      <div class="row">
        <nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
          <div class="position-sticky pt-3 sidebar__header">
            <div class="sidebar-avatar__wrapper">
              <img class="sidebar-avatar__image" src="${defAvatar}" alt="Alex Malagor">
            </div>
            <h3 class="sidebar__user-name"></h3>
            <h6 class="sidebar__account">@malagor</h6>
          </div>
          <hr>
          <ul class="nav flex-column">
              <li class="nav-item">
                <a class="nav-link sidebarMainLink" aria-current="page" href="#">
                  <i class="material-icons">house</i><span class="nav-link__text">Главная</span>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="#" id="sidebarAccountLink" data-target=".navbar-collapse.in">
                  <i class="material-icons">account_box</i><span class="nav-link__text">Аккаунт</span>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link sidebarGroupsLink" href="#">
                  <i class="material-icons">groups</i><span class="nav-link__text">Группы</span>
                  <span class="badge bg-danger"></span>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link sidebarTransactionsLink" href="#">
                  <i class="material-icons">receipt_long</i><span class="nav-link__text">Транзакции</span>
                  <span class="badge bg-danger"></span>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link sidebarMessagesLink" href="#">
                 <i class="material-icons">speaker_notes</i><span class="nav-link__text">Сообщения</span>
                 <span class="badge bg-danger"></span>
                </a>
              </li>
            </ul>
          <hr>
          <ul class="nav flex-column mb-2">
              <li class="nav-item">
                <a class="nav-link" href="#" id="sidebarStatisticsLink">
                 <i class="material-icons">bar_chart</i><span class="nav-link__text">Статистика</span>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" id="sidebarSettingsLink">
                  <i class="material-icons">settings</i>
            <span class="nav-link__text">Настройки</span>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" id="sidebarHelpLink">
                  <i class="material-icons">help_outline</i>
            <span class="nav-link__text">Помощь</span>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" id="signOut" data-bs-toggle="modal" data-bs-target="#singOutModal">
                  <i class="material-icons">power_settings_new</i>
            <span class="nav-link__text">Выход</span>
                </a>
              </li>
            </ul>
        </nav>
        </div>
        <main class="col-md-9 ms-sm-auto justify-content-md-center col-lg-10 px-md-4 main">
        </main>
      </div>
    </div>
    <footer class="fixed-bottom bg-dark text-white d-none d-md-block footer ">
      <div class="footer__content row align-items-center">
        <div class="footer__title col-3">
          ${logo}
          <p><span>Buddy-Buddy</span></p>
        </div>
        <div class="footer__authors col-6">
          <div class="row w-100">
            <div class="footer__author col-6 col-lg-3">
              <a href="https://github.com/Malagor" class="footer__author__link" target="_blank">
                <p>Malagor</p>
                <p class="footer__github">${githubLogo}</p>
              </a>
            </div>
            <div class="footer__author col-6 col-lg-3">
              <a href="https://github.com/besovadevka" class="footer__author__link" target="_blank">
                <p>besovadevka</p>
                <p class="footer__github">${githubLogo}</p>
              </a>
            </div>
            <div class="footer__author col-6 col-lg-3">
              <a href="https://github.com/gryzun33" class="footer__author__link" target="_blank">
                <p>gryzun33</p>
                <p class="footer__github">${githubLogo}</p>
              </a>
            </div>
            <div class="footer__author col-6 col-lg-3">
              <a href="https://github.com/Andrei107Q" class="footer__author__link" target="_blank">
                <p>Andrei107Q</p>
                <p class="footer__github">${githubLogo}</p>
              </a>
            </div>
          </div>
        </div>
        <div class="footer__school col-3">
          <p>© 2020-${currentYear()}</p>
          <a href="https://rs.school/js/" class="footer__course__link" target="_blank">${rssLogo}</a>
        </div>
      </div>
    </footer>

    <footer class="fixed-bottom d-block d-md-none bg-light footer footer--mobile">
      <div class="footer__content row align-items-center">
        <div class="footer__title col-3">
          <div class="nav-item">
            <a class="nav-link sidebarMainLink" aria-current="page" href="#">
              <i class="material-icons">house</i><span class="d-none d-sm-block nav-link__text">Главная</span>
            </a>
          </div>
        </div>
        <div class="footer__title col-3">
          <div class="nav-item">
            <a class="nav-link sidebarGroupsLink" href="#">
              <i class="material-icons">groups</i><span class="d-none d-sm-block nav-link__text">Группы</span>
              <span class="badge bg-danger"></span>
            </a>
          </div>
        </div>
        <div class="footer__title col-3">
          <div class="nav-item">
            <a class="nav-link sidebarTransactionsLink" href="#">
              <i class="material-icons">receipt_long</i><span class="d-none d-sm-block nav-link__text">Транзакции</span>
              <span class="badge bg-danger"></span>
            </a>
          </div>
        </div>
        <div class="footer__school col-3">
          <div class="nav-item">
            <a class="nav-link sidebarMessagesLink" href="#">
             <i class="material-icons">speaker_notes</i><span class="d-none d-sm-block nav-link__text">Сообщения</span>
             <span class="badge bg-danger"></span>
            </a>
          </div>
        </div>
      </div>
    </footer>

    <div class="modal fade"  id="singOutModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Action Confirmation</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to SignOut?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" id="modalButtonOk">SignOut</button>
          </div>
        </div>
      </div>
    </div>

    `;

    this.events();
  }

  protected events(): void {
    const myModal = document.getElementById('singOutModal');

    // console.log('Modal', Modal);
    const signOutModal = new Modal(myModal);

    myModal.addEventListener('click', (event) => {
      const { target }: any = event;
      if (target.closest('#modalButtonOk')) {
        signOutModal.toggle();
        this.onSignOut();
      }
    });

    document.body.addEventListener('click', (ev) => {
      const { target }: any = ev;

      // if (target.closest('#signOut')) {
      //   this.onSignOut();
      // }

      if (target.closest('.sidebarMainLink')) {
        ev.preventDefault();
        this.onMainPage();
        if (!target.closest('.footer')) {
          Layout.closeMobileMenu();
        }
      }
      if (target.closest('#sidebarAccountLink')) {
        ev.preventDefault();
        this.onAccountPage();
        Layout.closeMobileMenu();
      }

      if (target.closest('.sidebarGroupsLink')) {
        ev.preventDefault();
        this.onGroupsPage();
        if (!target.closest('.footer')) {
          Layout.closeMobileMenu();
        }
      }

      if (target.closest('.sidebarTransactionsLink')) {
        ev.preventDefault();
        this.onTransactionsPage();
        if (!target.closest('.footer')) {
          Layout.closeMobileMenu();
        }
      }

      if (target.closest('.sidebarMessagesLink')) {
        ev.preventDefault();
        this.onMessagesPage();
        if (!target.closest('.footer')) {
          Layout.closeMobileMenu();
        }
      }

      if (target.closest('#sidebarStatisticsLink')) {
        ev.preventDefault();
        this.onStatisticsPage();
        Layout.closeMobileMenu();
      }

      if (target.closest('#sidebarSettingsLink')) {
        ev.preventDefault();
        this.onSettingsPage();
        Layout.closeMobileMenu();
      }

      if (target.closest('#sidebarHelpLink')) {
        ev.preventDefault();
        this.onHelpPage();
        Layout.closeMobileMenu();
      }
    });
  }

  setSidebarData(data: any): void {
    const menuAvatar: Element = document.querySelector(
      '.sidebar-avatar__image',
    );
    const menuUserName: Element = document.querySelector('.sidebar__user-name');
    const menuUserAccount: Element = document.querySelector(
      '.sidebar__account',
    );

    menuAvatar.setAttribute('src', data.avatar);
    menuAvatar.setAttribute('alt', data.name);

    menuUserName.textContent = data.name;
    menuUserAccount.textContent = '@' + data.account;
  }

  static closeMobileMenu() {
    const toggleMenu: HTMLElement = document.querySelector('.navbar-toggler');
    const display = window.getComputedStyle(toggleMenu).display;
    if (display !== 'none') {
      toggleMenu.click();
    }
  }
}
