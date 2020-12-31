import { Page } from '../../Classes/Page';
import { MDCRipple } from '@material/ripple';


export class Main extends Page {
  constructor(element: string) {
    super(element);

  }

  static create(element: string): Main {
    return new Main(element);
  }

  render = (data?: any): void => {
    this.element.innerHTML = `
    <div class="mdc-card">
     <div class="account__image"><img src="${data.avatar}" alt="${data.name}"></div>
    <ul class="mdc-list mdc-list--two-line">
      <li class="mdc-list-item" tabindex="0">
        <span class="mdc-list-item__ripple"></span>
        <span class="mdc-list-item__text">
          <span class="mdc-list-item__primary-text">${data.name}</span>
          <span class="mdc-list-item__secondary-text">Name</span>
        </span>
      </li>
      <li class="mdc-list-item">
        <span class="mdc-list-item__ripple"></span>
        <span class="mdc-list-item__text">
          <span class="mdc-list-item__primary-text">${data.language}</span>
          <span class="mdc-list-item__secondary-text">Language</span>
        </span>
      </li>
      <li class="mdc-list-item">
        <span class="mdc-list-item__ripple"></span>
        <span class="mdc-list-item__text">
          <span class="mdc-list-item__primary-text">${data.currency}</span>
          <span class="mdc-list-item__secondary-text">Currency</span>
        </span>
      </li>
      <li class="mdc-list-item">
        <span class="mdc-list-item__ripple"></span>
        <span class="mdc-list-item__text">
          <span class="mdc-list-item__primary-text">${data.theme}</span>
          <span class="mdc-list-item__secondary-text">Theme</span>
        </span>
      </li>
    </ul>

      <div class="mdc-card__actions">
        <div class="mdc-card__action-buttons">
          <button class="mdc-button mdc-card__action mdc-card__action--button">
            <div class="mdc-button__ripple"></div>
            <span class="mdc-button__label">Read</span>
          </button>
          <button class="mdc-button mdc-card__action mdc-card__action--button">
            <div class="mdc-button__ripple"></div>
            <span class="mdc-button__label">Bookmark</span>
          </button>
        </div>
        <div class="mdc-card__action-icons">
         <button class="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon" title="Share">share</button>
          <button class="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon" title="More options">more_vert</button>
        </div>
      </div>

      <div class="mdc-chip-set" role="grid">
        <div class="mdc-chip" role="row">
          <div class="mdc-chip__ripple"></div>
          <span role="gridcell">
            <span role="button" tabindex="0" class="mdc-chip__primary-action">
              <span class="mdc-chip__text">Chip One</span>
            </span>
          </span>
        </div>
        <div class="mdc-chip" role="row">
          <div class="mdc-chip__ripple"></div>
          <span role="gridcell">
            <span role="button" tabindex="-1" class="mdc-chip__primary-action">
              <span class="mdc-chip__text">Chip Two</span>
            </span>
          </span>
        </div>
      </div>

      <div class="mdc-touch-target-wrapper">
        <button class="mdc-fab  mdc-fab--touch">
          <div class="mdc-fab__ripple"></div>
          <span class="material-icons mdc-fab__icon">add</span>
          <div class="mdc-fab__touch"></div>
        </button>
      </div>
    `;


    new MDCRipple(document.querySelector('.mdc-fab'));
  }
}
