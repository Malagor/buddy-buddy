export const getFormData = (formElement: Element) => {
  // const form = document.querySelector(formElement);
  const formFields = formElement.querySelectorAll('input, select');

  const formData = {};
  formFields.forEach((el: { name: any; value: any; }) => {
    formData[(el.name)] = el.value;
  });

  return formData;
};
