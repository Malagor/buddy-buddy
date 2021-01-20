export const getFormData = (
  formElement: HTMLFormElement,
  imageElement?: HTMLImageElement,
): any => {
  const formFields: NodeListOf<HTMLFormElement> = formElement.querySelectorAll(
    'input, select, textarea',
  );

  const formData: { [key: string]: any } = {};

  formFields.forEach((field) => {
    if (
      field.type !== 'submit' &&
      field.type !== 'button' &&
      field.type !== 'reset'
    ) {
      formData[field.name] = field.value;
      if (field.type === 'file') {

        const reader: FileReader = new FileReader();
        reader.onload = (function (aImg: HTMLImageElement) {
          return (e: any): void => {
            aImg.src = e.target.result;
            const file = field.files[0];
            formData[field.name] = file;
          };
        })(imageElement);
        reader.readAsDataURL(field.files[0]);
      }
    }
  });
  console.log('getFormData - formData:', formData);
  return formData;
};