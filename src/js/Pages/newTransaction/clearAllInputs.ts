export const clearAllInputs = (): void => {
  const allForms: HTMLElement = document.querySelector('.all-forms');
  const formFields: NodeListOf<HTMLFormElement> = allForms.querySelectorAll('input, textarea');
  console.log ('formFields', formFields);

  formFields.forEach((form: HTMLFormElement) => {
     form.value = '';
  });

  const checkedMembersList: HTMLElement = document.querySelector('.checked-members');
  checkedMembersList.innerHTML = '';

  document.querySelector('.add-check__icon-wrapper').classList.add('hidden');

};