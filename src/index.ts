// Resources
// Main components
// import 'framework7/css/framework7.bundle.min.css';
import { App } from './js/Components/App/App';

import './scss/basic-styles.scss';

App.create();


document.addEventListener('click', (e) => {
  const { target } = e;

  // Sidebar toggle
  const sidebar = document.querySelector('aside.sidebar');
  if (target.closest('.sidebat-toggle')) {
    sidebar.classList.toggle('open');
  }
  if (!target.closest('.sidebat-toggle') && !target.closest('.sidebar')) {
    sidebar.classList.remove('open');
  }
});


