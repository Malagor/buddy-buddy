import { Page } from '../../Classes/Page';

const helpContent = require('./../Help/help.html');

export class Help extends Page {
  static create(el: string): Help {
    return new Help(el);
  }

  render(): void {
    this.element.innerHTML = `
    <div class="block__wrapper">
      <div class="block__content">
        <div class="block__header block__header--main">
          <p class="block__title">Help page</p>
        </div>
        <div class="block__main">
          <div class="help_page block--width-85 d-flex flex-column">${helpContent}</div>
        </div>
        <div class="block__footer">
        </div>
      </div>
    </div>
    `;
  }
}
