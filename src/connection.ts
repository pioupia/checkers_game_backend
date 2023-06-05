import WebSocket from "ws";

export default class Connection {
    id: string;
    ws: WebSocket.WebSocket;

    constructor(id: string, ws: WebSocket.WebSocket) {
        this.id = id;
        this.ws = ws;
    }

    public socketError(err: any) {
        console.error(`[ERROR] [${this.id}]: `, err);
    }

    public message(data: WebSocket.RawData) {
        this.ws.send(
            0b0
        )
    }

    public send(data: response_types) {
        switch (data) {
            case 'disconnect':
                this.ws.send(RESPONSE_CODE.close_connection);
                break;
        }
    }
}

type response_types = 'disconnect';

enum RESPONSE_CODE {
    close_connection
}