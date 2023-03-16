/* eslint-disable max-len */

/**
 * Callback used by {@link EventHandler} functions. Note the callback is limited to 8 arguments.
 *
 * @callback HandleEventCallback
 * @param {*} [arg1] First argument that is passed from caller.
 * @param {*} [arg2] Second argument that is passed from caller.
 * @param {*} [arg3] Third argument that is passed from caller.
 * @param {*} [arg4] Fourth argument that is passed from caller.
 * @param {*} [arg5] Fifth argument that is passed from caller.
 * @param {*} [arg6] Sixth argument that is passed from caller.
 * @param {*} [arg7] Seventh argument that is passed from caller.
 * @param {*} [arg8] Eighth argument that is passed from caller.
 */

/**
 * @typedef {{once: boolean, scope: object, callback: HandleEventCallback}} EventCallback
 * @typedef {Object<string, EventCallback[] | null>} Callback
 */

export default {}