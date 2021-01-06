import { Page } from '../../Classes/Page';

export class Main extends Page {
  static create(element: string): Main {
    const page: Main = new Main(element);
    page.render.bind(this);
    return page;
  }

  render(data: any): void {
    this.element.innerHTML = `
    <div class="container">
      <div class="card">
        <div class="card-body">
          <div class="row">
            <div class="col-12 col-md-4">
              <div class="account__image">
                <img src="${data.avatar}" alt="${data.name}">
              </div>
            </div>
            <div class="col-12 col-md-8">
              <div class="row">
                <div class="col-12 col-sm-6">
                  <div>Name</div>
                  <div>${data.name}</div>
                  <div>Language</div>
                  <div>${data.language}</div>
                </div>
                <div class="col-12 col-sm-6">
                  <div>Currency</div>
                  <div>${data.currency}</div>
                  <div>Theme</div>
                  <div>${data.theme}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;
  }
}
