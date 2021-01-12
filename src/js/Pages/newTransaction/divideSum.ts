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
      console.log ('totalSum', totalSum);

      if (totalSum >= 0) {
        membersSumEvenly.forEach((input: HTMLFormElement) => {
          input.setAttribute('placeholder', `${(totalSum / numbOfmembers).toFixed(2)}`);
          // input.value = (totalSum / numbOfmembers).toFixed(2);
        });
      } else {
        membersSumInputs.forEach((input: HTMLFormElement) => {
          input.setAttribute('placeholder', '0.00');
          // input.value = '';
        });
      }

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
  console.log ('totalSum', totalSum);

  if (totalSum >= 0) {
    membersSumEvenly.forEach((input: HTMLFormElement) => {
      input.setAttribute('placeholder', `${(totalSum / numbOfmembers).toFixed(2)}`);
      // input.value = (totalSum / numbOfmembers).toFixed(2);
    });
  } else {
    membersSumInputs.forEach((input: HTMLFormElement) => {
      input.setAttribute('placeholder', '0.00');
    
      // input.value = '';
    });
  }

  
};


// const checkData = ():void => {
//   const createTransBtn = document.querySelector('.new-trans__create-btn');
//   const descrInput: HTMLFormElement = document.querySelector('.new-trans__descr');
//   const sumInput: HTMLFormElement = document.querySelector('.new-trans__total-sum');
//   const sumInputs: NodeListOf<HTMLFormElement> = document.querySelectorAll('.checked-member__sum');
//   let sum = 0;
//   sumInputs.forEach((input: HTMLFormElement) => {
//     sum += input.value ? +(input.value) : +input.getAttribute('placeholder');
//   });
//   const inputsRequired: NodeListOf<HTMLFormElement> = document.querySelectorAll('.input-required');
//   inputsRequired.forEach((input: HTMLFormElement) => {
//     input.addEventListener('input', () => {
//       console.log (+sumInput.value);
//       console.log (descrInput.value.length);
//       console.log (sum);
//       if (+sumInput.value > 0 && descrInput.value.length > 0 ) {
//         console.log ('true');
//         createTransBtn.removeAttribute('disabled');
//       } else {
//         console.log ('false');
//         createTransBtn.setAttribute('disabled', 'true');
//       }
//     });
//   })
// };