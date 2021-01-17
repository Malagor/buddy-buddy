export const checkData = () => {
  const createTransBtn: HTMLFormElement = document.querySelector('.new-trans__create-btn');
  const descrInput: HTMLFormElement = document.querySelector('.new-trans__descr');
  const sumInput: HTMLFormElement = document.querySelector('.new-trans__total-sum');
  const sumInputs: NodeListOf<HTMLFormElement> = document.querySelectorAll('.checked-member__sum');
  if (sumInputs) {
    let sum = 0;
    let isZero = 0;
    sumInputs.forEach((input: HTMLFormElement) => {
      sum += input.value ? +input.value : +input.getAttribute('placeholder');
      if (+input.getAttribute('placeholder') === 0) {
        isZero += 1;
      }
    });

    if (+sumInput.value > 0 && descrInput.value.length > 0 && Math.abs(+sumInput.value - sum) < 1
        && isZero === 0) {
      createTransBtn.removeAttribute('disabled');
    } else {
      createTransBtn.setAttribute('disabled', 'true');
    }

  } else return;
};
