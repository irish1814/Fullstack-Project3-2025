var mainPage = '../../html/mainPage.html'
var logInPage = '../html/signIn.html'

// Set a cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
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

// If the user already signed in and the cookie is valid for 1 day
document.addEventListener('DOMContentLoaded', () => {
    const userEmail = getCookie('userEmail');
    if (userEmail) {
        setTimeout(() => {
            window.location.assign(mainPage);
        }, 500);
    }

    // Handle logout cleanup if redirected with query parameter
    const params = new URLSearchParams(window.location.search);
    if (params.get('logout') === 'true') {
        const userToRemove = getCookie('userEmail');
        let users = JSON.parse(localStorage.getItem('users')) || [];
        let updateUsers = users.filter(user => user.email !== userToRemove);
        localStorage.setItem('users', JSON.stringify(updateUsers));

        deleteCookie('userEmail');
        deleteCookie('isLogged');
        showNotification('You have been logged out.', 'info');
    }

    
    const signInForm = document.getElementById('login-form')
    const signUpForm = document.getElementById('registration-form')
    const resetForm = document.getElementById('reset-form')

    // Handle User Registration
    signUpForm?.addEventListener('submit', () => {
        // e.preventDefault();

        const firstname = document.getElementById('firstname').value.trim();
        const lastname = document.getElementById('lastname').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        // Validate that passwords match
        if (password !== confirmPassword) {
            showNotification('Passwords do not match!', 'error');
            return;
        }

        // Save user data to localStorage
        const users = JSON.parse(localStorage.getItem('users')) || {};
        const existingUser = users['email'] || {};

        if (existingUser) {
            showNotification('Email is already registered!', 'error');
        }

        else {
            let newUser = { email: email, password: password, name: firstname + ' ' + lastname };
            localStorage.setItem('users', JSON.stringify(newUser));

            showNotification('Registration successful! You can now log in.', 'success');
            // Redirect to the login page
            setTimeout(() => {
                window.location.assign(logInPage);
            }, 3000);
        }
    });


    // Handle User Login
    signInForm?.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // Retrieve users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || {};
        const userEmail = users['email'] || {}, userPassword = users['password'] || {};

        if (userEmail === email && password === userPassword) {
            setCookie('isLoggedIn', true, 1); // Set a general login cookie
            setCookie('userEmail', email, 1); // Store user's email in a cookie
            showNotification(`Welcome back ${users['email'].name}`, 'success');
            setTimeout(() => {
                window.location.assign(mainPage);
            }, 3000);
        } else {
            showNotification('Wrong email or password!', 'error');
        }
    });

    // Handle User Password Reset
    resetForm?.addEventListener('submit', function(e) {
        e.preventDefault();

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
    });
});