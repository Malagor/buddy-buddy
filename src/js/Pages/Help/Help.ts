import { Page } from '../../Classes/Page';
import { i18n } from '@lingui/core';
import { helpHTML } from './helpHTML';

export class Help extends Page {
  static create(el: string): Help {
    return new Help(el);
  }

  render(): void {
    this.element.innerHTML = `
    <div class="block__wrapper">
      <div class="block__content">
        <div class="block__header block__header--main">
          <p class="block__title">${i18n._('Help page')}</p>
        </div>
        <div class="block__main">
          <div class="help_page block--width-90 d-flex flex-column">${helpHTML()}</div>
        </div>
        <div class="block__footer">
        </div>
      </div>
    </div>
    `;
  }
}
