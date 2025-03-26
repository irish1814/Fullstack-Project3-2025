import FXMLHttpRequest from "../../js/FAJAX.js";
import { showTemplate, contacts, contactId } from "./displayContacts.js";
import { getCookie } from "./cookiesHandleing.js";
import { UserEmail } from "./loginsOperation.js"

/**
 * Load all contacts for the current user.
 * URL: GET loginServer/contacts/{email}/all
 * Data: { currentUser: loggedInEmail }
 */
export function loadContactsList() {
    if(!getCookie(UserEmail)) {
        showTemplate("login-form");
        return;
    }
    const fajax = new FXMLHttpRequest();
    fajax.open('GET', `/contacts/${UserEmail}/all`);
    fajax.onload = () => {
        if (fajax.readyState === 4) {
            if(fajax.status === 200) {
                let response = fajax.responseText;
                contacts.length = 0;
                response ? contacts.push(...JSON.parse(response)) : console.log(response);
                renderList();
            } else {
                alert(`Failed to load contacts: \nerror code ${xhr.status}\n${JSON.parse(xhr.responseText).message}`);
            }
        }
    }
    let data = { currentUser: UserEmail }
    console.log("Sending 'load contacts' request with data: " + JSON.stringify(data));
    fajax.send(data);
}

/**
 * Add a new contact for the current user.
 * URL: POST loginServer/contacts/{email}
 * Data: { name, phone, email, loggedInEmail }
 */
export function addContact() {
    if(!getCookie(UserEmail)) {
        showTemplate("login-form");
        return;
    }
    const firstname = document.getElementById("contactFirstName").value.trim();
    const lastname = document.getElementById("contactLastName").value.trim();
    const phone = document.getElementById("contactPhone").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const name = firstname + ' ' + lastname;

    if (name && phone && email) {
        const fajax = new FXMLHttpRequest();
        fajax.open('POST', `/contacts/${email}`);
        fajax.onload = () => {
            if (fajax.readyState === 4) {
                if(fajax.status === 201) {
                    let response = JSON.parse(fajax.responseText);
                    console.log(response);
                    contacts.push({ name, phone, email, UserEmail });
                    document.getElementById("contactFirstName").value = "";
                    document.getElementById("contactLastName").value = "";
                    document.getElementById("contactPhone").value = "";
                    document.getElementById("contactEmail").value = "";
                    showTemplate("listContacts");

                } else {
                    console.log(fajax)
                    alert(`Failed to add contact: \nerror code ${fajax.status}\n${JSON.parse(fajax.responseText).message}`);
                }
            }
        };

        let data = { name, phone, email, UserEmail }
        console.log("Sending 'add contact' request with data: " + JSON.stringify(data));
        fajax.send(data);
    }
}

/**
 * Search for contacts.
 * URL: GET loginServer/contacts/{UserEmail}/search
 * Data: { currentUser: UserEmail, search }
 */
export function searchContact() {
    if(!getCookie(UserEmail)) {
        showTemplate("login-form");
        return;
    }
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
 * URL: PUT loginServer/contacts/{UserEmail}/{emailId}
 * Data: { name: newName, phone: newPhone, UserId: UserEmail, contactId: emailId }
 */
export function editContact(emailId) {
    if(!getCookie(UserEmail)) {
        showTemplate("login-form");
        return;
    }
    const newFirstName = document.getElementById("editContactFirstName").value.trim();
    const newLastName = document.getElementById("editContactLastName").value.trim();
    const newPhone = document.getElementById("editContactPhone").value.trim();

    const newName = newFirstName + ' ' + newLastName;

    if (newName && newPhone) {
        const fajax = new FXMLHttpRequest();
        fajax.open('PUT', `/contacts/${UserEmail}/${emailId}`);
        fajax.onload = () => {
            if (fajax.readyState === 4 && fajax.status === 200) {
                console.log("Contact updated successfully");
                contacts[emailId] = {
                    name: newName,
                    phone: newPhone,
                    email: emailId,
                    UserEmail: UserEmail,
                };
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

        let data = { name: newName, phone: newPhone, UserId: UserEmail, contactId: emailId }
        console.log("Sending 'edit contact' request with data: " + JSON.stringify(data));
        fajax.send(data);
    }
}

/**
 * Delete a contact for the current user.
 * URL: DELETE loginServer/contacts/{UserEmail}/{contactId}
 * Data: { userID, contactId: emailId }
 */
export function deleteContact(emailId) {
    if(!getCookie(UserEmail)) {
        showTemplate("login-form");
        return;
    }
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

window.addContact = addContact;
window.editContact = editContact;
window.deleteContact = deleteContact;
window.searchContact = searchContact;