import { handleContactsRequest } from '../Server/contactServer.js';
import { handleUsersRequest } from '../Server/userServer.js';

let packetLossRate = 0 //0.2; // Default: 20% packet loss

export function sendMessage(request, data) {
    

    const delayClient = Math.floor(Math.random() * 2000) + 1000;
    setTimeout(() => {
        if (Math.random() < packetLossRate) {
            console.warn("Packet lost:", message);
            return;
        }

        request.readyState = 3;
        request.stateChange();

        handleServerRequest(request.method, request.url, data, (response) => {
            const delayServer = Math.floor(Math.random() * 2000) + 1000;
            setTimeout(() => {
                if (Math.random() < packetLossRate) {
                    console.warn("Packet lost:", message);
                    return;
                }
                request.status = response.status;
                request.responseText = JSON.stringify(response.data);
                request.readyState = 4;
                request.stateChange();
            }, delayServer);
    }, delayClient);
});
}



function handleServerRequest(method, url, data, callback) {
    let response = {status: 400, data: {message: 'Invalid request'}};

    if (url.startsWith('/contacts')) {
        response = handleContactsRequest(method, url, data);
    } else if (url.startsWith('/users')) {
        response = handleUsersRequest(method, url, data);
    }

    callback(response)
}

if (method === 'GET') {
    return database.contacts;
} else if (method === 'POST') {
    const newContact = JSON.parse(data);
    newContact.id = Date.now();
    database.contacts.push(newContact);
    localStorage.setItem('contacts', JSON.stringify(database.contacts));
    return { success: true };
}