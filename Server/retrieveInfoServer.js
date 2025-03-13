import { getAll, get, add, update, remove } from "../js/db-api";

function getAllContacts(email) {
    return getAll(email)
}