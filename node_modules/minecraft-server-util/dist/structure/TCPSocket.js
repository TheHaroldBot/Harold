"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const domain_1 = __importDefault(require("domain"));
const assert_1 = __importDefault(require("assert"));
const net_1 = __importDefault(require("net"));
const Packet_1 = __importDefault(require("./Packet"));
/**
 * A TCP socket utility class for easily interacting with remote sockets.
 * @class
 */
class TCPSocket {
    /**
     * Creates a new TCP socket class from the existing connection.
     * @param {net.Socket} socket The existing TCP connection
     * @constructor
     */
    constructor(socket) {
        /**
         * A boolean that indicates whether the socket is connected or not.
         * @type {boolean}
         */
        this.isConnected = false;
        this.socket = socket;
        this.buffer = Buffer.alloc(0);
        socket.on('data', (data) => {
            this.buffer = Buffer.concat([this.buffer, data]);
        });
    }
    /**
     * Automatically connects to the server using the host and port.
     * @param {string} host The host of the server
     * @param {number} port The port of the server
     * @param {number} timeout The timeout in milliseconds
     * @returns {Promise<TCPSocket>} A Promise that resolves to the TCP socket
     * @async
     */
    static connect(host, port, timeout) {
        assert_1.default(host.length > 0, 'Expected host.length > 0, got ' + host.length);
        assert_1.default(Number.isInteger(port), 'Expected integer, got ' + port);
        assert_1.default(port > 0, 'Expected port > 0, got ' + port);
        assert_1.default(port < 65536, 'Expected port < 65536, got ' + port);
        assert_1.default(timeout > 0, 'Expected timeout > 0, got ' + timeout);
        return new Promise((resolve, reject) => {
            // Using the 'domain' package here is not ideal but it is the only working
            // solution to fix this severe error with the limited time I have. Node
            // seems to be ignoring my `error` handler entirely, whether it's in this
            // method or `readByte()`, I am unsure. The error is being tracked at
            // https://github.com/PassTheMayo/minecraft-server-util/issues/50
            const d = domain_1.default.create();
            d.on('error', (error) => {
                reject(error);
            });
            d.run(() => {
                const cleanupHandlers = () => {
                    socket.removeListener('connect', connectHandler);
                    socket.removeListener('close', closeHandler);
                    socket.removeListener('end', endHandler);
                    socket.removeListener('error', errorHandler);
                    socket.removeListener('timeout', timeoutHandler);
                };
                const connectHandler = () => {
                    cleanupHandlers();
                    resolve(new TCPSocket(socket));
                };
                const closeHandler = () => {
                    cleanupHandlers();
                    reject();
                };
                const endHandler = () => {
                    cleanupHandlers();
                    reject();
                };
                const errorHandler = (error) => {
                    cleanupHandlers();
                    reject(error);
                };
                const timeoutHandler = () => {
                    cleanupHandlers();
                    reject();
                };
                const socket = net_1.default.createConnection({ host, port, timeout });
                socket.on('connect', connectHandler);
                socket.on('close', closeHandler);
                socket.on('end', endHandler);
                socket.on('error', errorHandler);
                socket.on('timeout', timeoutHandler);
                socket.setTimeout(timeout);
            });
        });
    }
    /**
     * Reads a byte from the stream.
     * @returns {Promise<number>} The byte read from the stream
     * @async
     */
    readByte() {
        if (this.buffer.byteLength > 0) {
            const value = this.buffer[0];
            this.buffer = this.buffer.slice(1);
            return Promise.resolve(value);
        }
        return new Promise((resolve, reject) => {
            let read = false;
            const cleanupHandlers = () => {
                this.socket.removeListener('data', dataHandler);
                this.socket.removeListener('error', errorHandler);
                this.socket.removeListener('end', endHandler);
            };
            const dataHandler = () => {
                if (read)
                    return;
                if (this.buffer.byteLength > 0) {
                    read = true;
                    cleanupHandlers();
                    const value = this.buffer[0];
                    this.buffer = this.buffer.slice(1);
                    return resolve(value);
                }
            };
            const errorHandler = (error) => {
                cleanupHandlers();
                reject(error);
            };
            const endHandler = () => {
                cleanupHandlers();
                reject(new Error('Socket ended without sending any data back'));
            };
            const timeoutHandler = () => {
                cleanupHandlers();
                reject(new Error('Socket timed out while waiting for data'));
            };
            this.socket.on('data', dataHandler);
            this.socket.on('error', errorHandler);
            this.socket.on('end', endHandler);
            this.socket.on('close', endHandler);
            this.socket.on('timeout', timeoutHandler);
        });
    }
    /**
     * Read bytes from the stream.
     * @param {number} length The amount of bytes to read
     * @returns {Promise<Buffer>} The bytes read from the stream
     * @async
     */
    readBytes(length) {
        if (this.buffer.byteLength >= length) {
            const value = this.buffer.slice(0, length);
            this.buffer = this.buffer.slice(length);
            return Promise.resolve(value);
        }
        return new Promise((resolve) => {
            let read = false;
            const dataHandler = () => {
                if (read)
                    return;
                process.nextTick(() => {
                    if (this.buffer.byteLength >= length) {
                        read = true;
                        this.socket.removeListener('data', dataHandler);
                        const value = this.buffer.slice(0, length);
                        this.buffer = this.buffer.slice(length);
                        return resolve(value);
                    }
                });
            };
            this.socket.on('data', dataHandler);
        });
    }
    /**
     * Read a varint from the stream.
     * @returns {Promise<number>} The varint read from the stream
     * @async
     */
    readVarInt() {
        return __awaiter(this, void 0, void 0, function* () {
            let numRead = 0;
            let result = 0;
            let read, value;
            do {
                if (numRead > 4)
                    throw new Error('VarInt exceeds data bounds');
                read = yield this.readByte();
                value = (read & 0b01111111);
                result |= (value << (7 * numRead));
                numRead++;
                if (numRead > 5)
                    throw new Error('VarInt is too big');
            } while ((read & 0b10000000) != 0);
            return result;
        });
    }
    /**
     * Reads a short (int16, big-endian) from the stream.
     * @returns {Promise<number>} The int16 read from the stream
     * @async
     */
    readShort() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.readBytes(2);
            return (data[0] << 8) | data[1];
        });
    }
    /**
     * Reads a short (int16, little-endian) from the stream.
     * @returns {Promise<number>} The int16 read from the stream
     * @async
     */
    readIntLE() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.readBytes(4);
            return data[0] | (data[1] << 8) | (data[2] << 16) | (data[3] << 24);
        });
    }
    /**
     * Writes bytes to the stream.
     * @param {Buffer} buffer The buffer to write to the stream.
     * @returns {Promise<void>} The Promise that resolves when it has successfully written the data
     * @async
     */
    writeBytes(buffer) {
        return new Promise((resolve, reject) => {
            this.socket.write(buffer, (error) => {
                if (error)
                    return reject(error);
                resolve();
            });
        });
    }
    /**
     * Writes a {@see Packet} to the stream.
     * @param {Packet} packet The Packet to write to the stream
     * @param {boolean} [prefixLength=true] Write the packet length as a prefix as a varint
     * @returns {Promise<void>} The Promise that resolves when the packet has been written
     * @async
     */
    writePacket(packet, prefixLength = true) {
        if (prefixLength) {
            const finalPacket = new Packet_1.default();
            finalPacket.writeVarInt(packet.buffer.byteLength);
            finalPacket.writeBuffer(packet.buffer);
            return this.writeBytes(Buffer.from(finalPacket.buffer));
        }
        return this.writeBytes(Buffer.from(packet.buffer));
    }
    /**
     * Closes the stream and cleans up data.
     * @returns {Promise<void>} The Promise that resolves when the connection has closed
     * @async
     */
    destroy() {
        return new Promise((resolve) => {
            this.socket.removeAllListeners();
            this.socket.end(() => {
                this.socket.destroy();
                resolve();
            });
        });
    }
}
exports.default = TCPSocket;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVENQU29ja2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cnVjdHVyZS9UQ1BTb2NrZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxvREFBNEI7QUFDNUIsb0RBQTRCO0FBQzVCLDhDQUFzQjtBQUN0QixzREFBOEI7QUFFOUI7OztHQUdHO0FBQ0gsTUFBTSxTQUFTO0lBYWQ7Ozs7T0FJRztJQUNILFlBQVksTUFBa0I7UUFaOUI7OztXQUdHO1FBQ0ksZ0JBQVcsR0FBRyxLQUFLLENBQUM7UUFTMUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTlCLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDMUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2xELENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCxNQUFNLENBQUMsT0FBTyxDQUFDLElBQVksRUFBRSxJQUFZLEVBQUUsT0FBZTtRQUN6RCxnQkFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLGdDQUFnQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4RSxnQkFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsd0JBQXdCLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDaEUsZ0JBQU0sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFLHlCQUF5QixHQUFHLElBQUksQ0FBQyxDQUFDO1FBQ25ELGdCQUFNLENBQUMsSUFBSSxHQUFHLEtBQUssRUFBRSw2QkFBNkIsR0FBRyxJ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