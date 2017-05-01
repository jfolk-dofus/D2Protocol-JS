var ClientSocket = require("./network/ClientSocket.js");

class Bot {
    constructor() {
        this.events = new Events();
        this.isConnected = false;
    }

    log(text) {
        this.events.emit("log_info", text);
    }

    get account() {
        return {
            username: "test",
            password: "test"
        };
    }

    get connectionMode() {
        return "FULL_SOCKET";
    }

    connect() {
        switch (this.connectionMode) {
            case "MITM":
                break;

            case "FULL_SOCKET":
                this.socket = new ClientSocket(this);
                break;
        }
        this.isConnected = true;
    }

    disconnect() {
        this.socket.close();
        this.isConnected = false;
    }

    on(event_name, event_handler) {
        this.events.on(event_name, event_handler);
    }
}

module.exports = Bot;