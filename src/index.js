"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
class Website extends ws_1.WebSocketServer {
    sessions;
    constructor(props) {
        super(props);
        this.sessions = new Set();
        this.on('connection', this.connection.bind(this));
    }
    connection(ws) {
        console.log(ws);
    }
    generateConnectionId() {
    }
}
new Website({
    port: 8000,
    perMessageDeflate: {
        zlibDeflateOptions: {
            chunkSize: 1024,
            memLevel: 7,
            level: 3
        },
        zlibInflateOptions: {
            chunkSize: 10 * 1024
        },
        clientNoContextTakeover: true,
        serverNoContextTakeover: true,
        serverMaxWindowBits: 10,
        concurrencyLimit: 10,
        threshold: 1024 // Size (in bytes) below which messages
    }
});
//# sourceMappingURL=index.js.map