const DataBase = { 
    loadData(key) { 
        return JSON.parse(localStorage.getItem(key)) || {}; 
    },

    saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data)); 
    },

    /**
     * Returns user
     * @param email serves as key to an existing user in the system
     * @returns User data at users[email] if it exists
     */
    findUser(email) {
        const users = this.loadData("users");
        return users?.[email] ?? null;
    },

    /**
     * 
     * @param data An object of the new user's credentials {email: example@gmail.com, password: pass etc...}
     * @returns null if user already exist, otherwise the user's creds
     */
    addUserData(data) {
        const users = this.loadData("users");

        if (this.findUser(data.email)) return null;

        users[data.email] = data;
        this.saveData("users", users);
        return data;
    },

    //for ContactServer
    getContact(email) {
        const data = this.loadData("contacts");
        return data[email] || null;
    },

    addContact(userEmail, data) {
        if (!userEmail) return null;

        const contactData = this.loadData("contacts");
        if (!contactData[userEmail]) {
            contactData[userEmail] = [];
        }
        contactData[userEmail].push(data);
        this.saveData("contacts", contactData);
        return data;    
    }, 

    updateContact(userEmail, contactEmail, newData) {
        const contactData = this.loadData("contacts");
        if (!contactData[userEmail]) return null;

        const index = contactData[userEmail].findIndex(contact => contact.email === contactEmail);
        if (index === -1) return null;

        contactData[userEmail][index] = { ...newData };//deep copy
        this.saveData("contacts", contactData);
        return contactData[userEmail][index];
    },

    deleteContact(userEmail, contactEmail) {
        const contactData = this.loadData("contacts");
        if (!contactData[userEmail]) return false;

        const index = contactData[userEmail].findIndex(contact => contact.email === contactEmail);
        if (index === -1) return false;

        contactData[userEmail].splice(index, 1);//remove the contact
        this.saveData("contacts", contactData);
        return true;
    },

    searchContacts(userEmail, search) {
        const searchRegex = new RegExp(search, "i");
        const contactData = getContact(userEmail).filter(
            (c) => 
                searchRegex.test(c.name) || 
                searchRegex.test(c.email) || 
                searchRegex.test(c.phone)
        )
        return contactData;
    }
}

export default DataBase;