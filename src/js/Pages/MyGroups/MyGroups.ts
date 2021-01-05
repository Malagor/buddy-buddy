import { Page } from '../../Classes/Page';
import {MDCRipple} from '@material/ripple';

export class MyGroups extends Page {
  onCreateNewGroup: any;
  static create(el: string): MyGroups {
    return new MyGroups(el);
  }

  render(data?: any): void {
    let html = '';
    if (data != null) {
      data.forEach((group: { title: string; description: string; dateCreate: Date; }) => {
        html += `
        <div class="mdc-card">
        <div class="mdc-card__content">
        <ul class="mdc-list mdc-list--two-line">
          <li class="mdc-list-item" tabindex="0">
            <span class="mdc-list-item__ripple"></span>
            <span class="mdc-list-item__text">
              <span class="mdc-list-item__primary-text">${group.title}</span>
              <span class="mdc-list-item__secondary-text">Title</span>
            </span>
          </li>
          <li class="mdc-list-item">
            <span class="mdc-list-item__ripple"></span>
            <span class="mdc-list-item__text">
              <span class="mdc-list-item__primary-text">${group.description}</span>
              <span class="mdc-list-item__secondary-text">Description</span>
            </span>
          </li>
          <li class="mdc-list-item">
            <span class="mdc-list-item__ripple"></span>
            <span class="mdc-list-item__text">
              <span class="mdc-list-item__primary-text">${group.dateCreate}</span>
              <span class="mdc-list-item__secondary-text">Create Date</span>
            </span>
          </li>
        </ul>
        </div>
        </div>
        `;
      });
    } else {
      html += 'No groups yet. Would you like to create the first group?';
    }

    html += `
    <div class="mdc-touch-target-wrapper">
      <button class="mdc-fab mdc-fab--mini mdc-fab--touch" id="createNewGroup">
        <div class="mdc-fab__ripple"></div>
        <span class="material-icons mdc-fab__icon">add</span>
        <div class="mdc-fab__touch"></div>
      </button>
    </div>
    `;

    this.element.innerHTML = html;
  }

  protected events(): void {
    const fabRipple = new MDCRipple(document.querySelector('.mdc-fab'));
    fabRipple.listen('click', () => {
      console.log('Click New group');
      this.onCreateNewGroup();
    });
  }
}


