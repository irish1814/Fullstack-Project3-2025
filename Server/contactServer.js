export function handleContactsRequest(method, endpoint, data) {
    const urlParts = endpoint.split("/");
    if (urlParts[1] !== "contacts") return { error: "Invalid API route" };

    switch (method) {
        case "GET":
            return urlParts.length === 2 ? contactsDB.getAll() : contactsDB.get(decodeURIComponent(urlParts[2]));
        case "POST":
            return contactsDB.add(data.email, data);
        case "PUT":
            return contactsDB.update(decodeURIComponent(urlParts[2]), data);
        case "DELETE":
            return contactsDB.delete(decodeURIComponent(urlParts[2]));
        default:
            return { error: "Unsupported method" };
    }
}