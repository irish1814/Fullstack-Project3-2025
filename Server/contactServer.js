import DataBase from "../JS/db.js";

export function handleContactsRequest(method, endpoint, data) {
    const urlParts = endpoint.split("/");
    const userEmail = urlParts[2];

    switch (method) {
        case "GET":
            if (urlParts.length === 4 ) {
                if (urlParts[3] === "all") {
                    const contacts = DataBase.getContact(userEmail);
                    return { status: 200, data: contacts };
                }
                else if (urlParts[3] === "search") {
                    const contacts = DataBase.searchContacts(userEmail, data.search);
                    return { status: 200, data: contacts };
                }
            }
            
            return { status: 404, data: { message: "UserEmail not found" } };
            


        case "POST":
            const newContact = DataBase.addContact(userEmail, data);
            if (!newContact) {
                return { status: 409, data: { message: "Contact already exists" } }; 
            }

            return { status: 201, data: newContact };

        case "PUT":
            const updateContact= DataBase.updateContact(userEmail, urlParts[3], data);
            if (!updateContact) {
                return { status: 404, data: { message: "Contact not found" } };
            }
            return { status: 200, data: updateContact };

        case "DELETE":
            const deleted = DataBase.deleteContact(userEmail, urlParts[3]);
            if (!deleted) {
                return { status: 404, data: { message: "Contact not found" } };
            }
            return { status: 204, data: {message: 'Contact Deleted'} };

        default:
            return { status: 400, data:{ message: "Ivalid method for contacts request" }};
    }
}