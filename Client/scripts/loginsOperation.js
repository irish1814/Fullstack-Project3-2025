import FXMLHttpRequest from "../../js/FAJAX.js";
import { showTemplate } from "./displayContacts.js";
import { loadContactsList } from "./CRUD-Operation.js"
import { setCookie, deleteCookie } from "./cookiesHandleing.js";

var loginServer = 'http://localhost:5500';
export var UserEmail = null;

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
    deleteCookie(UserEmail);
    UserEmail = null;
    showTemplate("login-form");
}

/**
 * Sign up as a new user.
 * URL: POST loginServer/users/signup
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
            if (fajax.readyState === 4) {
                if(fajax.status === 201) {
                    showNotification('Registration successful! You can now log in.', 'success');
                    loadContactsList();

                    // Redirect to the login page
                    setTimeout(() => {
                        showTemplate("login-form");
                    }, 2000);
                } else {
                    console.log(JSON.parse(fajax.responseText)[0])
                    showNotification('Email is already registered!', 'error');
                }
            }
        }
        let data = { email: email, password: password, name: firstname + ' ' + lastname }
        console.log("Sending 'signup' request with data: " + JSON.stringify(data));
        fajax.send(data);
    }
}

/**
 * Log in an existing user.
 * URL: GET loginServer/users
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
                setCookie(UserEmail, 'loggedIn', 5);
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


window.signUpForm = signUpForm;
window.resetAccount = resetAccount;
window.signInForm = signInForm;
window.logout = logout;