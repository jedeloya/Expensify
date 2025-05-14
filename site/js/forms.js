import API from './api.js';
import CONST from './CONST.js';
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
    } else {
        document.getElementById(CONST.LOGIN_BUTTON_ID).style.display = 'block';
        document.getElementById(CONST.SIGNUP_BUTTON_ID).style.display = 'block';
        document.getElementById(CONST.LOGGED_USERNAME_ID).style.display = 'none';
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
            const { email, password } = getUsernameAndPassword(CONST.SIGNUP_FORM_ID);
            const name = document.querySelector(`#${CONST.SIGNUP_FORM_ID} input[name=name]`).value;
            try {
                const userdata = await API.signup(email, password, name);
                console.log(userdata);
                sessionStorage.setItem('user', JSON.stringify(userdata));
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
            sessionStorage.removeItem('user');
            const { username, password } = getUsernameAndPassword(CONST.LOGIN_FORM_ID);
            try {
                const userdata = await API.login(username, password);
                sessionStorage.setItem('user', JSON.stringify(userdata));
            } finally {
                document.getElementById(CONST.LOGIN_FORM_ID).reset();
            }
        });
}

/**
 * Initialize submit handlers for all forms.
 */
function init() {
    initLoginButtons();
    initCreateTodoForm();
    initSignupForm();
    initLoginForm();
}

export default { init };

