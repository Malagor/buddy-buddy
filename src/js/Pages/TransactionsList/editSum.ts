export const editSum = (trans: any, wrapper: HTMLElement, membInput?: HTMLInputElement) => {

  const membersWrapper: HTMLElement = wrapper.querySelector('.details__members');
  const fixedSums = membersWrapper.querySelectorAll('.fixed');
  const nonFixedSums = membersWrapper.querySelectorAll('.non-fixed');
  const btnSaveEdit = wrapper.querySelector('.details__save');
  console.log ('fixed',fixedSums );
  console.log ('nonfixed',nonFixedSums );
  if(membersWrapper.innerHTML === '') {
    console.log ('true');
    btnSaveEdit.classList.add('disabled');
    return;
  } 
  if (nonFixedSums.length > 0) {
    const numb: number = nonFixedSums.length;
    let sumOfFixed: number = 0;
    fixedSums.forEach((sum: HTMLFormElement) => {
      sumOfFixed += +sum.value;
    });
    const restSum: number = +((+trans.totalCost - sumOfFixed) / numb).toFixed(2);
    if (restSum > 0) {
      console.log('rest', restSum);
      nonFixedSums.forEach((sum: HTMLFormElement) => {
        sum.value = +restSum.toFixed(2);
        if (membInput && (trans.totalCost - (sumOfFixed + restSum * numb)) < 0.005) {
          membInput.classList.remove('text-danger');
          btnSaveEdit.classList.remove('disabled');
        }
      });
    } else {
      membInput.classList.add('text-danger');
      btnSaveEdit.classList.add('disabled');
    }
  } else {
    let sumOfFixed: number = 0;
    fixedSums.forEach((sum: HTMLFormElement) => {
      sumOfFixed += +sum.value;
    });
    const restSum: number = +(+trans.totalCost - sumOfFixed).toFixed(2);
    if (Math.abs(restSum) <= 0.005) {
      membInput.classList.remove('text-danger');
      btnSaveEdit.classList.remove('disabled');
    } else {
      membInput.classList.add('text-danger');
      btnSaveEdit.classList.add('disabled');
    }
  } 

};