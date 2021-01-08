export const getFormData = (formElement: HTMLFormElement): any => {

  const formFields: NodeListOf<HTMLFormElement> = formElement.querySelectorAll('input, select');

  const formData: { [key: string]: any } = {};

  formFields.forEach(field => {
    if (field.type !== 'submit' && field.type !== 'button' && field.type !== 'reset') {
      formData[field.name] = field.value;
    }
  });

  console.log('getFormData - formData:', formData);

  return formData;
};
