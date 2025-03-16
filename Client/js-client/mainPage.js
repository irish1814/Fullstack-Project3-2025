// Function to show the modal with contact info
document?.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("contact-modal-content");
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
document?.addEventListener("DOMContentLoaded", function () {
    const contactsTableBody = document.querySelector("#table-body");
    contactsTableBody.innerHTML = "";

    const contacts = JSON.parse(localStorage.getItem("contacts")) || {};

    for(let key of Object.keys(contacts)) {
        const row = document.createElement("tr");
        row.classList.add("contact-row");

        // Set data attributes for modal display
        let contact = contacts[key];
        row.dataset.email = key;
        row.dataset.name = contact.name;
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
    };
});

// Function to allow the user to edit or create new contacts
document?.addEventListener("DOMContentLoaded", function () {
    const contactModal = document.getElementById("contactModal");
    const groupModal = document.getElementById("groupModal");

    const contactCloseBtn = contactModal.querySelector(".close-btn");
    const groupCloseBtn = groupModal.querySelector(".close-btn");

    const saveContactBtn = document.getElementById("saveContactBtn");
    const saveGroupBtn = document.getElementById("saveGroupBtn");

    const searchInput = document.getElementById("searchInput");

    // Function to open the contact modal
    function openContactModal(edit = false, contactData = {}) {
        document.getElementById("modalTitle").textContent = edit ? "Edit Contact" : "Create Contact";

        document.getElementById("contactName").value = contactData.name || "";
        document.getElementById("contactEmail").value = contactData.email || "";
        document.getElementById("contactPhone").value = contactData.phone || "";
        document.getElementById("contactCountry").value = contactData.country || "";
        document.getElementById("contactCity").value = contactData.city || "";
        document.getElementById("contactAddress").value = contactData.address || "";
        document.getElementById("contactPhoto").value = contactData.photo || "";

        contactModal.style.display = "flex";
    }

    // Function to open the group modal
    function openGroupModal(edit = false, groupData = {}) {
        document.getElementById("groupModalTitle").textContent = edit ? "Edit Group" : "Create Group";

        document.getElementById("groupName").value = groupData.name || "";
        document.getElementById("groupMembers").value = groupData.members ? groupData.members.join(", ") : "";

        groupModal.style.display = "flex";
    }

    // Function to close modals
    function closeModal(modal) {
        modal.style.display = "none";
    }

    contactCloseBtn?.addEventListener("click", () => closeModal(contactModal));
    groupCloseBtn?.addEventListener("click", () => closeModal(groupModal));

    // Close modals if clicking outside
    window?.addEventListener("click", (event) => {
        if (event.target === contactModal) closeModal(contactModal);
        if (event.target === groupModal) closeModal(groupModal);
    });

    // Save contact to LocalStorage
    saveContactBtn?.addEventListener("click", function () {
        const contacts = JSON.parse(localStorage.getItem("contacts")) || {};

        const contactEmail = document.getElementById("contactEmail").value;
        const contactName = document.getElementById("contactName").value;
        const contactPhone = document.getElementById("contactPhone").value;
        const contactCountry = document.getElementById("contactCountry").value;
        const contactCity = document.getElementById("contactCity").value;
        const contactAddress = document.getElementById("contactAddress").value;
        const contactPhoto = document.getElementById("contactPhoto").value;

        if (contactEmail) {
            contacts[contactEmail] = {
                name: contactName,
                phone: contactPhone,
                country: contactCountry,
                city: contactCity,
                address: contactAddress,
                photo: contactPhoto
            };

            localStorage.setItem("contacts", JSON.stringify(contacts));
            loadContacts();
            closeModal(contactModal);
        }
    });

    // Save group to LocalStorage
    saveGroupBtn?.addEventListener("click", function () {
        const groups = JSON.parse(localStorage.getItem("groups")) || {};

        const groupName = document.getElementById("groupName").value;
        const groupMembers = document.getElementById("groupMembers").value.split(",").map(email => email.trim());

        if (groupName) {
            groups[groupName] = { members: groupMembers };
            localStorage.setItem("groups", JSON.stringify(groups));
            closeModal(groupModal);
        }
    });

    // Search function
    searchInput?.addEventListener("input", function () {
        const searchValue = searchInput.value.toLowerCase();
        const contactRows = document.querySelectorAll(".contact-row");

        contactRows.forEach(row => {
            const name = row.dataset.name.toLowerCase();
            const email = row.dataset.email.toLowerCase();
            const phone = row.dataset.phone.toLowerCase();

            if (name.includes(searchValue) || email.includes(searchValue) || phone.includes(searchValue)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    });

    // Attach event listeners to menu buttons
    document?.querySelector(".menu-content li:nth-child(1) a").addEventListener("click", () => openContactModal(false));
    document?.querySelector(".menu-content li:nth-child(2) a").addEventListener("click", () => openGroupModal(false));
});


function loadContacts() {
    // Save to localStorage
    localStorage.setItem("contacts", JSON.stringify(exampleContacts));
    console.log("Example contacts saved to localStorage!");
}