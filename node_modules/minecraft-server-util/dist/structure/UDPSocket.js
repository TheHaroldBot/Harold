"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dgram_1 = __importDefault(require("dgram"));
const Packet_1 = __importDefault(require("./Packet"));
const TimeoutPromise_1 = __importDefault(require("./TimeoutPromise"));
/**
 * A UDP socket class for reading and writing data to a remote socket.
 * @class
 */
class UDPSocket {
    /**
     * Creates a new UDP socket class from the host and port.
     * @param {string} host The host of the server
     * @param {number} port The port of the server
     * @param {number} timeout The timeout in milliseconds
     * @constructor
     */
    constructor(host, port, timeout) {
        this.host = host;
        this.port = port;
        this.timeout = timeout;
        this.socket = dgram_1.default.createSocket('udp4');
        this.buffer = [];
        this.socket.on('message', (message, info) => {
            this.buffer.push({ info, message });
        });
    }
    /**
     * Reads a packet from the UDP socket.
     * @returns {Promise<Packet>} The packet read from the socket
     * @async
     */
    readPacket() {
        var _a;
        if (this.buffer.length > 0) {
            const packet = new Packet_1.default();
            if (this.buffer.length > 0) {
                const value = this.buffer.shift();
                packet.buffer = (_a = value === null || value === void 0 ? void 0 : value.message) !== null && _a !== void 0 ? _a : Buffer.alloc(0);
            }
            return Promise.resolve(packet);
        }
        const timeoutPromise = new TimeoutPromise_1.default(this.timeout, new Error('Timed out while waiting for server response'));
        const actualPromise = new Promise((resolve, reject) => {
            let read = false;
            const cleanupHandlers = () => {
                this.socket.removeListener('message', messageHandler);
                this.socket.removeListener('error', errorHandler);
                this.socket.removeListener('close', closeHandler);
            };
            const messageHandler = () => {
                var _a;
                if (read)
                    return;
                if (this.buffer.length > 0) {
                    read = true;
                    cleanupHandlers();
                    const packet = new Packet_1.default();
                    if (this.buffer.length > 0) {
                        const value = this.buffer.shift();
                        packet.buffer = (_a = value === null || value === void 0 ? void 0 : value.message) !== null && _a !== void 0 ? _a : Buffer.alloc(0);
                    }
                    resolve(packet);
                }
            };
            const errorHandler = (error) => {
                cleanupHandlers();
                reject(error);
            };
            const closeHandler = () => {
                cleanupHandlers();
                reject(new Error('Socket ended without sending any data back'));
            };
            this.socket.on('message', messageHandler);
            this.socket.on('error', errorHandler);
            this.socket.on('close', closeHandler);
        });
        return Promise.race([
            timeoutPromise.promise,
            actualPromise
        ]);
    }
    /**
     * Writes a packet to the UDP connection.
     * @param {Packet} packet The packet to write to the connection
     * @returns {Promise<void>} A Promise that resolves when it has written the packet
     * @async
     */
    writePacket(packet) {
        return new Promise((resolve, reject) => {
            this.socket.send(Buffer.from(packet.buffer), this.port, this.host, (error) => {
                if (error)
                    return reject(error);
                resolve();
            });
        });
    }
    /**
     * Closes the connection and cleans up data.
     * @returns {Promise<void>} A Promise that resolves when the client has closed
     * @async
     */
    destroy() {
        return new Promise((resolve) => {
            this.socket.removeAllListeners();
            this.socket.close(() => {
                resolve();
            });
        });
    }
}
exports.default = UDPSocket;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVURQU29ja2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cnVjdHVyZS9VRFBTb2NrZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBMEI7QUFDMUIsc0RBQThCO0FBQzlCLHNFQUE4QztBQUU5Qzs7O0dBR0c7QUFDSCxNQUFNLFNBQVM7SUFVZDs7Ozs7O09BTUc7SUFDSCxZQUFZLElBQVksRUFBRSxJQUFZLEVBQUUsT0FBZTtRQUN0RCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixJQUFJLENBQUMsTUFBTSxHQUFHLGVBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFFakIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFO1lBQzNDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDckMsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILFVBQVU7O1FBQ1QsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDM0IsTUFBTSxNQUFNLEdBQUcsSUFBSSxnQkFBTSxFQUFFLENBQUM7WUFFNUIsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQzNCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBRWxDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsTUFBQSxLQUFLLGFBQUwsS0FBSyx1QkFB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