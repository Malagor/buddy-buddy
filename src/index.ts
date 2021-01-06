import { App } from './js/Classes/App';
// import {MDCTopAppBar} from '@material/top-app-bar';
// import {MDCDrawer} from '@material/drawer';

// import 'material-components-web';
// import 'material-components-web/dist/material-components-web.min.css';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import './scss/basic-styles.scss';
import './js/Pages/stylePages';



App.create();

// const drawer = MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
// const topAppBar = MDCTopAppBar.attachTo(document.getElementById('app-bar'));
// topAppBar.setScrollTarget(document.getElementById('main-content'));
// topAppBar.listen('MDCTopAppBar:nav', () => {
//   drawer.open = !drawer.open;
// });
