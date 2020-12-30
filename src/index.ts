import { App } from './js/Components/App/App';

import './scss/basic-styles.scss';
import './js/Pages/stylePages';

App.create();


document.addEventListener('click', (e) => {
  const { target }: any  = e;

  // Sidebar toggle
  const sidebar = document.querySelector('aside.sidebar');
  if (target.closest('.sidebat-toggle')) {
    sidebar.classList.toggle('open');
  }
  if (!target.closest('.sidebat-toggle') && !target.closest('.sidebar')) {
    sidebar.classList.remove('open');
  }
});


