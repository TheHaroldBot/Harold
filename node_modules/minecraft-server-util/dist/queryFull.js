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
const Packet_1 = __importDefault(require("./structure/Packet"));
const resolveSRV_1 = __importDefault(require("./util/resolveSRV"));
const UDPSocket_1 = __importDefault(require("./structure/UDPSocket"));
const parseDescription_1 = __importDefault(require("./util/parseDescription"));
const ipAddressRegEx = /^\d{1,3}(\.\d{1,3}){3}$/;
let sessionCounter = 0;
function applyDefaultOptions(options) {
    // Apply the provided options on the default options
    return Object.assign({
        port: 25565,
        timeout: 1000 * 5,
        enableSRV: true,
        sessionID: ++sessionCounter
    }, options);
}
/**
 * Performs a full query on the server using the UDP protocol.
 * @param {string} host The host of the server
 * @param {QueryOptions} [options] The options to use when performing the query
 * @returns {Promise<FullQueryResponse>} The full query response data
 * @async
 */
function queryFull(host, options) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return __awaiter(this, void 0, void 0, function* () {
        // Applies the provided options on top of the default options
        const opts = applyDefaultOptions(options);
        // Assert that the arguments are the correct type and format
        assert_1.default(typeof host === 'string', `Expected 'host' to be a string, got ${typeof host}`);
        assert_1.default(host.length > 0, 'Expected \'host\' to have content, got an empty string');
        assert_1.default(typeof options === 'object' || typeof options === 'undefined', `Expected 'options' to be an object or undefined, got ${typeof options}`);
        assert_1.default(typeof opts === 'object', `Expected 'options' to be an object, got ${typeof opts}`);
        assert_1.default(typeof opts.port === 'number', `Expected 'options.port' to be a number, got ${typeof opts.port}`);
        assert_1.default(opts.port > 0, `Expected 'options.port' to be greater than 0, got ${opts.port}`);
        assert_1.default(opts.port < 65536, `Expected 'options.port' to be less than 65536, got ${opts.port}`);
        assert_1.default(Number.isInteger(opts.port), `Expected 'options.port' to be an integer, got ${opts.port}`);
        assert_1.default(typeof opts.timeout === 'number', `Expected 'options.timeout' to be a number, got ${typeof opts.timeout}`);
        assert_1.default(opts.timeout > 0, `Expected 'options.timeout' to be greater than 0, got ${opts.timeout}`);
        assert_1.default(typeof opts.sessionID === 'number', `Expected 'options.sessionID' to be a number, got ${typeof opts.sessionID}`);
        assert_1.default(opts.sessionID > 0, `Expected 'options.sessionID' to be greater than 0, got ${opts.sessionID}`);
        assert_1.default(opts.sessionID < 0xFFFFFFFF, `Expected 'options.sessionID' to be less than ${0xFFFFFFFF}, got ${opts.sessionID}`);
        assert_1.default(Number.isInteger(opts.sessionID), `Expected 'options.sessionID' to be an integer, got ${opts.sessionID}`);
        assert_1.default(typeof opts.enableSRV === 'boolean', `Expected 'options.enableSRV' to be a boolean, got ${typeof opts.enableSRV}`);
        // Only the last 4 bits of each byte is used when sending a session ID
        opts.sessionID &= 0x0F0F0F0F;
        let challengeToken;
        let srvRecord = null;
        // Automatically resolve from host (e.g. play.hypixel.net) into a connect-able address
        if (opts.enableSRV && !ipAddressRegEx.test(host)) {
            srvRecord = yield resolveSRV_1.default(host);
        }
        const startTime = Date.now();
        // Create a new UDP connection to the specified address
        const socket = new UDPSocket_1.default((_a = srvRecord === null || srvRecord === void 0 ? void 0 : srvRecord.host) !== null && _a !== void 0 ? _a : host, opts.port, opts.timeout);
        try {
            {
                // Create a Handshake packet and send it to the server
                // https://wiki.vg/Query#Request
                const requestPacket = new Packet_1.default();
                requestPacket.writeByte(0xFE, 0xFD, 0x09);
                requestPacket.writeIntBE(opts.sessionID);
                yield socket.writePacket(requestPacket);
            }
            {
                // Read the response packet for the Handshake from the server
                // https://wiki.vg/Query#Response
                const responsePacket = yield socket.readPacket();
                const type = responsePacket.readByte();
                const sessionID = responsePacket.readIntBE();
                challengeToken = parseInt(responsePacket.readStringNT());
                if (type !== 0x09)
                    throw new Error('Server sent an invalid payload type');
                if (sessionID !== opts.sessionID)
                    throw new Error('Session ID in response did not match client session ID');
                if (isNaN(challengeToken))
                    throw new Error('Server sent an invalid challenge token');
            }
            {
                // Create a Full Stat Request packet and send it to the server
                // https://wiki.vg/Query#Request_3
                const requestPacket = new Packet_1.default();
                requestPacket.writeByte(0xFE, 0xFD, 0x00);
                requestPacket.writeIntBE(opts.sessionID);
                requestPacket.writeIntBE(challengeToken);
                requestPacket.writeByte(0x00, 0x00, 0x00, 0x00);
                yield socket.writePacket(requestPacket);
            }
            const players = [];
            let gameType, version, software, levelName, plugins, onlinePlayers, maxPlayers, description;
            {
                // Create an empty map of key,value pairs for the response
                const map = new Map();
                // Read the response packet for the Full stat from the server
                const responsePacket = yield socket.readPacket();
                const type = responsePacket.readByte();
                const sessionID = responsePacket.readIntBE();
                if (type !== 0x00)
                    throw new Error('Server sent an invalid payload type');
                if (sessionID !== opts.sessionID)
                    throw new Error('Session ID in response did not match client session ID');
                responsePacket.readBytes(11);
                let key;
                while ((key = responsePacket.readStringNT()) !== '') {
                    map.set(key, responsePacket.readStringNT());
                }
                responsePacket.readBytes(10);
                let player;
                while ((player = responsePacket.readStringNT()) !== '') {
                    players.push(player);
                }
                const pluginsRaw = (map.get('plugins') || '').split(';');
                gameType = (_b = map.get('gametype')) !== null && _b !== void 0 ? _b : null;
                version = (_c = map.get('version')) !== null && _c !== void 0 ? _c : null;
                software = (_d = pluginsRaw[0]) !== null && _d !== void 0 ? _d : null;
                plugins = pluginsRaw.slice(1);
                levelName = (_e = map.get('map')) !== null && _e !== void 0 ? _e : null;
                onlinePlayers = (_f = parseInt(map.get('numplayers') || '')) !== null && _f !== void 0 ? _f : null;
                maxPlayers = (_g = parseInt(map.get('maxplayers') || '')) !== null && _g !== void 0 ? _g : null;
                description = parseDescription_1.default((_h = map.get('motd')) !== null && _h !== void 0 ? _h : '');
            }
            return {
                host,
                port: opts.port,
                srvRecord,
                gameType,
                version,
                software,
                plugins,
                levelName,
                onlinePlayers,
                maxPlayers,
                players,
                description,
                roundTripLatency: Date.now() - startTime
            };
        }
        finally {
            // Destroy the socket, it is no longer needed
            yield socket.destroy();
        }
    });
}
exports.default = queryFull;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnlGdWxsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3F1ZXJ5RnVsbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLG9EQUE0QjtBQUM1QixnRUFBd0M7QUFDeEMsbUVBQTBEO0FBRTFELHNFQUE4QztBQUM5QywrRUFBdUQ7QUFHdkQsTUFBTSxjQUFjLEdBQUcseUJBQXlCLENBQUM7QUFDakQsSUFBSSxjQUFjLEdBQUcsQ0FBQyxDQUFDO0FBRXZCLFNBQVMsbUJBQW1CLENBQUMsT0FBc0I7SUFDbEQsb0RBQW9EO0lBQ3BELE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNwQixJQUFJLEVBQUUsS0FBSztRQUNYLE9BQU8sRUFBRSxJQUFJLEdBQUcsQ0FBQztRQUNqQixTQUFTLEVBQUUsSUFBSTtRQUNmLFNBQVMsRUFBRSxFQUFFLGNBQWM7S0FDRCxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3ZDLENBQUM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxTQUE4QixTQUFTLENBQUMsSUFBWSxFQUFFLE9BQXNCOzs7UUFDM0UsNkRBQTZEO1FBQzdELE1BQU0sSUFBSSxHQUFHLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTFDLDREQUE0RDtRQUM1RCxnQkFBTSxDQUFDLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRSx1Q0FBdUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZGLGdCQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsd0RBQXdELENBQUMsQ0FBQztRQUNsRixnQkFBTSxDQUFDLE9BQU8sT0FBTyxLQUFLLFFBQVEsSUFBSSxPQUFPLE9BQU8sS0FBSyxXQUFXLEVBQUUsd0RBQXdELE9BQU8sT0FBTyxFQUFFLENBQUMsQ0FBQztRQUNoSixnQkFBTSxDQUFDLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRSwyQ0FBMkMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQzNG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