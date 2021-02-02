import { i18n } from '@lingui/core';
import { transactionsRU } from '../../languages/RU/transactions';
import { transactionsENG} from '../../languages/ENG/transactions';
import { loadLanguage } from '../../Util/saveLoadLanguage';

i18n.load('RU', transactionsRU);
i18n.load('ENG', transactionsENG);

const locale = loadLanguage();
i18n.activate(locale);

export const renderTransListHTML = () => {
   return `
   <div class="block__wrapper">
     <div class="block__content">
       <div class="translist__header translist__header--main">
         <p class="block__title">${i18n._('Transactions list')}</p>
       </div>

       <div class="block__groups block--width-85">
         <select class="trans-list__groups form-select" aria-label="Default select example">
           <option value="all-trans">${i18n._('All')}</option>
         </select>
         <div class="trans-list__user-balance text-center"></div>
       </div>

       <div class="trans-list__list">
       </div>

       <div class="block__footer">
         <button class="new-trans-btn btn btn-primary btn-primary-alternate" data-bs-toggle="modal" data-bs-target="#new-trans-modal">${i18n._('New transaction')}</button>
       </div>
     </div>
   </div>

   <div class="modal fade new-trans__modal" id="new-trans-modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
     <div class="modal-wrapper modal-dialog modal-dialog-centered modal-dialog-scrollable">
     </div>
   </div>

   <div class="details modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
     <div class="modal-dialog modal-dialog-centered">
       <div class="modal-content details__wrapper">
       </div>
     </div>
   </div>
   `;
};
