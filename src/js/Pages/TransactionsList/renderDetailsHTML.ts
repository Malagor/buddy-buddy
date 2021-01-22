export const renderDetailsHTML = (trans: any, date: any, styles: any,) => {
   return `
   <div class="details__header modal-header">
     <h5 class="details__descr modal-title fw-bolder">${trans.description}</h5>
     <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
   </div>
   <div class="details__info modal-body">

     <div class="details__date d-flex">
       <div class="details__day">${date.localeDay}</div>
       <div class="details__time">${date.localeTime}</div>
     </div>

     <div class="details__group"></div>
 
     <div class="${styles.ownerDisplay} details__owner d-flex align-items-center">
       <div>Плательщик: </div>
       <div class="details__owner-info d-flex flex-column align-items-center">
       </div>
     </div>

     <div class="details__cost">
       <span>Сумма:</span>&nbsp;
       <span class="fs-5 ${styles.colorText}">${styles.cost}</span>&nbsp;
       <span class="fs-5 ${styles.colorText}">${trans.currency}</span>
     </div>

     <div class="${styles.commentDisplay} details__comment-box d-flex">
       <div>Комментарий: </div>
       <div class="details__comment">${styles.ownComment}</div>
     </div>
   
     <div class="${styles.checkDisplay} details__check align-items-center d-flex">
       <div>Чек: </div>
       <div class="details__icon-wrapper"><img class="details__icon" src=${trans.photo[0]} alt="check"></div>
     </div>

     <div class="${styles.selectDisplay} details__state-wrapper">       
       <select class="details__state form-select" aria-label="Default select example">
         <option value="pending">ожидание</option>
         <option value="approve">подтвердить</option>
         <option value="abort">отклонить</option>
       </select>
     </div>

     <div class="modal fade details__check-modal" id="check" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
       <div class="modal-dialog modal-dialog-centered">
         <div class="modal-content p-2 d-flex flex-column">
             <button type="button" class="btn-close align-self-end details__close-check" aria-label="Close"></button>
             <div class="p-2 details__check-box">
             </div>
         </div>
       </div>
     </div>

   </div>
   <div class="${styles.membDisplay} details__members modal-body">
   </div>
   <button class=" ${styles.membDisplay} details__add-memb btn btn-secondary btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#notMembers">Добавить участников</button>
   <div class=" ${styles.membDisplay} details__not-members modal-body collapse" id="notMembers">
   </div>
   <div class="modal-footer ${styles.btnSaveDisplay}">
     <button type="button" class="details__delete btn btn-danger">Удалить</button>
     <button type="button" class="details__save btn btn-primary">Сохранить</button>
   </div>
 `;
}