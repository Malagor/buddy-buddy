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
          <option ${styles.selectPending} value="pending">ожидание</option>
          <option ${styles.selectApprove} value="approve">подтвердить</option>
          <option ${styles.selectAbort} value="abort">отклонить</option>
        </select>
      </div>
    </div>
  </div>

`;

};
