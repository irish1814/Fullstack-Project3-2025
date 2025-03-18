const loadData = (key) => JSON.parse(localStorage.getItem(key)) || {};
const saveData = (key, data) => localStorage.setItem(key, JSON.stringify(data));





//for UserServer 
export function findUser(email) {
    const users = loadData("users");
    return users[email] ? users[email] : null;
}

export function addUserData(data) {
    const users = loadData("users");

    if (findUser(data.email)) return null;

    users[data.email] = data;
    saveData("users", users);
    return data;
}


//for ContactServer
export function getContact(email) {
    const data = loadData("contacts");
    return data[email] || null;
}

export function addContact(userEmail, data) {

    if (!userEmail) return null;

    const contactData = loadData("contacts");
    if (!contactData[userEmail]) {
        contactData[userEmail] = [];
    }
    contactData[userEmail].push(data);
    saveData("contacts", contactData);
    return data;    
}

export function updateContact(userEmail, contactEmail, newData) {
    const contactData = loadData("contacts");
    if (!contactData[userEmail]) return null;

    const index = contactData[userEmail].findIndex(contact => contact.email === contactEmail);
    if (index === -1) return null;

    contactData[userEmail][index] = { ...newData };//deep copy
    saveData("contacts", contactData);
    return contactData[userEmail][index];
}

export function deleteContact(userEmail, contactEmail) {
    const contactData = loadData("contacts");
    if (!contactData[userEmail]) return false;

    const index = contactData[userEmail].findIndex(contact => contact.email === contactEmail);
    if (index === -1) return false;

    contactData[userEmail].splice(index, 1);//remove the contact
    saveData("contacts", contactData);
    return true;
}

export function searchContacts(userEmail, search) {
    const searchRegex = new RegExp(search, "i");
    const contactData = getContact(userEmail).filter(
        (c) => 
            searchRegex.test(c.name) || 
            searchRegex.test(c.email) || 
            searchRegex.test(c.phone)
    )
    return contactData;
}
