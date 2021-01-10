import { Page } from '../../Classes/Page';

export class Main extends Page {
  static create(element: string): Main {
    const page: Main = new Main(element);
    page.render = page.render.bind(page);
    return page;
  }

  getDataForCurrency(el: HTMLElement): any | void {
    fetch('https://www.nbrb.by/api/exrates/rates?periodicity=0')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        el.innerHTML = this.createCurrTable(data);
      });
  }

  createCurrTable(data: any): any {
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
      </tr>
      `;
    }

    return result;
  }

  render(data: any): void {
    this.element.innerHTML = `
    <div class="account__wrapper d-flex align-items-center flex-column">
      <div class="account__info d-flex align-items-center flex-column account--width-80">
        <div class="account__header d-flex align-items-center">
          <div class="account__image-wrapper position-relative overflow-hidden">
            <img src="${data.avatar}" alt="${
      data.name && data.surname
    }" class="account__image position-absolute top-50 start-50 translate-middle">
          </div>
          <p class="account__nick">@${data.account}</p>
        </div>
        <h3 class="main__name">
          <span>${data.name}</span>
        </h3>
        <div class="main__currency d-flex align-items-center flex-column account--width-80">
          <p class="account__balance align-self-end">Balance 250$</p>
        </div>
        <div class="main__currency d-flex align-items-center flex-column account--width-80">
          <p class="main__currency__current d-flex align-items-center">
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
              </tr>
            </thead>
            <tbody>
            </tbody>
          </table>
        </div>
        <div class="main__currency d-flex align-items-center flex-column account--width-80">
          <p class="main__currency__current align-self-start">
            <span>My groups</span>
          </p>
          <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
            <ol class="carousel-indicators">
              <li data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active"></li>
              <li data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"></li>
              <li data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"></li>
            </ol>
            <div class="carousel-inner">
              <div class="carousel-item active">
                
              </div>
              <div class="carousel-item">
                <img src="..." class="d-block w-100" alt="...">
              </div>
              <div class="carousel-item">
                <img src="..." class="d-block w-100" alt="...">
              </div>
            </div>
            <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </a>
            <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </a>
          </div>
        </div>
      </div>
    </div>    
    `;
    this.getDataForCurrency(this.element.querySelector('tbody'));
  }
}

// <div class="container">
//       <div class="card">
//         <div class="card-body">
//           <div class="row">
//             <div class="col-12 col-md-4">
//               <div class="account__image">
//                 <img src="${data.avatar}" alt="${data.name}">
//               </div>
//             </div>
//             <div class="col-12 col-md-8">
//               <div class="row">
//                 <div class="col-12 col-sm-6">
//                   <div>Name</div>
//                   <div>${data.name}</div>
//                   <div>Language</div>
//                   <div>${data.language}</div>
//                 </div>
//                 <div class="col-12 col-sm-6">
//                   <div>Currency</div>
//                   <div>${data.currency}</div>
//                   <div>Theme</div>
//                   <div>${data.theme}</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
