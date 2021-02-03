import { i18n } from '@lingui/core';
import { messagesRU } from '../../languages/RU/messages';
import { messagesENG } from '../../languages/ENG/messages';
import { loadLanguage } from '../../Util/saveLoadLanguage';
i18n.load('RU', messagesRU);
i18n.load('ENG', messagesENG);

const locale = loadLanguage();
i18n.activate(locale);

export const addMemberHTML = (ID: string, name: string, avatar: string) => {
  return `
  <div class="checked-member__wrapper d-flex align-items-center justify-content-between" user-id="${ID}">
    <div class="checked-member d-flex flex-column align-items-center">
      <div class="checked-member__avatar">${avatar}</div>
      <div class="checked-member__name">${name}</div>
    </div>
    <input class="checked-member__sum checked-member__sum--evenly form-control form-control-sm" type="text">
    <textarea class="checked-member__comment form-control" placeholder=${i18n._('Comment')}></textarea>
  </div>
  `;
};
