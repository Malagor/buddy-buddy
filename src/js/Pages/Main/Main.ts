import { Currencies } from '../../Classes/Currencies';
import { Page } from '../../Classes/Page';
import { i18n } from '@lingui/core';

export class Main extends Page {
  counter: number = 0;
  getBalanceForSliderGroup: (groupID: string) => void;

  static create(element: string): Main {
    const page: Main = new Main(element);
    page.render = page.render.bind(page);
    return page;
  }

  renderCommonBalance(balance: number, currentCurrency: string): void {
    const bal: HTMLElement = document.querySelector('.balance__text');

    setTimeout(() => {
      Currencies.getCurrencyRateByCode(currentCurrency).then(data => bal.textContent = `${(balance * data).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${currentCurrency}`);
    }, 0);
  }

  renderAvatarsBlockForSlider(list: any): string {
    let result: string = '';
    list.forEach((item: any, ind: number) => {
      if (list.length >= 3) {
        if (ind < 3) {
          result += `
          <div class="avatars__wrapper--slider ${ind === 0 && list.length === 3 ? 'avatars__wrapper--slider-special' : ''}">
            <img src="${item}" alt="user avatar">
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
          <img src="${item}" alt="user avatar">
        </div>
        `;
      }
    });
    return result;
  }

  renderOneGroup = (avatars: string, index: number, groupItem: any, length: number, currGroup: string): void => {
    const elems: any = document.querySelectorAll('.carousel-item__inner');
    const newIndex: number = length - index - 1;
    const elemIndex: number = newIndex % 2 === 0 ? newIndex / 2 : (newIndex - 1) / 2;
    const defaultGroupIcon = require('../../../assets/images/default-group-logo.png');

    const currentGroupHTML: string = groupItem.groupID === currGroup 
    ? `<p class="slider__current-group">
        <span>${i18n._('Current')}</span>
      </p>`
    : '';

    const group: string = `
    <div class="main__slider__item">
      <div class="slider__item__img">
        <img src="${groupItem.icon ? groupItem.icon : defaultGroupIcon}" alt="group icon" width="95%">
        <div class="item__img-title-wrapper">
          <p class="slider__item__title">
            <span>${groupItem.title}</span>
          </p>
          ${currentGroupHTML} 
        </div>
      </div>
      <p class="slider__item__title--description">
        <span>${groupItem.description ? groupItem.description : `${i18n._('No description')}.`}</span>
      </p> 
      <p class="slider__item__title--description ${groupItem.groupID}">
      <span></span>
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

    this.getBalanceForSliderGroup(groupItem.groupID);
  }

  renderGroupBalance(data: any) {
    const group: HTMLElement = document.querySelector(`.${data.groupId}`);
    const balanceQuery = Currencies.fromUSD(data.currency);
    balanceQuery(data.balance)
    .then((sum: number) => {
      const HTMLElem = group.firstElementChild;
      HTMLElem.textContent = `${sum.toFixed(2)} ${data.currency}`;
      if (sum > 0) {
        HTMLElem.textContent = '+' + HTMLElem.textContent;
        group.classList.add('plus-cost');
      }
      if (sum < 0) {
        group.classList.add('minus-cost');
      }
    })
  }

  renderCurrenciesTable(balance: number): void {
    const curArr = ['BYN', 'USD', 'EUR', 'RUB'];

    const queries = Currencies.transferToCurrencies(curArr);

    queries(balance)
      .then(data => {
        data.map((item: any, index: number) => {
          document.querySelector('tbody').innerHTML += `
          <tr>
            <th scope="row">${index + 1}</th>
            <td>${item.currency}</td>
            <td>${(data[0].rate / item.rate).toFixed(3)}</td>
            <td>${item.result.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${item.currency}</td>
          </tr>
          `;
        });
      });
  }

  renderSlider(data: any): void {
    const elem: HTMLElement = document.querySelector('.main__group-slider');
    const dataLength: number = data.groupList ? Object.values(data.groupList).filter((item: any) => item.state === 'approve').length : 0;
    if (!dataLength) {
      elem.innerHTML = `
      <div class="card">
        <div class="card-body d-flex align-items-center flex-column">
          <h6 class="card-title m-0 main--font-size">${i18n._('No groups yet')}.</h6>
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

      elem.querySelectorAll('.arrows-color').forEach((item: any) => {
        if (dataLength < 3) item.classList.add('arrows-visibility');
      });
    }
  }

  renderSliderItems(data: any): void {
    const elem: HTMLElement = document.querySelector('.main__group-slider');
    const dataLength: number = data.groupList ? Object.values(data.groupList).filter((item: any) => item.state === 'approve').length : 0;
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
          <h6 class="card-title m-0 main--font-size">${i18n._('No transactions yet')}.</h6>
        </div>
      </div>
      `;

    } else {

      data.forEach((item: any, index: number) => {

        if (index < 10) {
          const date: Date = new Date(item.date);
          document.querySelector('.main__group-transactions').innerHTML += `
            <div class="card main-card-trans">
              <div class="main-card-trans__header main--font-size">
                <p class="card-trans__header__trans-name">
                  <span class="card-trans__header__title">${
                    item.description
                  }</span>
                </p>
              </div>
              <div class="main-card-trans__main main--font-size">
                <p class="card-trans__main__cost">
                  <span>
                  </span>
                </p>
                <p class="card-trans__main__loc">
                  <span class="card-trans__main__date">
                  ${date.toLocaleDateString()} ${date.toLocaleTimeString().slice(0, 5)}
                  </span>
                </p>
              </div>
              <p class="main-card-trans__footer">
                <span>${
                  item.groupTitle
                } group</span>
              </p>
            </div>`;

          Currencies.getCurrencyRateByCode(item.currency)
            .then(data => {
              const userCost: string = item.toUserList.find((it: any) => it[0] === item.uid) 
              ? `+${(item.toUserList.find((it: any) => it[0] === item.uid)[1].cost * data).toFixed(2)} ${item.currency}` 
              : `-${(item.totalCost * data).toFixed(2)} ${item.currency}`;
              document.querySelectorAll('.card-trans__main__cost')[index].firstElementChild.textContent = userCost;
              if (document.querySelectorAll('.card-trans__main__cost')[index].firstElementChild.textContent.trim()[0] !== '+') {
                document.querySelectorAll('.card-trans__main__cost')[index].firstElementChild.classList.add('minus-cost');
              } else {
                document.querySelectorAll('.card-trans__main__cost')[index].firstElementChild.classList.add('plus-cost');
              }
            });
        }
      });
    }
  }

  addUserInfo(data: any) {
    document.querySelector('.block__title').textContent = `@${data.account}`;
    document.querySelector('.block__image').setAttribute('src', data.avatar);
    document.querySelector('.block__image').setAttribute('alt', data.name);
    document.querySelector('.main__name-text').textContent = data.name;
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
                <span class="main__name-text"></span>
              </p>
            </div>
            <p class="main__balance align-self-start block__element-gap">
              <span>${i18n._('Balance')}</span>
              <span class="balance__text d-block"></span>
            </p>
          </div>
          <div class="block__card flex-column block--width-85">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">${i18n._('Currency')}</th>
                  <th scope="col">${i18n._('Rate')}</th>
                  <th scope="col">${i18n._('Balance')}</th>
                </tr>
              </thead>
              <tbody>
              </tbody>
            </table>
          </div>
          <div class="block__card flex-column block--width-85">
            <p class="align-self-start main--font-size">
              <span>${i18n._('My groups')}</span>
            </p>
            <div class="main__group-slider flex-column main__inner-card">
            </div>
          </div>
          <div class="block__card flex-column block--width-85">
            <p class="align-self-start main--font-size">
              <span>${i18n._('My last transactions')}</span>
            </p>
            <div class="main__group-transactions main__inner-card">
            </div>
          </div>
        </div>
        <div class="block__footer main-footer">
        </div>
      </div>
    </div>`;
  }
}
