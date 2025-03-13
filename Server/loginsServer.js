import { get } from "../DB/db-api";

function authenticate(email, password) {
    return get(email) !== NaN && password === get(email); 
}
