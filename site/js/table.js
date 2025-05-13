import API from './api.js';
import CONST from './CONST.js';

/**
 * Generate the html tr for a table item
 *
 * @param {string} todoID
 * @param {string} description
 * @param {boolean} completed
 * @returns {string}
 */
function createTableItem(todoID, description, completed) {
    return `<tr>
                <td>${todoID}</td>
                <td>${description}</td>
                <td><input type="checkbox" ${completed ? 'checked' : ''}</td>
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
        tableRows += createTableItem(el.todoID, el.description, el.completed);
    });
    document.querySelector(`#${CONST.TODO_TABLE_ID} tbody`).innerHTML = tableRows;
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
    document.querySelector(`#${CONST.TODO_TABLE_ID} tbody`).innerHTML += createTableItem(todoItem.todoID, todoItem.description, todoItem.completed ?? false);
    console.log(`[Table] Inserted new todo w/ ID ${todoItem.todoID} into the table`);
}

export default {
    init,
    insertItem,
};
