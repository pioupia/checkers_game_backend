"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Connection {
    id;
    constructor(id) {
        this.id = id;
    }
    socketError(err) {
        console.error(`[ERROR] [${this.id}]: `, err);
    }
}
exports.default = Connection;
//# sourceMappingURL=connection.js.map