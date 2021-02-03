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
      formData[field.name] = field.value.trim();
      if (field.type === 'file') {
        const file = field.files[0];
        if (!file) {
          formData[field.name] = imageElement.src;
        } else {
          formData[field.name] = file;
          const reader: FileReader = new FileReader();
          reader.onload = (function (aImg: HTMLImageElement) {
            return (e: any): void => {
              aImg.src = e.target.result;
            };
          })(imageElement);
          reader.readAsDataURL(file);
        }
      }
    }
  });
  return formData;
};