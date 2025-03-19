import { sendMessage } from './network.js';

 // Simulated FAJAX Request Handler
class FXMLHttpRequest {
    
    constructor() {
        this.onload = null;
        this.responseText = "";
        this.status = 0;
        this.readyState = 0;
    }   

    open(method, url) {
        this.method = method;
        this.url = url;
        this.readyState = 1;
        this.stateChange();
    }

    send(data = null) {
        if (this.readyState !== 1) {
            throw new Error("Invalid state");
        }
        this.readyState = 2;
        this.stateChange();

        sendMessage(this, data);
    }

    stateChange() {
        if (this.onload) {
            this.onload();
        }
    }
}

export default FXMLHttpRequest; 