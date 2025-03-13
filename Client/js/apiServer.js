 // Simulated FAJAX Request Handler
class FXMLHttpRequest {
    constructor() {
        this.onload = null;
        this.onerror = null;
        this.response = null;
        this.status = 200;
    }
    open(method, url) {
        this.method = method;
        this.url = url;
    }
    send(data = null) {
        setTimeout(() => {
            const response = handleServerRequest(this.method, this.url, data);
            this.response = JSON.stringify(response);
            if (this.onload) this.onload();
        }, Math.random() * 2000 + 1000);
    }
}

// Simulated Server
const database = {
    users: JSON.parse(localStorage.getItem('users')) || [],
    contacts: JSON.parse(localStorage.getItem('contacts')) || []
};

function handleServerRequest(method, url, data) {
    if (url.startsWith('/contacts')) {
        if (method === 'GET') {
            return database.contacts;
        } else if (method === 'POST') {
            const newContact = JSON.parse(data);
            newContact.id = Date.now();
            database.contacts.push(newContact);
            localStorage.setItem('contacts', JSON.stringify(database.contacts));
            return { success: true };
        }
    }
    return { error: 'Invalid request' };
}

// Simple SPA Router
function navigate(page) {
    const app = document.getElementById('app');
    if (page === 'login') {
        app.innerHTML = `<h2>Login</h2>
            <input id='email' placeholder='Email'>
            <input id='password' type='password' placeholder='Password'>
            <button onclick='login()'>Login</button>
            <button onclick='navigate("register")'>Register</button>`;
    } else if (page === 'register') {
        app.innerHTML = `<h2>Register</h2>
            <input id='name' placeholder='Name'>
            <input id='email' placeholder='Email'>
            <input id='password' type='password' placeholder='Password'>
            <button onclick='register()'>Register</button>
            <button onclick='navigate("login")'>Back to Login</button>`;
    } else if (page === 'contacts') {
        app.innerHTML = `<h2>Contacts</h2>
            <button onclick='fetchContacts()'>Load Contacts</button>
            <ul id='contact-list'></ul>
            <button onclick='navigate("login")'>Logout</button>`;
    }
}

function login() {
    navigate('contacts');
}

function register() {
    navigate('login');
}

function fetchContacts() {
    const xhr = new FXMLHttpRequest();
    xhr.open('GET', '/contacts');
    xhr.onload = function () {
        const contacts = JSON.parse(xhr.response);
        document.getElementById('contact-list').innerHTML = contacts.map(c => `<li>${c.name}</li>`).join('');
    };
    xhr.send();
}

// Initialize App
navigate('login');