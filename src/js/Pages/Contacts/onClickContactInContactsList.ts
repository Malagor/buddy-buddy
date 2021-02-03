export const onClickContactInContactsList = (selector: string | null = null): void => {
  const contactList = document.querySelector(`${selector ? selector : '.contacts-user-list'}`);
  contactList.addEventListener('click', event => {

    const { target }: any = event;

    if (target.closest('.contact-list__item')) {
      const item: HTMLElement = target.closest('.contact-list__item');
      const formRecipient: HTMLInputElement = document.querySelector('#activeContact');
      const idInput: HTMLInputElement = document.querySelector('.contact-user-id');

      const name = item.querySelector('.contact-list__name').textContent;
      const account = item.querySelector('.contact-list__account').textContent;

      formRecipient.value = `${name} ${account}`;
      idInput.value = item.getAttribute('data-user-id');
    }
  });
};
