import { getCookie } from "./cookiesHandleing.js";
import { UserEmail } from "./loginsOperation.js";
export var contacts = [];
// export var editIndex = null;
export var contactId = null;

// // Function to show the modal with contact info
// document?.addEventListener("DOMContentLoaded", () => {
//     const modal = document.getElementById("contact-modal-content");
//     const closeModalButton = document.querySelector(".close-btn");

//     function showModal(contact) {
//         const name = contact.dataset.name;
//         const email = contact.dataset.email;
//         const phone = contact.dataset.phone;
//         const country = contact.dataset.country;
//         const city = contact.dataset.city;
//         const address = contact.dataset.address;
//         const photo = contact.dataset.photo || "https://cdn-icons-png.flaticon.com/128/3282/3282224.png"; // Default photo if none provided

//         document.getElementById("modalName").textContent = name;
//         document.getElementById("modalEmail").textContent = email;
//         document.getElementById("modalPhone").textContent = phone;
//         document.getElementById("modalCountry").textContent = country;
//         document.getElementById("modalCity").textContent = city;
//         document.getElementById("modalAddress").textContent = address;
//         document.getElementById("modalPhoto").src = photo;

//         // Display the modal
//         modal.style.display = "flex";
//     }

//     // Event listener for clicking on a contact row
//     const rows = document.querySelectorAll(".contact-row");
//     rows.forEach(row => {
//         row.addEventListener("click", function () {
//             showModal(this);
//         });
//     });

//     // Close the modal when the close button is clicked
//     closeModalButton.addEventListener("click", function () {
//         modal.style.display = "none";
//     });

//     // Close the modal when clicking outside the modal content
//     window.addEventListener("click", function (event) {
//         if (event.target === modal) {
//             modal.style.display = "none";
//         }
//     });
// });

// // Function to load contacts from local storage and add them to the table
// document?.addEventListener("DOMContentLoaded", () => {
//     const modal = document.getElementById("contactModal");
//     const modalTitle = document.getElementById("modalTitle");
//     const createButton = document.getElementById("createBtn");
//     const editButton = document.getElementById("editBtn");
//     const deleteButton = document.getElementById("deleteBtn");
//     const closeBtn = document.querySelector(".close-btn");
//     const saveBtn = document.getElementById("saveContactBtn");
    
//     const contactsTableBody = document.querySelector("#table-body");
//     const contactInputFields = {
//         name: document.getElementById("contactName"),
//         email: document.getElementById("contactEmail"),
//         phone: document.getElementById("contactPhone"),
//         country: document.getElementById("contactCountry"),
//         city: document.getElementById("contactCity"),
//         address: document.getElementById("contactAddress"),
//         photo: document.getElementById("contactPhoto"),
//     };

//     // Index to create/edit contact in the table
//     let editingContactIndex = null;

//     // Flag to indicate delete mode
//     let deleteMode = false; 

//     // Loads contacts from Local Storgae to show them in the table
//     function loadContacts() {
//         contactsTableBody.innerHTML = "";
//         const contacts = JSON.parse(localStorage.getItem("contacts")) || {};

//         let index = 0;
//         for(let key of Object.keys(contacts)) {
//             const row = document.createElement("tr");
//             row.classList.add("contact-row");

//             // Set data attributes for modal display
//             let contact = contacts[key];
//             row.dataset.email = key;
//             row.dataset.name = contact.name;
//             row.dataset.phone = contact.phone;
//             row.dataset.country = contact.country;
//             row.dataset.city = contact.city;
//             row.dataset.address = contact.address;
//             row.dataset.photo = contact.photo || ""; // Empty if no photo


//             // Insert table cells
//             row.innerHTML = `
//                 <td>${contact.name}</td>
//                 <td>${contact.email}</td>
//                 <td>${contact.phone}</td>
//                 ${deleteMode ? `<td><button id="delete-btn" data-index="${index}">❌</button></td>` : ""}
//             `;
            
//             contactsTableBody.appendChild(row);
//             index++;

//             if (deleteMode) {
//                 document.querySelectorAll("delete-btn").forEach(button => {
//                     button.addEventListener("click", (event) => {
//                         const index = event.target.getAttribute("data-index");
//                         deleteContact(index);
//                     });
//                 });
//             }
//         }
//     }

//     function saveContact() {
//         const contacts = JSON.parse(localStorage.getItem("contacts")) || [];
//         email = contactInputFields.email.value.trim()
//         const newContact = {
//             name: contactInputFields.name.value.trim(),
//             email: email,
//             phone: contactInputFields.phone.value.trim(),
//             country: contactInputFields.country.value.trim(),
//             city: contactInputFields.city.value.trim(),
//             address: contactInputFields.address.value.trim(),
//             photo: contactInputFields.photo.value.trim(),
//         };

//         contacts[email] = newContact;

//         localStorage.setItem("contacts", JSON.stringify(contacts));
//         modal.style.display = "none";
//         loadContacts();
//     }

//     function deleteContact(index) {
//         const contacts = JSON.parse(localStorage.getItem("contacts")) || [];
//         contacts.splice(index, 1);
//         localStorage.setItem("contacts", JSON.stringify(contacts));
//         loadContacts();
//     }

//     // Open a pop-op window for creating or editing a contact
//     function openModal(isEditing = false, contactIndex = null) {
//         modal.style.display = "flex";
//         modalTitle.textContent = isEditing ? "Edit Contact" : "Create Contact";
//         saveBtn.textContent = isEditing ? "Update" : "Save";

//         if (isEditing) {
//             const contacts = JSON.parse(localStorage.getItem("contacts")) || [];
//             const contact = contacts[contactIndex];
//             if (contact) {
//                 contactInputFields.name.value = contact.name.value || "";
//                 contactInputFields.email.value = contact.email.value || "";
//                 contactInputFields.phone.value = contact.phone || "";
//                 contactInputFields.country.value = contact.country || "";
//                 contactInputFields.city.value = contact.city || "";
//                 contactInputFields.address.value = contact.address || "";
//                 contactInputFields.photo.value = contact.photo || "";
//                 editingContactIndex = contactIndex;
//             }
//         } else {
//             Object.values(contactInputFields).forEach(input => (input.value = ""));
//             editingContactIndex = null;
//         }
//     }

//     // Event Listeners for Buttons
//     createButton?.addEventListener("click", () => {
//         deleteMode = false;
//         openModal(false);
//     });

//     editButton?.addEventListener("click", () => {
//         const contacts = JSON.parse(localStorage.getItem("contacts")) || {};
//         if (Object.keys(contacts).length > 0) {
//             deleteMode = false;
//             openModal(true, 0);
//         } else {
//             alert("No contacts available to edit.");
//         }
//     });

//     deleteButton?.addEventListener("click", () => {
//         deleteMode = true;
//         loadContacts();
//     });

//     // Save a new contact or save new editing
//     saveBtn.addEventListener("click", saveContact);

//     // Cancal the operation
//     closeBtn.addEventListener("click", () => (modal.style.display = "none"));

//     loadContacts();
// });


// If the user already signed in and the cookie is valid for 5 minutes
document.addEventListener('DOMContentLoaded', () => {
    showTemplate("registration-form");
});

// Show the relevant template based on user action
export function showTemplate(templateType) {
    const content = document.getElementById("content");
    content.innerHTML = "";
    const template = document.getElementById(templateType).content;
    const clone = document.importNode(template, true);
    content.appendChild(clone);
    
    // Hide nav bar when in signin or signup mode and set the class to be "form" which is the dedicated class for all sign forms
    if (!getCookie(UserEmail) || templateType === "login-form" || templateType === "registration-form" || templateType === "reset-form") {
        document.getElementById("nav-bar").className = "hidden";
        content.className = "form";
    } else {
        document.getElementById("nav-bar").className = "menu";
    }

    // Call renderList if the read template is shown
    if (templateType === "listContacts") {
        content.className = "table";
        renderList();
    }
}

function renderList() {
    const tableBody = document.getElementById("tableBody");

    tableBody.innerHTML = "";
    console.log("Contacts:", contacts);
    
    contacts.forEach((contact) => {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        const emailCell = document.createElement("td");
        const phoneCell = document.createElement("td");

        nameCell.textContent = contact.name;
        emailCell.textContent = contact.email;
        phoneCell.textContent = contact.phone;

        const actionCell = document.createElement("td");
        const editButton = document.createElement("button");
        const deleteButton = document.createElement("button");

        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => {
            showTemplate("editContact");
            editContact(contact.email);
        });

        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteContact(contact.email));

        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);

        row.appendChild(nameCell);
        row.appendChild(emailCell);
        row.appendChild(phoneCell);
        row.appendChild(actionCell);

        tableBody.appendChild(row);
    });

    if (contacts.length === 0) {
        const emptyRow = document.createElement("tr");
        const emptyCell = document.createElement("td");
        emptyCell.colSpan = 4;
        emptyCell.textContent = "No contacts found";
        emptyRow.appendChild(emptyCell);
        tableBody.appendChild(emptyRow);
    }
}

window.showTemplate = showTemplate;
window.renderList = renderList;