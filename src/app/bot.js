var ClientSocket = require("./network/client_socket.js");
var moment = require("moment");

class Bot {
    constructor() {
        this.events = new Events();
        this.is_connected = false;
        this.logs = "";
        let self = this;

        // register events //
        this.on("log_info", function(text) {
            self.logs += "<span style='color: #ffffff;'>[" + moment().format("HH:mm:ss") + "] " + text + "</span><br>";
        });
        this.on("log_err", function(text) {
            self.logs += "<span style='color: #ed4949;'>[" + moment().format("HH:mm:ss") + "] " + text + "</span><br>";
        });
        this.on("log_debug", function(text) {
            self.logs += "<span style='color: #1c8ed7;'>[" + moment().format("HH:mm:ss") + "] " + text + "</span><br>";
        });
    }

    log(text) {
        this.events.emit("log_info", text);
    }

    err(text) {
        this.events.emit("log_err", text);
    }

    debug(text) {
        this.events.emit("log_debug", text);
    }

    send(packet) {
        this.socket.send(packet);
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
    }

    disconnect() {
        this.socket.close();
    }

    on(event_name, event_handler) {
        this.events.on(event_name, event_handler);
    }
    off(event_name) {
        this.events.off(event_name);
    }
    emit(event_name, ...args) {
        this.events.emit(event_name, args);
    }
}

module.exports = Bot;