import FXMLHttpRequest from "../../js/FAJAX.js";

var loginServer = 'http://localhost:5500'
var userID = null

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
    showTemplate("login-form");
}

function signInForm() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    console.log(email + password);

    if(email && password) {
        const LoginCallback = (xhr) => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log(xhr.responseText);
                userID = JSON.parse(xhr.responseText)[0];
                console.log("Created session with user ID: " + userID);
                setCookie('userEmail', email, 5); // Store user's email in a cookie
                setTimeout(() => {
                    showNotification(`Welcome back ${xhr.data.firstname +  
                        ' ' + xhr.data.lastname}`, 'success');
                }, 3000);
                loadContactsList(xhr.data);
            } else {
                showNotification("Wrong Email or Password", "error");
            }
            handleNetworkRequest("GET", `${loginServer}/users`, { username, password }, LoginCallback, "retry login")
        };
    }
    else {
        showNotification('PLease enter email and passsword!', 'error');
    }
}

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
        console.log("creating a request")
        // Save user data to localStorage
        const fajax = new FXMLHttpRequest();
        fajax.open('POST', '/users');
        fajax.onload = () => {
            if (fajax.readyState === 4 && fajax.status === 201) {
                showNotification('Registration successful! You can now log in.', 'success');
                // Redirect to the login page
                setTimeout(() => { showTemplate("login-form") }, 3000);
            } else if (fajax.readyState === 4) {
                showNotification('Email is already registered!', 'error');
            }
        }
        fajax.send({ email, password, name: firstname + ' ' + lastname });
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

function loadContactsList(loggedInUserData) {
    showTemplate("showContacts");
    const list = document.getElementById("contactList");

    list.innerHTML = "";
    const template = document.getElementById("showContacts").content;

    list.innerHTML = `
            <table id="contactsList">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                    </tr>
                </thead>
                <tbody id="table-body">
                </tbody>
            </table>`
}



window.signUpForm = signUpForm;
window.resetAccount = resetAccount;
window.signInForm = signInForm;