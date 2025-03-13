import "../DB/db-api"

class ContactsDB extends DB {
    constructor() {
        super("contacts"); // Use "contacts" as the storage key
    }
}

