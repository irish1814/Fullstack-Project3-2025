export var contacts = [];
// export var editIndex = null;
export var contactId = null;



// If the user already signed in and the cookie is valid for 5 minutes
document.addEventListener('DOMContentLoaded', () => {
    showTemplate("registration-form");
});

// Show the relevant template based on user action
function showTemplate(templateType) {
    const content = document.getElementById("content");
    content.innerHTML = "";
    const template = document.getElementById(templateType).content;
    const clone = document.importNode(template, true);
    content.appendChild(clone);
    
    // Hide nav bar when in signin or signup mode and set the class to be "form" which is the dedicated class for all sign forms
    if (templateType === "login-form" || templateType === "registration-form" || templateType === "reset-form") {
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
            const name = document.getElementById("editContactName");
            const phone = document.getElementById("editContactPhone");
            const email = document.getElementById("editContactEmail");
            name.value = contact.name;
            phone.value = contact.phone;
            email.value = contact.email;
            email.setAttribute('readonly', true);
        });

        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteContact(contact.email));
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