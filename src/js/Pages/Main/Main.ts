import { Page } from '../../Classes/Page';
import { MDCRipple } from '@material/ripple';


export class Main extends Page {
  constructor(element: string) {
    super(element);

  }

  static create(element: string): Main {
    return new Main(element);
  }

  render = (data: any): void => {
    this.element.innerHTML = `
    <div class="card">
      <div class="card-body">
        <div class="account__image">
          <img src="${data.avatar}" alt="${data.name}">
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <div>Name</div>
            <div>${data.name}</div>
          </li>
          <li class="list-group-item">
            <div>Language</div>
            <div>${data.language}</div>
          </li>
          <li class="list-group-item">
            <div>Currency</div>
            <div>${data.currency}</div>
          </li>
          <li class="list-group-item">
            <div>Theme</div>
            <div>${data.theme}</div>
          </li>
        </ul>
      </div>
    </div>
    `;
  }
}
