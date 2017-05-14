var ClientSocket = require("./network/client_socket.js");
var moment = require("moment");
var settings = require('electron-settings');

const BotState = {
    DISCONNECTED: 0,
    IN_AUTH : 1,
    IN_GAME : 2
};

class Bot {
    constructor(account) {
        this.events = new Events();
        this.logs = "";
        this.state = BotState.DISCONNECTED;
        this.account = account;
        let self = this;

        // register events //
        this.on("log_info", function(text) {
            self.emit("log", "<span style='color: #ffffff;'>[" + moment().format("HH:mm:ss") + "] " + text + "</span><br>");
        });
        this.on("log_err", function(text) {
            self.emit("log", "<span style='color: #ed4949;'>[" + moment().format("HH:mm:ss") + "] " + text + "</span><br>");
        });
        this.on("log_debug", function(text) {
            if (settings.get("debug", false) == true)
                self.emit("log", "<span style='color: #1c8ed7;'>[" + moment().format("HH:mm:ss") + "] " + text + "</span><br>");
        });
        this.on("log", function(text) {
            self.logs += text;
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

    get connection_mode() {
        return "FULL_SOCKET";
    }

    connect() {
        switch (this.connection_mode) {
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
    get is_connected() {
        return this.state != BotState.DISCONNECTED;
    }
}

module.exports = Bot;
module.exports.BotState = BotState;