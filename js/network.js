let packetLossRate = 0 //0.2; // Default: 20% packet loss

export function setPacketLossRate(rate) {
    packetLossRate = Math.min(Math.max(rate, 0.1), 0.5);
}

export function sendMessage(message, recipientCallback) {
    if (Math.random() < packetLossRate) {
        console.warn("Packet lost:", message);
        return;
    }

    const delay = Math.floor(Math.random() * 2000) + 1000;
    setTimeout(() => {
        recipientCallback(message);
    }, delay);
}



function handleServerRequest(method, url, data) {
    if (url.startsWith('/contacts')) {
        if (method === 'GET') {
            return database.contacts;
        } else if (method === 'POST') {
            const newContact = JSON.parse(data);
            newContact.id = Date.now();
            database.contacts.push(newContact);
            localStorage.setItem('contacts', JSON.stringify(database.contacts));
            return { success: true };
        }
    }
    return { error: 'Invalid request' };
}