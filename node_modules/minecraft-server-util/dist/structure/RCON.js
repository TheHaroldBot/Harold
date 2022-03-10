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
const assert_1 = __importDefault(require("assert"));
const events_1 = require("events");
const resolveSRV_1 = __importDefault(require("../util/resolveSRV"));
const TCPSocket_1 = __importDefault(require("./TCPSocket"));
const Packet_1 = __importDefault(require("./Packet"));
const util_1 = require("util");
const encoder = new util_1.TextEncoder();
const decoder = new util_1.TextDecoder('utf-8');
const ipAddressRegEx = /^\d{1,3}(\.\d{1,3}){3}$/;
function applyDefaultOptions(options) {
    // Apply the provided options on the default options
    return Object.assign({
        port: 25575,
        password: '',
        timeout: 1000 * 15,
        enableSRV: true
    }, options);
}
/**
 * A utility class for executing commands remotely on a Minecraft server.
 * @class
 * @extends {EventEmitter}
 * @implements {RCONEvents}
 */
class RCON extends events_1.EventEmitter {
    /**
     * Creates a new RCON class with the host and options
     * @param {string} host The host of the server
     * @param {RCONOptions} [options] The options for the RCON client
     * @constructor
     */
    constructor(host, options) {
        super();
        this.socket = null;
        const opts = applyDefaultOptions(options);
        assert_1.default(typeof host === 'string', `Expected 'host' to be a string, got ${typeof host}`);
        assert_1.default(host.length > 0, `Expected host.length > 0, got ${host.length}`);
        assert_1.default(typeof opts.port === 'number', `Expected 'options.port' to be a number, got ${typeof opts.port}`);
        assert_1.default(opts.port > 0, `Expected 'options.port' to be greater than 0, got ${opts.port}`);
        assert_1.default(opts.port < 65536, `Expected 'options.port' to be less than 65536, got ${opts.port}`);
        assert_1.default(Number.isInteger(opts.port), `Expected 'options.port' to be an integer, got ${opts.port}`);
        assert_1.default(typeof opts.enableSRV === 'boolean', `Expected 'options.enableSRV' to be a boolean, got ${typeof opts.enableSRV}`);
        assert_1.default(typeof opts.timeout === 'number', `Expected 'options.timeout' to be a number, got ${typeof opts.timeout}`);
        assert_1.default(opts.timeout > 0, `Expected 'options.timeout' to be greater than 0, got ${opts.timeout}`);
        assert_1.default(Number.isInteger(opts.timeout), `Expected 'options.timeout' to be an integer, got ${opts.timeout}`);
        assert_1.default(typeof opts.password === 'string', `Expected 'options.password' to be a string, got ${typeof opts.password}`);
        assert_1.default(opts.password.length > 0, `Expected options.password.length > 0, got ${opts.password.length}`);
        this.host = host;
        this.isLoggedIn = false;
        this.options = opts;
        this.requestID = 0;
    }
    /**
     * Connects to the server using TCP and sends the correct login packets.
     * @returns {Promise<void>} A Promise that resolves when it has successfully logged in
     * @async
     */
    connect() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let srvRecord = null;
            // Automatically resolve a connectable address from a known address using SRV DNS records
            if (this.options.enableSRV && !ipAddressRegEx.test(this.host)) {
                srvRecord = yield resolveSRV_1.default(this.host);
            }
            // Create a TCP connection to the server and wait for it to connect
            this.socket = yield TCPSocket_1.default.connect((_a = srvRecord === null || srvRecord === void 0 ? void 0 : srvRecord.host) !== null && _a !== void 0 ? _a : this.host, (_b = srvRecord === null || srvRecord === void 0 ? void 0 : srvRecord.port) !== null && _b !== void 0 ? _b : this.options.port, this.options.timeout);
            {
                // Create a login packet and send it to the server
                // https://wiki.vg/RCON#3:_Login
                const loginPacket = new Packet_1.default();
                loginPacket.writeIntLE(10 + this.options.password.length);
                loginPacket.writeIntLE(++this.requestID);
                loginPacket.writeIntLE(3);
                loginPacket.writeString(this.options.password, false);
                loginPacket.writeByte(0x00, 0x00);
                yield this.socket.writePacket(loginPacket, false);
            }
            {
                // Wait for the next packet back, determine if the login was successful
                const length = yield this.socket.readIntLE();
                const requestID = yield this.socket.readIntLE();
                yield this.socket.readIntLE();
                if (requestID === -1)
                    throw new Error('Failed to connect to RCON, invalid password');
                yield this.socket.readBytes(length - 8);
            }
            this.isLoggedIn = true;
            process.nextTick(() => __awaiter(this, void 0, void 0, function* () {
                while (this.socket !== null) {
                    yield this._readPacket();
                }
            }));
        });
    }
    /**
     * Waits for the next incoming packet from the stream and parses it.
     * @returns {Promise<void>}
     * @async
     * @private
     */
    _readPacket() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.socket === null)
                return;
            const length = yield this.socket.readIntLE();
            const requestID = yield this.socket.readIntLE();
            const packetType = yield this.socket.readIntLE();
            switch (packetType) {
                case 0: {
                    let output = '';
                    if (length > 10) {
                        output = decoder.decode(yield this.socket.readBytes(length - 10));
                    }
                    this.emit('output', output);
                    this.emit(`output_${requestID}`, output);
                    yield this.socket.readBytes(2);
                    break;
                }
                default: {
                    yield this.socket.readBytes(length - 8);
                    this.emit('warning', 'Received an unknown packet type: ' + packetType);
                    break;
                }
            }
        });
    }
    /**
     * Executes commands on the server after it has successfully logged in
     * @param {string} command The command to execute
     * @returns {Promise<void>} The Promise that resolves whenever the command has executed
     * @async
     */
    run(command) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.socket === null || this.socket.socket.connecting)
                throw new Error('Socket has not connected yet, please run RCON#connect()');
            if (!this.isLoggedIn)
                throw new Error('Client is not logged in or login was unsuccessful, please run RCON#connect()');
            const commandBytes = encoder.encode(command);
            const commandPacket = new Packet_1.default();
            commandPacket.writeIntLE(10 + commandBytes.length);
            commandPacket.writeIntLE(++this.requestID);
            commandPacket.writeIntLE(2);
            commandPacket.writeBuffer(commandBytes);
            commandPacket.writeByte(0x00, 0x00);
            return this.socket.writePacket(commandPacket, false);
        });
    }
    /**
     * Executes commands on the server after it has successfully logged in and waits for the result of command execution
     * @param command The command to execute
     * @param timeout Maximum waiting time. Default: 5000
     * @returns
     */
    execute(command, timeout = 5000) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.socket === null || this.socket.socket.connecting)
                throw new Error('Socket has not connected yet, please run RCON#connect()');
            if (!this.isLoggedIn)
                throw new Error('Client is not logged in or login was unsuccessful, please run RCON#connect()');
            const commandBytes = encoder.encode(command);
            const requestID = ++this.requestID;
            const commandPacket = new Packet_1.default();
            commandPacket.writeIntLE(10 + commandBytes.length);
            commandPacket.writeIntLE(requestID);
            commandPacket.writeIntLE(2);
            commandPacket.writeBuffer(commandBytes);
            commandPacket.writeByte(0x00, 0x00);
            yield this.socket.writePacket(commandPacket, false);
            return new Promise((resolve, reject) => {
                const EVT_KEY = `output_${requestID}`;
                let complete = false;
                const timer = setTimeout(() => {
                    if (!complete) {
                        complete = true;
                        this.off(EVT_KEY, onResponse);
                        reject(new Error('RCON exec timeout'));
                    }
                }, timeout);
                const onResponse = (output) => {
                    if (!complete) {
                        clearTimeout(timer);
                        complete = true;
                        return resolve(output);
                    }
                };
                this.once(EVT_KEY, onResponse);
            });
        });
    }
    exec(command, timeout = 5000) {
        return this.execute(command, timeout);
    }
    /**
     * Closes the connection to the server
     * @returns {Promise<void>} A Promise that resolves when the connection has closed
     * @async
     */
    close() {
        if (this.socket === null)
            throw new Error('Socket is already closed');
        return this.socket.destroy();
    }
}
exports.default = RCON;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUkNPTi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHJ1Y3R1cmUvUkNPTi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLG9EQUE0QjtBQUM1QixtQ0FBc0M7QUFDdEMsb0VBQTJEO0FBQzNELDREQUFvQztBQUNwQyxzREFBOEI7QUFFOUIsK0JBQWdEO0FBRWhELE1BQU0sT0FBTyxHQUFHLElBQUksa0JBQVcsRUFBRSxDQUFDO0FBQ2xDLE1BQU0sT0FBTyxHQUFHLElBQUksa0JBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN6QyxNQUFNLGNBQWMsR0FBRyx5QkFBeUIsQ0FBQztBQU9qRCxTQUFTLG1CQUFtQixDQUFDLE9BQXFCO0lBQ2pELG9EQUFvRDtJQUNwRCxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDcEIsSUFBSSxFQUFFLEtBQUs7UUFDWCxRQUFRLEVBQUUsRUFBRTtRQUNaLE9BQU8sRUFBRSxJQUFJLEdBQUcsRUFBRTtRQUNsQixTQUFTLEVBQUUsSUFBSTtLQUNVLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDdEMsQ0FBQztBQUVEOzs7OztHQUtHO0FBQ0gsTUFBTSxJQUFLLFNBQVEscUJBQVk7SUFPOUI7Ozs7O09BS0c7SUFDSCxZQUFZLElBQVksRUFBRSxPQUFxQjtRQUM5QyxLQUFLLEVBQUUsQ0FBQztRQVZELFdBQU0sR0FBcUIsSUFBSSxDQUFDO1FBWXZDLE1BQU0sSUFBSSxHQUFHLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTFDLGdCQUFNLENBQUMsT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFLHVDQUF1QyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUM7UUFDdkYsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxpQ0FBaUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDeEUsZ0JBQU0sQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJ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