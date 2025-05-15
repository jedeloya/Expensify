import API from './api.js';
import CONST from './CONST.js';
import Modal from './modal.js';

/**
 * Init Checkboxes onclick functions to send the correct update request.
 * 
 * @returns {Promise<void>}
 */
function initCheckboxes() {
    const checkboxes = document.querySelectorAll('.todo-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.onclick = async function () {
            console.log('Clicked');
            try{
                const user = sessionStorage.getItem('user');
                const accountID = user ? JSON.parse(user).accountID : '';
                const todoID = this.dataset.id;
                const completed = this.checked;
                await API.updateToDoItem(accountID, todoID, completed);
                Modal.showMessage("Todo item was updated");
            } catch(e) {
                Modal.showMessage("Error on updating the todo item", true);
            }
        }
    })
}
/**
 * Generate the html tr for a table item
 *
 * @param {string} todoID
 * @param {string} description
 * @param {boolean} completed
 * @returns {string}
 */
function createTableItem(todoID, description, completed, name, accountId) {
    const user = sessionStorage.getItem('user');
    const sessionAccountID = user ? JSON.parse(user).accountID : "";
    return `<tr>
                <td>${todoID}</td>
                <td>${description}</td>
                <td>${name}</td>
                <td><input type="checkbox" class="todo-checkbox" data-id="${todoID}" ${accountId == sessionAccountID ? 'enabled' : 'disabled'} ${completed ? 'checked' : ''}></td>
            </tr>`;
}

/**
 * Load table items from api and fill the table.
 *
 * @returns {Promise<void>}
 */
async function init() {
    const todoItems = await API.getToDoItems();
    console.log(`[Table] Inserting ${todoItems.length} todos into the table`);
    let tableRows = "";
    todoItems.forEach(el => {
        // console.log("Data", el);
        tableRows += createTableItem(el.todoID, el.description, el.completed ?? false, el.userName, el.accountID);
    });
    document.querySelector(`#${CONST.TODO_TABLE_ID} tbody`).innerHTML = tableRows;
    initCheckboxes();
}

/**
 * Insert a new table item into the table.
 *
 * @param {object} todoItem
 * @param {string} todoItem.todoID
 * @param {string} todoItem.description
 * @param {boolean} [todoItem.completed]
 */
function insertItem(todoItem) {
    document.querySelector(`#${CONST.TODO_TABLE_ID} tbody`).innerHTML += createTableItem(todoItem.todoID, todoItem.description, todoItem.completed ?? false, todoItem.userName ?? "", todoItem.accountID ?? "");
    initCheckboxes();
    // console.log(`[Table] Inserted new todo w/ ID ${todoItem.todoID} into the table`);
}

export default {
    init,
    insertItem,
};
