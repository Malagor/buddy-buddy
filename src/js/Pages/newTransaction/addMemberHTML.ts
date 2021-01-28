import { i18n } from '@lingui/core';
import { transactionsRU } from '../../languages/RU/transactions';
import { transactionsENG} from '../../languages/ENG/transactions';
import { loadLanguage } from '../../Util/saveLoadLanguage';

i18n.load('RU', transactionsRU);
i18n.load('ENG', transactionsENG);

const locale = loadLanguage();
i18n.activate(locale);

export const addMemberHTML = (ID: string, name: string, avatar: string) => {
  return `
  <div class="checked-member__wrapper d-flex align-items-center justify-content-between" user-id=${ID}>
    <div class="checked-member d-flex flex-column align-items-center">
      <div class="checked-member__avatar">${avatar}</div>
      <div class="checked-member__name">${name}</div>
    </div>
    <input class="checked-member__sum checked-member__sum--evenly form-control form-control-sm" type="text">
    <textarea class="checked-member__comment form-control" placeholder=${i18n._('Comment')}></textarea>
  </div>
  `;
};