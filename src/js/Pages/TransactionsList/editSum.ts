export const editSum = (trans: any, wrapper: HTMLElement, membInput?: HTMLInputElement) => {

  const membersWrapper: HTMLElement = wrapper.querySelector('.details__members');
  const fixedSums = membersWrapper.querySelectorAll('.fixed');
  const nonFixedSums = membersWrapper.querySelectorAll('.non-fixed');
  console.log ('fixedSums', fixedSums);
  console.log ('nonfixedSums', nonFixedSums);
  console.log ('totalcost', typeof trans.totalCost);
  const btnSaveEdit = wrapper.querySelector('.details__save');
  if (nonFixedSums) {
    const numb: number = nonFixedSums.length;
    let sumOfFixed: number = 0;
    fixedSums.forEach((sum: HTMLFormElement) => {
      sumOfFixed += +sum.value;
    });
    const restSum: number = +((+trans.totalCost - sumOfFixed) / numb).toFixed(2);
    if (restSum > 0) {
      nonFixedSums.forEach((sum: HTMLFormElement) => {
        sum.value = +restSum.toFixed(2);
        if (membInput && (trans.totalCost - (sumOfFixed + restSum * numb)) < 0.01) {
          membInput.classList.remove('text-danger');
          btnSaveEdit.classList.remove('disabled');
        }
      });
    } else {
      membInput.classList.add('text-danger');
      btnSaveEdit.classList.add('disabled');
    }
  }

};