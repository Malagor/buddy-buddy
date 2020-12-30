import 'material-components-web';
import 'material-components-web/dist/material-components-web.min.css';

import { App } from './js/Components/App/App';


import './scss/basic-styles.scss';
import './js/Pages/stylePages';


import {MDCTopAppBar} from '@material/top-app-bar';
import {MDCDrawer} from '@material/drawer';



App.create();


// document.addEventListener('click', (e) => {
//   const { target }: any  = e;
//
//   // Sidebar toggle
//   const sidebar = document.querySelector('aside.sidebar');
//   if (target.closest('.sidebat-toggle')) {
//     sidebar.classList.toggle('open');
//   }
//   if (!target.closest('.sidebat-toggle') && !target.closest('.sidebar')) {
//     sidebar.classList.remove('open');
//   }
// });

const drawer = MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));

const topAppBar = MDCTopAppBar.attachTo(document.getElementById('app-bar'));
topAppBar.setScrollTarget(document.getElementById('main-content'));

topAppBar.listen('MDCTopAppBar:nav', () => {
  drawer.open = !drawer.open;
});
