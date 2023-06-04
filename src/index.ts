import WebSocket, { WebSocketServer } from 'ws';
import Connection from "./connection";

const CHAR = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const CHAR_LEN = CHAR.length;

class Website extends WebSocketServer {
    sessions: Set<Connection>;

    constructor(props: WebSocket.ServerOptions | undefined) {
        super(props);

        this.sessions = new Set();

        this.on('connection', this.connection.bind(this));
    }

    private connection(ws: WebSocket.WebSocket) {
        const connection = new Connection(this.generateConnectionId(), ws);
        this.sessions.add(connection);

        ws.on('error', connection.socketError.bind(connection));
        ws.on('message', connection.message.bind(connection));
    }

    private generateConnectionId() {
        let id = "";
        for (let i = 0; i < 10; i++) {
            const index = Math.floor(Math.random() * Date.now()) % CHAR_LEN;
            id += CHAR[index];
        }

        return id;
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
        clientNoContextTakeover: true, // Defaults to negotiated value.
        serverNoContextTakeover: true, // Defaults to negotiated value.
        serverMaxWindowBits: 10, // Defaults to negotiated value.
        concurrencyLimit: 10, // Limits zlib concurrency for perf.
        threshold: 1024 // Size (in bytes) below which messages
    }
})