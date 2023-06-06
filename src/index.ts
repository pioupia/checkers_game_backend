import WebSocket, { WebSocketServer } from 'ws';
import Connection from "./connection";

const CHAR = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const CHAR_LEN = CHAR.length;

class Website extends WebSocketServer {
    sessions: Set<Connection>;
    rooms: Map<string, Connection[]>;
    waitingPlayer: Connection[];

    constructor(props: WebSocket.ServerOptions | undefined) {
        super(props);

        this.sessions = new Set();
        this.rooms = new Map();

        this.waitingPlayer = [];

        this.on('connection', this.connection.bind(this));
    }

    private connectPlayer(connection: Connection) {
        this.waitingPlayer.push(connection);

        if (this.waitingPlayer.length === 2) {
            this.rooms.set(this.generateConnectionId(), this.waitingPlayer);

            this.waitingPlayer[0].send('first');
            this.waitingPlayer[1].send('second');

            this.waitingPlayer = [];
        }
    }

    private disconnectPlayer(connection: Connection) {
        this.sessions.delete(connection);

        for (let i = 0; i < this.waitingPlayer.length; i++) {
            if (this.waitingPlayer[i].id === connection.id) {
                this.waitingPlayer.splice(i, 1);
                break;
            }
        }

        for (const [key, players] of this.rooms.entries()) {
            const index = players[0] === connection ?
                0 : players[1] === connection ?
                    1 : undefined;
            if (index === undefined) continue;

            const roomMate = players[index ? 0 : 1];
            if (roomMate) {
                this.connectPlayer(roomMate);
                roomMate.send('disconnect');
            }

            this.rooms.delete(key);

            break;
        }
    }

    private connection(ws: WebSocket.WebSocket) {
        const connection = new Connection(this.generateConnectionId(), ws);
        this.sessions.add(connection);

        this.connectPlayer(connection);

        ws.on('error', connection.socketError.bind(connection));
        ws.on('message', connection.message.bind(connection));
        ws.on('close', () => {
            this.disconnectPlayer(connection);
        });
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