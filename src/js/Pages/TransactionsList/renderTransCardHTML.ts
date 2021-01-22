export const renderTransCardHTML = (trans: any, date: any, styles:any ) => {
  return `
  <p class="trans-item__header align-self-start row">
    <span class="trans-item__descr fw-bolder text-truncate">${trans.description}</span>
  </p>
  <div class="trans-item__info row">
    <div class="date col-3 align-self-start">
      <div class="trans-item__day">${date.localeDay}</div>
      <div class="trans-item__time">${date.localeTime}</div>
    </div>
    <div class="trans-item__users col-5  d-flex align-self-center justify-content-center"></div>
    <div class="trans-item__cost col-4  align-self-center ${styles.colorCost}  justify-content-end text-end">${styles.cost} ${trans.currency}</div>
  </div>
  <div class="trans-item__buttons d-flex w-100 justify-content-between">
    <div></div>
    <div class="trans-item__addform ${styles.btnDisplay}">
      <select class="trans-item__state form-select" aria-label="Default select example">
        <option ${styles.selectPending} value="pending">ожидание</option>
        <option ${styles.selectApprove} value="approve">подтвердить</option>
        <option ${styles.selectAbort} value="abort">отклонить</option>
      </select>
    </div>
  </div>
`;

}
