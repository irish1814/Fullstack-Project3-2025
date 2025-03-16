import { get } from "../js/db-api";

function authenticate(email, password) {
    return get(email) !== NaN && password === get(email); 
}


export function handleUsersRequest(method, endpoint, data) {
    const urlParts = endpoint.split("/");
    if (urlParts[1] !== "users") return { error: "Invalid API route" };

    switch (method) {
        case "GET":
            return urlParts.length === 2 ? usersDB.getAll() : usersDB.get(decodeURIComponent(urlParts[2]));
        case "POST":
            return usersDB.add(data.email, data);
        case "PUT":
            return usersDB.update(decodeURIComponent(urlParts[2]), data);
        case "DELETE":
            return usersDB.delete(decodeURIComponent(urlParts[2]));
        default:
            return { error: "Unsupported method" };
    }
}