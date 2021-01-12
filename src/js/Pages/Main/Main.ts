import { Page } from '../../Classes/Page';

export class Main extends Page {
  static create(element: string): Main {
    const page: Main = new Main(element);
    page.render = page.render.bind(page);
    return page;
  }

  getDataForCurrency(el: HTMLElement): void {
    fetch('https://www.nbrb.by/api/exrates/rates?periodicity=0')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        el.innerHTML = this.createCurrTable(data);
      });
  }

  createCurrTable(data: any): string {
    const currencies: string[] = ['EUR', 'USD', 'RUB'];
    const dt: any = [];
    data.map((item: any) => {
      if (
        currencies.map((it: any) => {
          if (it === item.Cur_Abbreviation) {
            dt.push(item);
          }
        })
      ) {
      }
    });
    const currencyCount: number = 3;
    let result: string = '';

    for (let i = 0; i < currencyCount; i += 1) {
      result += `
      <tr>
        <th scope="row">${i + 1}</th>
        <td>${dt[i].Cur_Abbreviation}</td>
        <td>${dt[i].Cur_OfficialRate}</td>
        <td>${dt[i].Cur_OfficialRate * (data.balance || 0)} ${
        dt[i].Cur_Abbreviation
      }</td>
      </tr>
      `;
    }

    return result;
  }

  renderSlider(elem: HTMLElement, dt: any): void {
    // if (dt.groupList === '[]') {
    elem.innerHTML = `
      <div class="card">
        <div class="card-body d-flex align-items-center flex-column">
          <h6 class="card-title">No groups yet.</h6>
          <button type="button" class="btn btn-secondary btn-sm">Go to group's page</button>
        </div>
      </div>
      `;
    // }
  }

  renderTransactions(elem: HTMLElement, dt: any): void {
    // if (dt.groupList === '[]') {
    elem.innerHTML = `
      <div class="card">
        <div class="card-body d-flex align-items-center flex-column justify-content-center">
          <h6 class="card-title">No transactions yet.</h6>
          <button type="button" class="btn btn-secondary btn-sm">Create transaction $$$</button>
        </div>
      </div>
      `;
    // }
  }

  render(data: any): void {
    this.element.innerHTML = `
    <div class="block__wrapper d-flex align-items-center flex-column">
      <div class="block__content d-flex align-items-center flex-column w-100">
        <div class="block__header block__header--main d-flex align-items-center">
          <p class="block__nickname">@${data.account}</p>
        </div>
        <div class="main__currency d-flex align-items-center flex-column w-100">
          <div class="block__image-wrapper position-relative overflow-hidden">
          <img src="${data.avatar}" alt="${
      data.name && data.surname
    }" class="block__image position-absolute top-50 start-50 translate-middle">
        </div>
          <h3 class="main__name">
            <span>${data.name}</span>
          </h3>
        </div>
        <div class="main__currency d-flex align-items-center flex-column block--width-80">
          <p class="main__balance">Balance ${data.balance || 0} ${
      data.currency
    }</p>
        </div>
        <div class="main__currency d-flex align-items-center flex-column block--width-85 main--border">
          <p class="main__currency__current d-flex align-items-center align-self-start">
            <span>Current currency:</span>
            <select class="form-select w-auto" aria-label="Default select example">
              <option value="BYN" selected>BYN</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="RUB">RUB</option>
            </select>
          </p>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Currency</th>
                <th scope="col">National Bank</th>
                <th scope="col">Balance</th>
              </tr>
            </thead>
            <tbody>
            </tbody>
          </table>
        </div>
        <div class="main__currency d-flex align-items-center flex-column block--width-85 main--border">
          <p class="main__currency__current align-self-start">
            <span>My groups</span>
          </p>
          <div class="main__group-slider d-flex align-items-center justify-content-center flex-column w-100 main__card">
          </div>
        </div>
        <div class="main__currency d-flex align-items-center flex-column block--width-85 main--border">
          <p class="main__currency__current align-self-start">
            <span>Group's transactions</span>
          </p>
          <div class="main__group-transactions d-flex align-items-center justify-content-center flex-column w-100 main__card">
          </div>
        </div>
      </div>
    </div>    
    `;
    this.getDataForCurrency(this.element.querySelector('tbody'));
    this.renderSlider(this.element.querySelector('.main__group-slider'), data);
    this.renderTransactions(
      this.element.querySelector('.main__group-transactions'),
      data,
    );
  }
}
