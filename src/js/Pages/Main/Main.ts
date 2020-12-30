import { Page } from '../../Classes/Page';

export class Main extends Page {
  constructor(element: string) {
    super(element);

  }

  static create(element: string): Main {
    return new Main(element);
  }

  render = (data?: any): void => {
    this.element.innerHTML = `
      <div class="account__image"><img src="${data.avatar}" alt="${data.name}"></div>
      <div class="account__name">${data.name}</div>
      <div class="account__lang">${data.language}</div>
      <div class="account__currency">${data.currency}</div>
      <div class="account__theme">${data.theme}</div>
    `;
  }
}
