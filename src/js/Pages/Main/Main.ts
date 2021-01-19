import { Page } from '../../Classes/Page';

export class Main extends Page {
  static create(element: string): Main {
    const page: Main = new Main(element);
    page.render = page.render.bind(page);
    return page;
  }

  renderGroups(userList: any, index: number, title: string, length: number, groupIcon: string, groupID: string, currGroup: string): void {
    if (!userList) return;
    console.log(groupID, currGroup);
    
    const elems: any = document.querySelectorAll('.carousel-item__inner');   
    const newIndex: number = length - index - 1;
    const elemIndex: number =
      newIndex % 2 === 0 ? newIndex / 2 : (newIndex - 1) / 2;
      
    const avatarsBlock: any = (list: any): string => {
      let result: string = '';
      list.forEach((item: any, ind: number) => {
        if (list.length >= 3) {
          if (ind < 3) {
            result += `
            <div class="avatars__wrapper--slider">
              <img src="${item}" alt="user avatar" width="25px">
            </div>
            `;
          } else if (ind === 3) {
            result += `
            <div class="avatars__wrapper--slider-digit">
              <span>+${userList.length - 3}</span>
            </div>
            `;
          }
        } else {
          result += `
          <div class="avatars__wrapper--single">
            <img src="${item}" alt="user avatar" width="25px">
          </div>
          `;
        }
      });
      return result;
    };

    const group: string = `
    <div class="main__slider__item">
      <div class="slider__item__img">
        <img src="${groupIcon}" alt="group icon" width="100%">
      </div>
      <p class="slider__item__title">
        <span>${title}</span>
      </p>
      <div class="slider__item__avatars">
      ${avatarsBlock(userList)}
      </div>
    </div>
    `;

    if (length % 2 === 0) {
      index % 2 !== 0
        ? elems[elemIndex].insertAdjacentHTML('afterbegin', group)
        : elems[elemIndex].insertAdjacentHTML('beforeend', group);
    } else {
      index % 2 !== 0
        ? elems[elemIndex].insertAdjacentHTML('beforeend', group)
        : elems[elemIndex].insertAdjacentHTML('afterbegin', group);
    }
  }

  getDataForCurrency(callback: any, current: string): void {
    fetch('https://www.nbrb.by/api/exrates/rates?periodicity=0')
      .then((response) => {
        return response.json();
      })
      .then((data: any) => {
        callback(data, current);
      });
  }

  createCurrTable(data: any, current: string): void {
    const currencies: string[] = ['USD', 'EUR', 'RUB'];
    const dt: any = [];
    const rateOfCurrent =
      current !== 'BYN'
        ? data.find((item: any) => item.Cur_Abbreviation === current)
            .Cur_OfficialRate
        : 1;

    let result: string = `
    <tr>
      <th scope="row">1</th>
      <td>${current}</td>
      <td>1</td>
      <td>${rateOfCurrent * (data.balance || 0)} ${current}</td>
    </tr>`;

    data.forEach((item: any) => {
      currencies.forEach((it: any) => {
        if (it === item.Cur_Abbreviation) {
          dt.push(item);
        }
      });
    });

    for (let i = 0; i < dt.length; i += 1) {
      result += `
      <tr>
        <th scope="row">${i + 2}</th>
        <td>${dt[i].Cur_Abbreviation}</td>
        <td>${dt[i].Cur_OfficialRate}</td>
        <td>${dt[i].Cur_OfficialRate * (data.balance || 0)} ${
        dt[i].Cur_Abbreviation
      }</td>
      </tr>
      `;
    }
    document.querySelector('tbody').innerHTML = result;
  }

  renderSlider(elem: HTMLElement, dt: any): void {
    const dataLength = Object.values(dt.groupList).filter((item: any) => item.state === 'approve').length; 
    if (!dataLength) {
      elem.innerHTML = `
      <div class="card">
        <div class="card-body d-flex align-items-center flex-column">
          <h6 class="card-title m-0 main--font-size">No groups yet.</h6>
        </div>
      </div>
      `;
    } else {
      elem.innerHTML = `      
      <div id="carouselExampleControls" class="carousel slide main__carousel carousel-dark" data-bs-ride="carousel" data-bs-interval="false">
        <div class="carousel-inner h-100">
        </div>
        <a class="carousel-control-prev arrows-color" href="#carouselExampleControls" role="button" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </a>
        <a class="carousel-control-next arrows-color" href="#carouselExampleControls" role="button" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </a>
      </div>`;

      elem.querySelectorAll('.arrow-color').forEach((item: any) => {
        if (dataLength < 3) item.classLis.add('arrows-visibility');
      });

      const carouselItemCount: number =
        dataLength % 2 === 0
          ? dataLength / 2
          : (dataLength + 1) / 2;
      for (let i = 0; i < carouselItemCount; i += 1) {
        elem.querySelector('.carousel-inner').innerHTML += `
        <div class="carousel-item h-100">
          <div class="carousel-item__inner">
          </div>
        </div>
        `;
      }
      elem
        .querySelector('.carousel-inner')
        .querySelectorAll('.carousel-item')[0]
        .classList.add('active');
    }
  }

  renderAvatarsBlock(data: any, index: number, uid: string, currency: string): void {
    const elems: any = document.querySelectorAll('.card-trans__main__avatars');
    const ELEMENTS_COUNT: number = 3;
    let html: string = '';

    data.forEach((item: any, ind: number) => {
      if (ind < ELEMENTS_COUNT) {
        html += `
            <div class="avatars__wrapper">
              <img src="${item[1].userAvatar}" alt="user avatar" width="35px">
            </div>
            `;
      } else if (ind === ELEMENTS_COUNT) {
        html += `
            <div class="avatars__wrapper--digit">
              <span>+${data.length - ELEMENTS_COUNT}</span>
            </div>
            `;
      }
    });
    elems[index].innerHTML = html;

    const userCosts: any = document.querySelectorAll('.cars-trans__main__cost');

    data.forEach((item: any) => {
      if (item[0] === uid) {
        userCosts[index].innerHTML = `
        <span>${item[1].cost} ${currency}</span>
      `;
      }
    });
  }

  renderTransactions(data: any): void {
    if (!data.length) {
      document.querySelector('.main__group-transactions').innerHTML = `
      <div class="card">
        <div class="card-body d-flex align-items-center flex-column justify-content-center">
          <h6 class="card-title m-0 main--font-size">No transactions yet.</h6>
        </div>
      </div>
      `;
    } else {
      data.forEach((item: any, index: number) => {
        if (index < 10) {
          const date: Date = new Date(item.date);
          document.querySelector('.main__group-transactions').innerHTML += `
            <div class="card main__card-trans">
              <div class="main__card-trans__header main--font-size">
                <p class="card-trans__header__group">
                  <span class="card-trans__header__title">${
                    item.description
                  }</span>
                  <span class="card-trans__header__title">Group:</span>
                </p>
                <p class="card-trans__header__group">                  
                  <span class="card-trans__header__title">${
                    item.groupTitle
                  }</span>
                </p>                
              </div>
              <div class="main__card-trans__main">
                <p class="card-trans__main__loc">
                  <span class="card-trans__main__date">
                  ${date.toLocaleDateString()}
                  </span>
                  <span class="card-trans__main__time">
                  ${date.toLocaleTimeString().slice(0, 5)}
                    </span>
                </p>
                <div class="card-trans__main__avatars">
                </div>
                <p class="cars-trans__main__cost main--font-size">
                </p>
              </div>
              <p class="main__card-trans__footer main--font-size">
                <span class="card-trans__footer__total">
                  Total: ${item.totalCost} ${item.currency}
                </span>
              </p>
            </div>
            `;
        }
      });
    }
  }

  render(data: any): void {
    this.element.innerHTML = `
    <div class="block__wrapper">
    <div class="block__content">
      <div class="block__header block__header--main">
        <p class="block__title">@${data.account}</p>
      </div>
      <div class="block__main">
        <div class="block__card justify-content-between block--width-85 block__card--no-border">
          <div class="block__card block__element-gap flex-column block__card--no-border">
              <div class="block__image-wrapper">
                <img src="${data.avatar}" alt="${
      data.name && data.surname
    }" class="block__image">
            </div>
            <h3 class="main__name">
              <span>${data.name}</span>
            </h3>
          </div>
          <p class="main__balance align-self-start block__element-gap">
            <span>Balance</span> 
            <span>${data.balance || 0} ${data.currency}</span>
          </p>
        </div>
        <div class="block__card flex-column block--width-85">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Currency</th>
                <th scope="col">Rate</th>
                <th scope="col">Balance</th>
              </tr>
            </thead>
            <tbody>
            </tbody>
          </table>
        </div>
        <div class="block__card flex-column block--width-85">
          <p class="align-self-start main--font-size">
            <span>My groups</span>
          </p>
          <div class="main__group-slider flex-column main__inner-card">
          </div>
        </div>
        <div class="block__card flex-column block--width-85">
          <p class="align-self-start main--font-size">
            <span>My transactions</span>
          </p>
          <div class="main__group-transactions flex-column main__inner-card">
          </div>
        </div>
    </div>
  </div>
  `;
    this.getDataForCurrency(this.createCurrTable, data.currency);
    this.renderSlider(this.element.querySelector('.main__group-slider'), data);
  }
}
