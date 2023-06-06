import WebSocket from "ws";

export default class Connection {
    id: string;
    private ws: WebSocket.WebSocket;

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
            case 'first':
                this.ws.send(RESPONSE_CODE.first);
                break;
            case 'second':
                this.ws.send(RESPONSE_CODE.second);
                break;
        }
    }
}

type response_types = 'disconnect' | 'first' | 'second';

enum RESPONSE_CODE {
    close_connection,
    first,
    second
}