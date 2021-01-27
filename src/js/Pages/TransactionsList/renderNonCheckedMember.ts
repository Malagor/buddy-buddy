import { i18n } from '@lingui/core';
import { transactionsRU } from '../../languages/RU/transactions';
import { transactionsENG} from '../../languages/ENG/transactions';
import { loadLanguage } from '../../Util/saveLoadLanguage';

i18n.load('RU', transactionsRU);
i18n.load('ENG', transactionsENG);

const locale = loadLanguage();
i18n.activate(locale);

export const renderNonCheckedMember = (user: any) => {
  return `
    <div class="details__member d-flex flex-column align-items-center">
      <div class="details__avatar"><img src="${user.avatar}" alt=${user.name}></div>
      <div class="details__name">${user.name}</div>
    </div>
    <input class="details__member-cost form-control form-control-sm non-fixed" type="text" value="0.00">
    <textarea class="details__member-comment form-control" placeholder=${i18n._('Comment')}></textarea>
    <div class="details__member-state d-flex justify-content-center"></div>
    <button class="details__member-delete btn btn-outline-secondary btn-sm"><i class="material-icons">add</i></button>
  `;
};