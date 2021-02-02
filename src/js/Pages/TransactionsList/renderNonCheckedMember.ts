import { i18n } from '@lingui/core';
import { messagesRU } from '../../languages/RU/messages';
import { messagesENG } from '../../languages/ENG/messages';
import { loadLanguage } from '../../Util/saveLoadLanguage';
i18n.load('RU', messagesRU);
i18n.load('ENG', messagesENG);

const locale = loadLanguage();
i18n.activate(locale);

export const renderNonCheckedMember = (user: any) => {
  return `
    <div class="details__member d-flex flex-column align-items-center">
      <div class="details__avatar"><img src="${user.avatar}" alt=${user.name}></div>
      <div class="details__name">${user.name}</div>
    </div>
    <input class="details__member-cost form-control form-control-sm non-fixed d-none" type="text" value="">
    <textarea class="details__member-comment form-control d-none" placeholder="Комментарий"></textarea>
    <div class="details__member-state d-flex justify-content-center d-none"></div>
    <button class="details__member-delete btn btn-outline-secondary btn-sm ms-3"><i class="material-icons">add</i></button>
  `;
};