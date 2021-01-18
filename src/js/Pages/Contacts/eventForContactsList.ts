export const eventForContactsList = (input: HTMLInputElement) => {
  input.onkeyup = () => {
    const li: NodeListOf<Element> = document.querySelectorAll('.contact-list__item');
    const val: string = input.value.toLowerCase();

    if (val.length > 1) {
      li.forEach(item => {
        const isValInName = item.querySelector('.contact-list__name').textContent.toLowerCase().includes(val);
        const isValInAccount = item.querySelector('.contact-list__account').textContent.toLowerCase().includes(val);

        item.setAttribute('hidden', '');
        if (isValInName || isValInAccount) {
          item.removeAttribute('hidden');
        }
      });
    } else {
      li.forEach(item => {
        item.removeAttribute('hidden');
      });
    }
  };
};
