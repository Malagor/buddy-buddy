export const show = (element: HTMLElement, show: boolean = true): void => {
  if (show) {
    setTimeout(() => {
      element.classList.add('show');
    }, 300);
  } else {
    element.classList.remove('show');
  }
};
