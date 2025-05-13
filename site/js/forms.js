import API from './api.js';
import CONST from './CONST.js';
import Table from './table.js';

/**
 * Setup submit event handler for the create todo form.
 */
function initCreateTodoForm() {
    document.getElementById(CONST.CREATE_TODO_FORM_ID)
        .addEventListener('submit', async (e) => {
            // Prevent default so we don't reload the screen
            e.preventDefault();

            // Insert the new item in the DB and add it to the table
            const description = document.querySelector(`#${CONST.CREATE_TODO_FORM_ID} input[name=description]`).value;

            try {
                const todoItem = await API.createToDoItem(description);
                Table.insertItem(todoItem);
            } finally {
                // Reset the form
                document.getElementById(CONST.CREATE_TODO_FORM_ID).reset();
            }
        });
}

/**
 * Helper for sign up and login forms
 */
function getUsernameAndPassword(formID) {
    const username = document.querySelector(`#${formID} input[name=username]`).value;
    const password = document.querySelector(`#${formID} input[name=password]`).value;
    return {username, password};;
}

/**
 * Setup submit event handler for the sign up form.
 */
function initSignupForm() {
    document.getElementById(CONST.SIGNUP_FORM_ID)
        .addEventListener('submit', async (e) => {
            e.preventDefault();
            const {username, password} = getUsernameAndPassword(CONST.SIGNUP_FORM_ID);
            try {
                await API.signup(username, password);
            } finally {
                document.getElementById(CONST.SIGNUP_FORM_ID).reset();
            }
        });
}

/**
 * Setup submit event handler for the login form
 */
function initLoginForm() {
    document.getElementById(CONST.LOGIN_FORM_ID)
        .addEventListener('submit', async (e) => {
            e.preventDefault();
            const {username, password} = getUsernameAndPassword(CONST.LOGIN_FORM_ID);
            try {
                await API.login(username, password);
            } finally {
                document.getElementById(CONST.LOGIN_FORM_ID).reset();
            }
        });
}

/**
 * Initialize submit handlers for all forms.
 */
function init() {
   initCreateTodoForm();
   initSignupForm();
   initLoginForm();
}

export default {init};

