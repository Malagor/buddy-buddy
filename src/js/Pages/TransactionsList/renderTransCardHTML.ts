import { i18n } from '@lingui/core';
import { transactionsRU } from '../../languages/RU/transactions';
import { transactionsENG} from '../../languages/ENG/transactions';
import { loadLanguage } from '../../Util/saveLoadLanguage';

i18n.load('RU', transactionsRU);
i18n.load('ENG', transactionsENG);

const locale = loadLanguage();
i18n.activate(locale);

export const renderTransCardHTML = (trans: any, date: any, styles: any ) => {
  return `
  <p class="trans-item__header align-self-start text-truncate">
    <span class="trans-item__descr fw-bolder text-truncate">${trans.description}</span>
  </p>
  <div class="trans-item__info d-flex justify-content-between">
    <div class="trans-item__date align-self-start">
      <div class="trans-item__day">${date.localeDay}</div>
      <div class="trans-item__time">${date.localeTime}</div>
    </div>
    <div class="trans-item__users d-flex align-self-center justify-content-center"></div>

    <div class="trans-item__cost-state  d-flex flex-column justify-content-center ">
       <div class="trans-item__cost  ${styles.colorCost} text-end">${styles.cost} ${trans.currency}</div>
       <div class="trans-item__state-wrap ${styles.btnDisplay} align-self-end">
        <select class="trans-item__state form-select" aria-label="Default select example">
          <option ${styles.selectPending} value="pending">${i18n._('pending')}</option>
          <option ${styles.selectApprove} value="approve">${i18n._('approve')}</option>
          <option ${styles.selectAbort} value="decline">${i18n._('decline')}</option>
        </select>
      </div>
    </div>
  </div>
  `;
};
