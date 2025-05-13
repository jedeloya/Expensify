import API from './api.js';
import CONST from './CONST.js';
import Forms from './forms.js';
import Modal from './modal.js';
import Table from './table.js';

// Event listeners
document.getElementById(CONST.LOGIN_BUTTON_ID).addEventListener('click', () => Modal.show(CONST.LOGIN_MODAL_ID));
document.getElementById(CONST.SIGNUP_BUTTON_ID).addEventListener('click', () => Modal.show(CONST.SIGNUP_MODAL_ID));

// Page load
Forms.init();
Modal.init();
Table.init();

