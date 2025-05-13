/**
 * Show a modal.
 *
 * @param {string} id
 */
function show(id) {
   const modal = document.getElementById(id);
   if (modal) {
       console.log(`[Modal] Showing modal: ${id}`);
       modal.style.display = 'flex';
   } else {
       console.warn(`[Modal] Attempted to show a modal that does not exist: ${id}`);
   }
}

/**
 * Hide a modal.
 *
 * @param {string} id
 */
function hide(id) {
    const modal = document.getElementById(id);
    if (modal) {
        console.log(`[Modal] Hiding modal: ${id}`);
        modal.style.display = 'none';
    } else {
        console.warn(`[Modal] Attempted to hide a modal that does not exist: ${id}`);
    }
}

/**
 * Setup listeners to control modals.
 */
function init() {
    console.log('[Modal] Setting up event listeners');

    // Setup listeners for close-modal buttons
    document.querySelectorAll('.close-modal').forEach((button) => {
        button.addEventListener('click', (e) => {
            const modalID = e.target.getAttribute('data-target');
            hide(modalID);
        });
    });

    // Close a modal if you click outside of it
    window.addEventListener('click', (e) => {
        // The modal element is the backdrop, while the modal-content element contains the form.
        // If we click on the backdrop, close the modal.
        if (e.target.classList.contains('modal')) {
            hide(e.target.id);
        }
    });
}

export default {
    init,
    show,
    hide,
};

