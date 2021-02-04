import { checkData } from './checkData';

export const divideSum = () => {
  const sumInput: HTMLFormElement = document.querySelector('.new-trans__total-sum');
  const membersSumInputs = document.querySelectorAll('.checked-member__sum');
  let membersSumEvenly: any = document.querySelectorAll('.checked-member__sum--evenly');
  let membersSumNotEvenly: any = document.querySelectorAll('.checked-member__sum--notevenly');
  let numbOfmembers: number = membersSumEvenly.length;

  membersSumInputs.forEach((memberSum: HTMLInputElement) => {
    memberSum.addEventListener('keyup', () => {
      if (typeof +memberSum.value === 'number' && +memberSum.value > 0) {
        memberSum.classList.remove('checked-member__sum--evenly');
        memberSum.classList.add('checked-member__sum--notevenly');
      } else if (+memberSum.value === 0)  {
        memberSum.classList.add('checked-member__sum--evenly');
        memberSum.classList.remove('checked-member__sum--notevenly');
      } else return;

      membersSumEvenly = document.querySelectorAll('.checked-member__sum--evenly');
      numbOfmembers = membersSumEvenly.length;
      membersSumNotEvenly = document.querySelectorAll('.checked-member__sum--notevenly');

      let sumNotEvenly: number = 0;
      membersSumNotEvenly.forEach((input: any) => {
        sumNotEvenly += +input.value;
      });
      const totalSum = (+sumInput.value) - sumNotEvenly;

      if (totalSum >= 0) {
        memberSum.style.color = 'black';
        membersSumEvenly.forEach((input: HTMLFormElement) => {
          input.setAttribute('placeholder', `${(totalSum / numbOfmembers)}`);
        });
      } else {
        memberSum.style.color = 'red';
        membersSumEvenly.forEach((input: HTMLFormElement) => {
          input.setAttribute('placeholder', '0.00');
        });
      }

      checkData();
    });
  });


  membersSumEvenly = document.querySelectorAll('.checked-member__sum--evenly');
  numbOfmembers = membersSumEvenly.length;
  membersSumNotEvenly = document.querySelectorAll('.checked-member__sum--notevenly');

  let sumNotEvenly: number = 0;
  membersSumNotEvenly.forEach((input: any) => {
    sumNotEvenly += +input.value;
  });
  const totalSum = (+sumInput.value) - sumNotEvenly;

  if (totalSum >= 0) {
    membersSumEvenly.forEach((input: HTMLFormElement) => {
      input.setAttribute('placeholder', `${(totalSum / numbOfmembers)}`);
    });
  } else {
    membersSumEvenly.forEach((input: HTMLFormElement) => {
      input.setAttribute('placeholder', '0.00');
    });
  }
};


