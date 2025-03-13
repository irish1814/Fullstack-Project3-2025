 // Simulated FAJAX Request Handler
class FXMLHttpRequest {
    constructor() {
        this.onload = null;
        this.onerror = null;
        this.response = null;
        this.status = 200;
    }
    open(method, url) {
        this.method = method;
        this.url = url;
    }
    send(data = null) {
        setTimeout(() => {
            const response = handleServerRequest(this.method, this.url, data);
            this.response = JSON.stringify(response);
            if (this.onload) this.onload();
        }, Math.random() * 2000 + 1000);
    }
}




export default FXMLHttpRequest; 