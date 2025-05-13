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
     * @returns {Promise<{todoID: string, description: string, completed: boolean}>}
     */
    createToDoItem: async (description) => apiRequest(
        'CreateToDoItem',
        HTTP_METHOD.POST,
        {description}
    ),

    /**
     * Get Todos.
     *
     * @returns {Promise<Array<{todoID: string, description: string, completed: boolean}>>}
     */
    getToDoItems: async () => apiRequest('GetToDoItems', HTTP_METHOD.GET),

    /**
     * Log in.
     *
     * @returns {Promise}
     */
    login: async (username, password) => apiRequest('Login', HTTP_METHOD.POST, {
        username,
        password,
    }),

    /**
     * Sign up.
     *
     * @returns {Promise}
     */
    signup: async(username, password) => apiRequest('SignUp', HTTP_METHOD.POST, {
        username,
        password,
    }),
};

export default API;

