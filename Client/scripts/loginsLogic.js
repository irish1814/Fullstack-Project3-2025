import FXMLHttpRequest from "../../js/FAJAX.js";
import { contacts, contactId } from "./displayContacts.js";

var loginServer = 'http://localhost:5500'
let UserEmail = null


// Set a cookie
function setCookie(name, value, minutes) {
    const date = new Date();
    date.setTime(date.getTime() + minutes * 60 * 1000);
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
}

// Get a cookie
function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [key, value] = cookie.split('=');
        if (key === name) return value;
    }
    return null;
}

// Delete a cookie
function deleteCookie(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
}

// Show notification for signUp / signIn success or error 
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} open`;
    setTimeout(() => {
        notification.className = `notification ${type} close`;
        setTimeout(() => {
            notification.style.display = 'none';
        }, 500);
    }, 3000);
}

function logout() {
    // Terminate session id
    UserEmail = null;
    showTemplate("login-form");
}

/**
 * Log in an existing user.
 * URL: GET http://localhost:3000/users
 * Data: { username, password }
 */
function signInForm() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if(email && password) {
        const fajax = new FXMLHttpRequest();
        fajax.open('GET', '/users');
        fajax.onload = () => {
            if (fajax.readyState === 4 && fajax.status === 200) {
                let response = JSON.parse(fajax.responseText);
                console.log(response);
                let username = response.name;
                UserEmail = response.email;
                showNotification(`Welcome Back ${username}`, 'success');
                loadContactsList();

                // Redirect to the main page
                setTimeout(() => {
                    showTemplate("listContacts");
                }, 2000);

            } else if (fajax.readyState === 4) {
                console.log(fajax)
                showNotification('Wrong Email or Password', 'error');
            }
        }
        let data = { email: email, password: password }
        console.log("Sending 'signin' request with data: " + JSON.stringify(data));
        fajax.send(data);
    }
}

/**
 * Sign up as a new user.
 * URL: POST http://localhost:3000/users/signup
 * Data: { username: email, password: password, name: first + last name }
 */
function signUpForm() {
    const firstname = document.getElementById('firstname').value.trim();
    const lastname = document.getElementById('lastname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validate that passwords match
    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
    } else {
        // Save user data to localStorage
        const fajax = new FXMLHttpRequest();
        fajax.open('POST', '/users/signup');
        fajax.onload = () => {
            if (fajax.readyState === 4 && fajax.status === 201) {
                showNotification('Registration successful! You can now log in.', 'success');
                loadContactsList();

                // Redirect to the login page
                setTimeout(() => {
                    showTemplate("listContacts")
                }, 2000);
            } else if (fajax.readyState === 4) {
                console.log(JSON.parse(fajax.responseText)[0])
                showNotification('Email is already registered!', 'error');
            }
        }
        let data = { email: email, password: password, name: firstname + ' ' + lastname }
        console.log("Sending 'signup' request with data: " + JSON.stringify(data));
        fajax.send(data);
    }
}

function resetAccount() {
    const email = document.getElementById('email').value.trim();
    const newPassword = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Retrieve users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || {};
    const user = users[email];

    if(user) {
        // Validate that passwords match
        if (newPassword === confirmPassword) {
            user.password = newPassword;
            showNotification('New Password Has Been Set Successfully!', 'success');
            setTimeout(() => {
                window.location.assign(logInPage);
            }, 3000);
        } else {
            showNotification('Passwords do not match!', 'error');
            return;
        }
    } else {
        showNotification("Email not found. Please enter the email associated with your account.", 'error');
    }
}

/**
 * Load all contacts for the current user.
 * URL: GET http://localhost:3000/contacts/{email}/all
 * Data: { currentUser: loggedInEmail }
 */
function loadContactsList() {
    const fajax = new FXMLHttpRequest();
    fajax.open('GET', `/contacts/${UserEmail}/all`);
    fajax.onload = () => {
        if (fajax.readyState === 4 && fajax.status === 200) {
            let response = JSON.parse(fajax.responseText);
            console.log(response);
            contacts.length = 0;
            contacts.push(...response);
            renderList();
            showTemplate("listContacts");
        } else if (fajax.readyState === 4) {
            contacts.length = 0;
            contacts.push(...JSON.parse(fajax.responseText));
            renderList();
        }
    }
    let data = { currentUser: UserEmail }
    console.log("Sending 'load contacts' request with data: " + JSON.stringify(data));
    fajax.send(data);
}

/**
 * Add a new contact for the current user.
 * URL: POST http://localhost:3000/contacts/{email}
 * Data: { name, phone, email, loggedInEmail }
 */
function addContact() {
    const name = document.getElementById("contactName").value.trim();
    const phone = document.getElementById("contactPhone").value.trim();
    const email = document.getElementById("contactEmail").value.trim();

    if (name && phone && email) {
        const fajax = new FXMLHttpRequest();
        fajax.open('POST', `/contacts/${UserEmail}`);
        fajax.onload = () => {
            if (fajax.readyState === 4 && fajax.status === 201) {
                let response = JSON.parse(fajax.responseText);
                console.log(response);
                contacts.push({ name, phone, email, UserEmail });
                document.getElementById("contactName").value = "";
                document.getElementById("contactPhone").value = "";
                document.getElementById("contactEmail").value = "";
                showTemplate("listContacts");

            } else if (fajax.readyState === 4) {
                console.log(fajax)
                alert(
                    `Failed to add contact: \nerror code ${fajax.status} 
                    \n${JSON.parse(fajax.responseText).message}`
                );
            }
        };

        let data = { name, phone, email, UserEmail }
        console.log("Sending 'add contact' request with data: " + JSON.stringify(data));
        fajax.send(data);
    }
}

/**
 * Search for contacts.
 * URL: GET http://localhost:3000/contacts/{UserEmail}/search
 * Data: { currentUser: UserEmail, search }
 */
function searchContact() {
    const search = document.getElementById("searchInput").value.trim();
    const fajax = new FXMLHttpRequest();

    fajax.open('GET', `/contacts/${UserEmail}/search`);
    fajax.onload = () => {
        if (fajax.readyState === 4 && fajax.status === 200) {
            let response = JSON.parse(fajax.responseText);
            console.log(response);
            contacts.push(...JSON.parse(fajax.responseText));
            renderList();
            showTemplate("listContacts");

        } else if (fajax.readyState === 4) {
            console.log(fajax)
            alert(
                `Failed to add contact: \nerror code ${xhr.status} 
                \n${JSON.parse(xhr.responseText).message}`
            );
        }
    };
    
    let data = { currentUser: UserEmail, search }
    console.log("Sending request with data: " + JSON.stringify(data));
    fajax.send(data);
}

/**
 * Save edited contact for the current user.
 * URL: PUT http://localhost:3000/contacts/{UserEmail}/{emailId}
 * Data: { name: newName, phone: newPhone, email: newEmail, UserId: UserEmail, contactId: emailId }
 */
function editContact() {
    const newName = document.getElementById("editContactName").value.trim();
    const newPhone = document.getElementById("editContactPhone").value.trim();
    const contactEmail = document.getElementById("editContactEmail").value.trim();

    if (newName && newPhone && contactEmail) {
        const fajax = new FXMLHttpRequest();
        fajax.open('PUT', `/contacts/${UserEmail}/${contactEmail}`);
        fajax.onload = () => {
            if (fajax.readyState === 4 && fajax.status === 200) {
                console.log("Contact updated successfully");
                contacts[contactEmail] = {
                    name: newName,
                    phone: newPhone,
                    email: contactEmail,
                    UserEmail: UserEmail,
                };
                loadContactsList();
                showTemplate("listContacts");

            } else if (fajax.readyState === 4 && fajax.status === 409) {
                loadContactsList();
                showTemplate("listContacts");
            } else if (fajax.readyState === 4) {
                alert(
                `Failed to save contact: \nerror code ${fajax.status} 
                \n${JSON.parse(fajax.responseText).message}`);
            }
        };

        let data = { name: newName, phone: newPhone, email: contactEmail, UserEmail }
        console.log("Sending request with data: " + JSON.stringify(data));
        fajax.send(data);
    }
}

/**
 * Delete a contact for the current user.
 * URL: DELETE http://localhost:3000/contacts/{UserEmail}/{contactId}
 * Data: { userID, contactId: emailId }
 */
function deleteContact(emailId) {
    const fajax = new FXMLHttpRequest();
    fajax.open('DELETE', `/contacts/${UserEmail}/${emailId}`);
    fajax.onload = () => {
        if (fajax.readyState === 4 && fajax.status === 204) {
            console.log("Contact deleted successfully");
            contacts.splice(emailId, 1);
            renderList();
        } else if (fajax.readyState === 4 && fajax.status === 404) {
            loadContactsList();
        } else if (fajax.readyState === 4) {
            alert(
                `Failed to delete contact: \nerror code ${fajax.status} \n${
                JSON.parse(fajax.responseText).message}`);
        }
    };

    let data = { UserId: UserEmail , contactId: emailId}
    console.log("Sending 'delete contact' request with data: " + JSON.stringify(data));
    fajax.send(data);
}


window.signUpForm = signUpForm;
window.resetAccount = resetAccount;
window.signInForm = signInForm;
window.logout = logout;
window.showNotification = showNotification;
window.addContact = addContact;
window.editContact = editContact;
window.deleteContact = deleteContact;
window.searchContact = searchContact;