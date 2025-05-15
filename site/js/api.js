const HTTP_METHOD = {
    GET: 'GET',
    POST: 'POST',
};

/**
 * The API only accepts multipart/formdata. This converts a JS object to a FormData object.
 *
 * @param {object} body 
 * @returns {FormData}
 */
function createFormData(body) {
    const payload = new FormData();
    Object.entries(body).forEach(([key, value]) => payload.append(key, value));
    return payload;
}

/**
 * Perform an API request.
 *
 * @param {string} command
 * @param {string} method
 * @param {object} [body] 
 * @returns {Promise}
 */
async function apiRequest(command, method, body = {}) {
    try {
        const urlParams = new URLSearchParams({
            command,
        });

        const response = await fetch(`/php/api.php?${urlParams.toString()}`, {
            method,
            body: method === HTTP_METHOD.POST ? createFormData(body) : undefined,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (e) {
        console.error(`Error executing API call ${command}`, e);
        return Promise.reject(`Error executing API call ${command}`);
    }
}

const API = {
    /**
     * Create a Todo.
     *
     * @param {string} description
     * @returns {Promise<{todoID: string, description: string, completed: boolean, userName: string}>}
     */
    createToDoItem: async (description) => apiRequest(
        'CreateToDoItem',
        HTTP_METHOD.POST,
        { description }
    ),

    /**
     * Create a Todo.
     *
     * @param {string} description
     * @param {int} sessionAccountID
     * @returns {Promise<{todoID: string, description: string, completed: boolean, userName: string}>}
     */
    createToDoItem: async (description, sessionAccountID) => apiRequest(
        'CreateToDoItem',
        HTTP_METHOD.POST,
        { 
            description,
            sessionAccountID
        }
    ),

    /**
     * Get Todos.
     *
     * @returns {Promise<Array<{todoID: string, description: string, completed: boolean, userName: string}>>}
     */
    getToDoItems: async () => apiRequest('GetToDoItems', HTTP_METHOD.GET),

    /**
     * Log in.
     *
     * @param {string} email
     * @param {string} password
     * @returns {Promise<{accountID: int, email: string, name: string}>}
     */
    login: async (email, password) => apiRequest('GetAccount', HTTP_METHOD.POST, {
        email,
        password,
    }),

    /**
     * Sign up.
     *
     * @param {string} email
     * @param {string} password
     * @param {string} name
     * @returns {Promise<{accountID: int, email: string, name: string}>}
     */
    signup: async (email, password, name) => apiRequest('CreateAccount', HTTP_METHOD.POST, {
        email,
        password,
        name,
    }),

    /**
     * Update ToDo
     * 
     * @param {int} accountID
     * @param {int} todoID
     * @param {boolean} completed
     * @returns {Promise<Array<{accountID: int, todoID: int, completed: boolean}>>}
     */
    updateToDoItem: async (accountID, todoID, completed) => {
        console.log("Called update todo");
        apiRequest('UpdateToDoItem', HTTP_METHOD.POST, {
        accountID,
        todoID,
        completed,
    })},
};

export default API;

