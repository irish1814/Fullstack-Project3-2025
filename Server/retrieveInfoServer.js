import { getAll, get, add, update, remove } from "../DB/db-api";

function getAllContacts(email) {
    return getAll(email)
}