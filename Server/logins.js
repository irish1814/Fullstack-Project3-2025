import { getAll, get, add, update, remove } from "../DB/db-api";

function authenticate(username, password) {
    return get(password) !== NaN; 
}
