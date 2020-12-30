export const show = (element: HTMLElement, show: boolean = true): void => {
  if (show) {
    setTimeout(() => {
      // element.classList.add('show');
      element.removeAttribute('hidden');

    }, 300);
  } else {
    element.setAttribute('hidden', 'false');
  }
};
