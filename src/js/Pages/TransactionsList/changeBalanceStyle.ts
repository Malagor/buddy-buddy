export const changeBalanceStyle = (bal: number, balanceElement: HTMLElement) => {
  if (bal >= 0) {
    balanceElement.classList.add('text-success');
    balanceElement.classList.remove('text-danger');


   } else {
    balanceElement.classList.add('text-danger');
    balanceElement.classList.remove('text-success');
   }
};