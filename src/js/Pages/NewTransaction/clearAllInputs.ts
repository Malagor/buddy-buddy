export const clearAllInputs = (): void => {
  const allForms: HTMLElement = document.querySelector('.all-forms');
  const formFields: NodeListOf<HTMLFormElement> = allForms.querySelectorAll('input, textarea');
  const userAvatars: NodeListOf<HTMLFormElement> = document.querySelectorAll('.member__avatar');
  const checkedMembersList: HTMLElement = document.querySelector('.checked-members');
  const checksWrapper: HTMLElement = document.querySelector('.add-check__check-box');
  const currInput: HTMLInputElement = document.querySelector('.new-trans__currency-list');
  const currList: HTMLElement = document.querySelector('.new-trans__curr-list');
  const currency: HTMLElement = currList.querySelector('.curr--active-curr');

  userAvatars.forEach((avatar: HTMLElement) => {
    avatar.classList.remove('checked');
  });

  formFields.forEach((form: HTMLFormElement) => {
     form.value = '';
  });

  checkedMembersList.innerHTML = '';
  checksWrapper.innerHTML = '';

  currInput.value = currency.textContent;

  document.querySelector('.add-check__icon-wrapper').classList.add('hidden');

};