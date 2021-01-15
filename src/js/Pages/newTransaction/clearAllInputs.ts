export const clearAllInputs = (): void => {
  const allForms: HTMLElement = document.querySelector('.all-forms');
  const formFields: NodeListOf<HTMLFormElement> = allForms.querySelectorAll('input, textarea');
  const userAvatars: NodeListOf<HTMLFormElement> = document.querySelectorAll('.member__avatar');
  const checkedMembersList: HTMLElement = document.querySelector('.checked-members');
  
  userAvatars.forEach((avatar: HTMLElement) => {
    avatar.classList.remove('checked');
  });

  formFields.forEach((form: HTMLFormElement) => {
     form.value = '';
  });

  checkedMembersList.innerHTML = '';

  document.querySelector('.add-check__icon-wrapper').classList.add('hidden');

};