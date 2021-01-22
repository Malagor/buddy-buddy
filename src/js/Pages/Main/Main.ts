import { Page } from '../../Classes/Page';
export class Main extends Page {
  onMainGetBalance: any;

  counter: number = 0;

  static create(element: string): Main {
    const page: Main = new Main(element);
    page.render = page.render.bind(page);
    page.getBalance = page.getBalance.bind(page);
    page.getDataForCurrency = page.getDataForCurrency.bind(page);
    return page;
  }

  getBalance(balance: number): void {
    const tds = document.querySelectorAll('.for-counter');
    const bal: HTMLElement = document.querySelector('.main__balance');
    const index: number = tds.length - 1 - this.counter;
    const stringBalance: string = balance.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    if (bal.lastElementChild.textContent === tds[index].textContent) bal.lastElementChild.textContent = `${stringBalance} ${tds[index].textContent}`;
    tds[index].textContent = `${stringBalance} ${tds[index].textContent}`;

    this.counter++;
    if (this.counter === tds.length) this.counter = 0;
  }

  renderAvatarsBlockForSlider(list: any): string {
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
            <span>+${list.length - 3}</span>
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
  }

  renderOneGroup(avatars: string, index: number, title: string, length: number, groupIcon: string, groupID: string, currGroup: string): void {
    const elems: any = document.querySelectorAll('.carousel-item__inner');
    const newIndex: number = length - index - 1;
    const elemIndex: number = newIndex % 2 === 0 ? newIndex / 2 : (newIndex - 1) / 2;
    console.log(groupID, currGroup);

    const group: string = `
    <div class="main__slider__item">
      <div class="slider__item__img">
        <img src="${groupIcon}" alt="group icon" width="100%">
      </div>
      <p class="slider__item__title">
        <span>${title}</span>
      </p>
      <div class="slider__item__avatars">
      ${avatars}
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
        callback(data, current , this.onMainGetBalance);
      });
  }

  createCurrTable(data: any, current: string, call: any): void {
    const currencies: string[] = ['USD', 'EUR', 'RUB'];
    const dt: any = [];
    const usdRate = data.find((item: any) => item.Cur_Abbreviation === 'USD').Cur_OfficialRate;

    document.querySelector('tbody').innerHTML = `
    <tr>
      <th scope="row">1</th>
      <td>${current}</td>
      <td>1</td>
      <td class="for-counter">${current}</td>
    </tr>`;
    call(usdRate);    

    data.forEach((item: any) => {
      currencies.forEach((it: any) => {
        if (it === item.Cur_Abbreviation) {
          dt.push(item);
        }
      });
    });

    for (let i = 0; i < dt.length; i += 1) {
      document.querySelector('tbody').innerHTML += `
      <tr>
        <th scope="row">${i + 2}</th>
        <td>${dt[i].Cur_Abbreviation}</td>
        <td>${dt[i].Cur_OfficialRate}</td>
        <td class="for-counter">${
        dt[i].Cur_Abbreviation
      }</td>
      </tr>
      `;
      const elemRate = dt[i].Cur_Abbreviation === 'RUB' ? usdRate / dt[i].Cur_OfficialRate * 100 : usdRate / dt[i].Cur_OfficialRate;
      call(elemRate);
    }
  }

  renderSlider(data: any): void {
    const elem: HTMLElement = document.querySelector('.main__group-slider');
    const dataLength: number = data.groupList ? Object.values(data.groupList).filter((item: any) => item.state === 'approve').length : 0;
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
    }
  }

  renderSliderItems(data: any): void {
    const elem: HTMLElement = document.querySelector('.main__group-slider');
    const dataLength: number = data.groupList ? Object.values(data.groupList).filter((item: any) => item.state === 'approve').length: 0;
    const carouselItemCount: number = dataLength % 2 === 0 ? dataLength / 2 : (dataLength + 1) / 2;

    if (dataLength) {
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

  renderTransactions(data: any): void {
    if (!data.length) {
      document.querySelector('.main__group-transactions').innerHTML = `
      <div class="card main__card-no-trans">
        <div class="card-body d-flex align-items-center flex-column justify-content-center">
          <h6 class="card-title m-0 main--font-size">No transactions yet.</h6>
        </div>
      </div>
      `;
    } else {
      data.forEach((item: any, index: number) => {
        const userCost: string = item.toUserList.find((it: any) => it[0] === item.uid) ?
        `-${item.toUserList.find((it: any) => it[0] === item.uid)[1].cost} ${item.currency}` :
        `+${item.totalCost} ${item.currency}`;
        if (index < 10) {
          const date: Date = new Date(item.date);
          document.querySelector('.main__group-transactions').innerHTML += `
            <div class="card main__card-trans">
              <div class="main__card-trans__wrapper">
                <div class="main__card-trans__header main--font-size">
                  <p class="card-trans__header__trans-name">
                    <span class="card-trans__header__title">${
                      item.description
                    }</span>
                  </p>               
                </div>
                <div class="main__card-trans__main main--font-size">
                  <p class="card-trans__main__cost">
                    <span>
                    ${userCost}
                    </span>
                  </p>
                  <p class="card-trans__main__loc">
                    <span class="card-trans__main__date">
                    ${date.toLocaleDateString()} ${date.toLocaleTimeString().slice(0, 5)}
                    </span>
                  </p>
                </div>
                <p class="main__card-trans__footer">                  
                  <span>${
                    item.groupTitle
                  } group</span>
                </p>
              </div>   
            </div>
            `; 
        }
      });
    }
  }

  checkUserCost(): void {
    document.querySelectorAll('.card-trans__main__cost').forEach((item: HTMLElement) => {
      if (item.firstElementChild.textContent.trim()[0] === '-') {
        item.firstElementChild.classList.add('minus-cost');
      } else {
        item.firstElementChild.classList.add('plus-cost');
      }
    });     
  }

  addUserInfo(data: any): void {
    document.querySelector('.block__title').textContent = `@${data.account}`;
    document.querySelector('.block__image').setAttribute('src', data.avatar);
    document.querySelector('.block__image').setAttribute('alt', data.name);
    document.querySelector('.main__name__text').textContent = data.name;
    document.querySelector('.balance__text').textContent = data.currency;
  }

  render(): void {
    this.element.innerHTML = `
    <div class="block__wrapper">
    <div class="block__content">
      <div class="block__header block__header--main">
        <p class="block__title"></p>
      </div>
      <div class="block__main">
        <div class="block__card justify-content-between block--width-85 block__card--no-border">
          <div class="block__card block__element-gap main__block-name-photo flex-column block__card--no-border">
              <div class="block__image-wrapper">
                <img src="#" alt="" class="block__image">
            </div>
            <p class="main__name mb-0 w-100">
              <span class="main__name__text"></span>
            </p>
          </div>
          <p class="main__balance align-self-start block__element-gap">
            <span>Balance</span> 
            <span class="balance__text d-block"></span>
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
            <span>My last transactions</span>
          </p>
          <div class="main__group-transactions flex-column main__inner-card">
          </div>
        </div>
    </div>
  </div>
  `;
  }
}
