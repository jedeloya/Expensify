import API from './api.js';
import CONST from './CONST.js';
import modal from './modal.js';
import Table from './table.js';

/**
 * Setup Login, signup and logout buttons
 */
function initLoginButtons() {
    const user = sessionStorage.getItem('user');
    if (user) {
        const username = JSON.parse(user).name;
        document.getElementById(CONST.LOGIN_BUTTON_ID).style.display = 'none';
        document.getElementById(CONST.SIGNUP_BUTTON_ID).style.display = 'none';
        document.getElementById(CONST.LOGGED_USERNAME_ID).style.display = 'block';
        document.getElementById(CONST.LOGGED_USERNAME_ID).innerHTML = "Welcome " + username;
        document.getElementById(CONST.LOGOUT_BUTTON_ID).style.display = 'block';
    } else {
        document.getElementById(CONST.LOGIN_BUTTON_ID).style.display = 'block';
        document.getElementById(CONST.SIGNUP_BUTTON_ID).style.display = 'block';
        document.getElementById(CONST.LOGGED_USERNAME_ID).style.display = 'none';
        document.getElementById(CONST.LOGOUT_BUTTON_ID).style.display = 'none';
    }
}
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
    return { username, password };;
}

/**
 * Setup submit event handler for the sign up form.
 */
function initSignupForm() {
    document.getElementById(CONST.SIGNUP_FORM_ID)
        .addEventListener('submit', async (e) => {
            e.preventDefault();
            sessionStorage.removeItem('user');
            const { username, password } = getUsernameAndPassword(CONST.SIGNUP_FORM_ID);
            const email = username;
            const name = document.querySelector(`#${CONST.SIGNUP_FORM_ID} input[name=name]`).value;
            try {
                const userdata = await API.signup(email, password, name);
                if (!userdata.error) {
                    sessionStorage.setItem('user', JSON.stringify(userdata));
                }
                initLoginButtons();
            } finally {
                document.getElementById(CONST.SIGNUP_FORM_ID).reset();
                modal.hide(CONST.SIGNUP_MODAL_ID);
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
            sessionStorage.removeItem('user');
            const { username, password } = getUsernameAndPassword(CONST.LOGIN_FORM_ID);
            try {
                const email = username
                const userdata = await API.login(email, password);
                console.log(userdata);
                if (!userdata.error) {
                    sessionStorage.setItem('user', JSON.stringify(userdata));
                }
                initLoginButtons();
            } finally {
                document.getElementById(CONST.LOGIN_FORM_ID).reset();
                modal.hide(CONST.LOGIN_MODAL_ID);
            }
        });
}

/**
 * Setup logout event handler to make logout.
 */
function initLogout() {
    document.getElementById(CONST.LOGOUT_BUTTON_ID)
        .addEventListener('click', async (e) => {
            sessionStorage.removeItem('user');
            initLoginButtons();
        });
}

/**
 * Initialize submit handlers for all forms.
 */
function init() {
    initLoginButtons();
    initLogout();
    initCreateTodoForm();
    initSignupForm();
    initLoginForm();
}

export default { init };

