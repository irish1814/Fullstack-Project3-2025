/* class FXMLHttpRequest {
    constructor() {
        this.onload = null;
        this.onerror = null;
        this.responseText = "";
    }

    open(method, url) {
        this.method = method;
        this.url = url;
    }

    send(data = null) {
        setTimeout(() => {
            if (Math.random() < 0.2) { // 20% chance to fail
                if (this.onerror) this.onerror();
            } else {
                this.responseText = Network.handleRequest(this.method, this.url, data);
                if (this.onload) this.onload();
            }
        }, Math.random() * 2000 + 1000); // Delay between 1-3 seconds
    }
}

class Network {
    static handleRequest(method, url, data) {
        return Server.processRequest(method, url, data);
    }
}

class Server {
    static processRequest(method, url, data) {
        if (url === "/contacts") {
            return ContactDB.handleRequest(method, data);
        }
        return JSON.stringify({ error: "Invalid Endpoint" });
    }
}

class ContactDB {
    static contacts = JSON.parse(localStorage.getItem("contacts")) || [];

    static handleRequest(method, data) {
        switch (method) {
            case "GET":
                return JSON.stringify(ContactDB.contacts);
            case "POST":
                const contact = JSON.parse(data);
                contact.id = Date.now();
                ContactDB.contacts.push(contact);
                ContactDB.save();
                return JSON.stringify({ success: true });
            case "DELETE":
                ContactDB.contacts = ContactDB.contacts.filter(c => c.id !== data);
                ContactDB.save();
                return JSON.stringify({ success: true });
            default:
                return JSON.stringify({ error: "Invalid Method" });
        }
    }

    static save() {
        localStorage.setItem("contacts", JSON.stringify(ContactDB.contacts));
    }
}

function fetchContacts() {
    let xhr = new FXMLHttpRequest();
    xhr.open("GET", "/contacts");
    xhr.onload = function () {
        let contacts = JSON.parse(xhr.responseText);
        displayContacts(contacts);
    };
    xhr.send();
}

function addContact(name, phone) {
    let xhr = new FXMLHttpRequest();
    xhr.open("POST", "/contacts");
    xhr.onload = function () {
        fetchContacts();
    };
    xhr.send(JSON.stringify({ name, phone }));
}

function displayContacts(contacts) {
    let list = document.getElementById("contactList");
    list.innerHTML = "";
    contacts.forEach(contact => {
        let li = document.createElement("li");
        li.textContent = `${contact.name} - ${contact.phone}`;
        list.appendChild(li);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("addContactForm").addEventListener("submit", (event) => {
        event.preventDefault();
        let name = document.getElementById("name").value;
        let phone = document.getElementById("phone").value;
        addContact(name, phone);
    });
    fetchContacts();
}); */


// Function to show the modal with contact info
document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("contactModal");
    const closeModalButton = document.querySelector(".close-btn");

    function showModal(contact) {
        const name = contact.dataset.name;
        const email = contact.dataset.email;
        const phone = contact.dataset.phone;
        const country = contact.dataset.country;
        const city = contact.dataset.city;
        const address = contact.dataset.address;
        const photo = contact.dataset.photo || "https://cdn-icons-png.flaticon.com/128/3282/3282224.png"; // Default photo if none provided

        document.getElementById("modalName").textContent = name;
        document.getElementById("modalEmail").textContent = email;
        document.getElementById("modalPhone").textContent = phone;
        document.getElementById("modalCountry").textContent = country;
        document.getElementById("modalCity").textContent = city;
        document.getElementById("modalAddress").textContent = address;
        document.getElementById("modalPhoto").src = photo;

        // Display the modal
        modal.style.display = "flex";
    }

    // Event listener for clicking on a contact row
    const rows = document.querySelectorAll(".contact-row");
    rows.forEach(row => {
        row.addEventListener("click", function () {
            showModal(this);
        });
    });

    // Close the modal when the close button is clicked
    closeModalButton.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Close the modal when clicking outside the modal content
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});

// Function to load contacts from local storage and add them to the table
function loadContacts() {
    const contactsTableBody = document.querySelector("#contacts");
    contactsTableBody.innerHTML = "";

    const contacts = JSON.parse(localStorage.getItem("contacts")) || [];

    contacts.forEach(contact => {
        const row = document.createElement("tr");
        row.classList.add("contact-row");

        // Set data attributes for modal display
        row.dataset.name = contact.name;
        row.dataset.email = contact.email;
        row.dataset.phone = contact.phone;
        row.dataset.country = contact.country;
        row.dataset.city = contact.city;
        row.dataset.address = contact.address;
        row.dataset.photo = contact.photo || ""; // Empty if no photo

        // Add onclick event to open modal
        row.setAttribute("onclick", "showModal(this)");

        // Insert table cells
        row.innerHTML = `
            <td>${contact.name}</td>
            <td>${contact.email}</td>
            <td>${contact.phone}</td>
        `;

        contactsTableBody.appendChild(row);
    });
}
