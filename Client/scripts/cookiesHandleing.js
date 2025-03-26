/**
 * Set a new cookie using a key - name and a value for X minutes
 * @param {cookie's name} name 
 * @param {value to be stored in the cookie} value 
 * @param {how many minutes the cookie will be valid} minutes 
 */
export function setCookie(name, value, minutes) {
    const date = new Date();
    date.setTime(date.getTime() + minutes * 60 * 1000);
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
}

/**
 * Get a cookie using cookie's key name
 * @param {name of the requested cookie} name 
 * @returns cookie's value if exists, else null
 */
export function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [key, value] = cookie.split('=');
        if (key === name) return value;
    }
    return null;
}

/**
 * Delete a cookie using cookie's key name
 * @param {name of the requested cookie} name 
 */
export function deleteCookie(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
}