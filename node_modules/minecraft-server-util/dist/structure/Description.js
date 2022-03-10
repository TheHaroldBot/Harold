"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ansi_styles_1 = __importDefault(require("ansi-styles"));
const formattingCode = /\u00C2?\u00A7([a-fklmnor0-9])/g;
const ansiMap = new Map();
ansiMap.set('0', ansi_styles_1.default.black);
ansiMap.set('1', ansi_styles_1.default.blue);
ansiMap.set('2', ansi_styles_1.default.green);
ansiMap.set('3', ansi_styles_1.default.cyan);
ansiMap.set('4', ansi_styles_1.default.red);
ansiMap.set('5', ansi_styles_1.default.magenta);
ansiMap.set('6', ansi_styles_1.default.yellow);
ansiMap.set('7', ansi_styles_1.default.gray);
ansiMap.set('8', ansi_styles_1.default.blackBright);
ansiMap.set('9', ansi_styles_1.default.blueBright);
ansiMap.set('a', ansi_styles_1.default.greenBright);
ansiMap.set('b', ansi_styles_1.default.cyanBright);
ansiMap.set('c', ansi_styles_1.default.redBright);
ansiMap.set('d', ansi_styles_1.default.magentaBright);
ansiMap.set('e', ansi_styles_1.default.yellowBright);
ansiMap.set('f', ansi_styles_1.default.whiteBright);
ansiMap.set('k', ansi_styles_1.default.reset);
ansiMap.set('l', ansi_styles_1.default.bold);
ansiMap.set('m', ansi_styles_1.default.strikethrough);
ansiMap.set('n', ansi_styles_1.default.underline);
ansiMap.set('o', ansi_styles_1.default.italic);
ansiMap.set('r', ansi_styles_1.default.reset);
const htmlElementMap = new Map();
htmlElementMap.set('0', '<span style="color: #000000;">');
htmlElementMap.set('1', '<span style="color: #0000AA;">');
htmlElementMap.set('2', '<span style="color: #00AA00;">');
htmlElementMap.set('3', '<span style="color: #00AAAA;">');
htmlElementMap.set('4', '<span style="color: #AA0000;">');
htmlElementMap.set('5', '<span style="color: #AA00AA;">');
htmlElementMap.set('6', '<span style="color: #FFAA00;">');
htmlElementMap.set('7', '<span style="color: #AAAAAA;">');
htmlElementMap.set('8', '<span style="color: #555555;">');
htmlElementMap.set('9', '<span style="color: #5555FF;">');
htmlElementMap.set('a', '<span style="color: #55FF55;">');
htmlElementMap.set('b', '<span style="color: #55FFFF;">');
htmlElementMap.set('c', '<span style="color: #FF5555;">');
htmlElementMap.set('d', '<span style="color: #FF55FF;">');
htmlElementMap.set('e', '<span style="color: #FFFF55;">');
htmlElementMap.set('f', '<span style="color: #FFFFFF;">');
htmlElementMap.set('k', '<span className="minecraft-formatting-obfuscated">');
htmlElementMap.set('l', '<span style="font-weight: bold;">');
htmlElementMap.set('m', '<span style="text-decoration: line-through;">');
htmlElementMap.set('n', '<span className="text-decoration: underline;">');
htmlElementMap.set('o', '<span className="font-style: italic;">');
/**
 * The result of the formatted description of the server.
 * @class
 */
class Description {
    /**
     * Creates a new description class from the text.
     * @param {string} descriptionText The MOTD text
     * @constructor
     */
    constructor(descriptionText) {
        this.descriptionText = descriptionText;
    }
    /**
     * Converts the MOTD into a string format
     * @returns {string} The string format of the MOTD
     */
    toString() {
        return this.descriptionText;
    }
    /**
     * Converts the MOTD into a string format without any formatting
     * @returns {string} The MOTD string without formatting
     */
    toRaw() {
        return this.descriptionText.replace(formattingCode, '');
    }
    /**
     * Converts the special formatting characters to ANSI escape codes, commonly used for terminal formatting
     * @returns {string} The ANSI escaped formatting text
     */
    toANSI() {
        return this.descriptionText.replace(formattingCode, (match, p1) => {
            const value = ansiMap.get(p1);
            if (!value)
                return ansi_styles_1.default.reset.open;
            return value.open;
        }) + ansi_styles_1.default.reset.open;
    }
    /**
     * Converts the description into HTML code.
     * @returns {string} The HTML description
     */
    toHTML() {
        let description = this.toString();
        let result = '<span>';
        let tagsOpen = 1;
        let bold = false, italics = false, underline = false, strikethrough = false, obfuscated = false, color = 'r';
        while (description.length > 0) {
            const char = description.charAt(0);
            if (char == '\u00A7') {
                const charCode = description.charAt(1).toLowerCase();
                description = description.substr(2);
                const element = htmlElementMap.get(charCode);
                switch (charCode) {
                    case 'k': {
                        if (obfuscated)
                            continue;
                        result += element;
                        obfuscated = true;
                        tagsOpen++;
                        break;
                    }
                    case 'l': {
                        if (bold)
                            continue;
                        result += element;
                        bold = true;
                        tagsOpen++;
                        break;
                    }
                    case 'm': {
                        if (strikethrough)
                            continue;
                        result += element;
                        strikethrough = true;
                        tagsOpen++;
                        break;
                    }
                    case 'n': {
                        if (underline)
                            continue;
                        result += element;
                        underline = true;
                        tagsOpen++;
                        break;
                    }
                    case 'o': {
                        if (italics)
                            continue;
                        result += element;
                        italics = true;
                        tagsOpen++;
                        break;
                    }
                    case 'r': {
                        bold = false;
                        strikethrough = false;
                        underline = false;
                        italics = false;
                        obfuscated = false;
                        while (tagsOpen > 1) {
                            result += '</span>';
                            tagsOpen--;
                        }
                        break;
                    }
                    default: {
                        if (color === charCode)
                            continue;
                        while (tagsOpen > 1) {
                            result += '</span>';
                            tagsOpen--;
                        }
                        obfuscated = false;
                        bold = false;
                        underline = false;
                        strikethrough = false;
                        italics = false;
                        result += element;
                        color = charCode;
                        tagsOpen++;
                        break;
                    }
                }
            }
            else {
                description = description.substr(1);
                result += char;
            }
        }
        for (let i = 0; i < tagsOpen; i++) {
            result += '</span>';
        }
        return result;
    }
}
exports.default = Description;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVzY3JpcHRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RydWN0dXJlL0Rlc2NyaXB0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOERBQTJDO0FBRTNDLE1BQU0sY0FBYyxHQUFHLGdDQUFnQyxDQUFDO0FBRXhELE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxFQUFrQixDQUFDO0FBQzFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLHFCQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDN0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUscUJBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM1QixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxxQkFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzdCLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLHFCQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDNUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUscUJBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMzQixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxxQkFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQy9CLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLHFCQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDOUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUscUJBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM1QixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxxQkFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ25DLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLHFCQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDbEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUscUJBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNuQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxxQkFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ2xDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLHFCQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDakMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUscUJBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUNyQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxxQkFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3BDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLHFCQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDbkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUscUJBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM3QixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxxQkFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzVCLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLHFCQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDckMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUscUJBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNqQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxxQkFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzlCLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLHFCQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFFN0IsTUFBTSxjQUFjLEdBQUcsSUFBSSxHQUFHLEVBQWtCLENBQUM7QUFDakQsY0FBYyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsZ0NBQWdDLENBQUMsQ0FBQztBQUMxRCxjQUFjLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxnQ0FBZ0MsQ0FBQyxDQUFDO0FBQzFELGNBQWMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLGdDQUFnQyxDQUFDLENBQUM7QUFDMUQsY0FBYyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsZ0NBQWdDLENBQUMsQ0FBQztBQUMxRCxjQUFjLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxnQ0FBZ0MsQ0FBQyxDQUFDO0FBQzFELGNBQWMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLGdDQUFnQyxDQUFDLENBQUM7QUFDMUQsY0FBYyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsZ0NBQWdDLENBQUMsQ0FBQztBQUMxRCxjQUFjLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxnQ0FBZ0MsQ0FBQyxDQUFDO0FBQzFELGNBQWMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLGdDQUFnQyxDQUFDLENBQUM7QUFDMUQsY0FBYyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsZ0NBQWdDLENBQUMsQ0FBQztBQUMxRCxjQUFjLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxnQ0FBZ0MsQ0FBQyxDQUFDO0FBQzFELGNBQWMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLGdDQUFnQyxDQUFDLENBQUM7QUFDMUQsY0FBYyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsZ0NBQWdDLENBQUMsQ0FBQztBQUMxRCxjQUFjLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxnQ0FBZ0MsQ0FBQyxDQUFDO0FBQzFELGNBQWMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLGdDQUFnQyxDQUFDLENBQUM7QUFDMUQsY0FBYyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsZ0NBQWdDLENBQUMsQ0FBQztBQUMxRCxjQUFjLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxvREFBb0QsQ0FBQyxDQUFDO0FBQzlFLGNBQWMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLG1DQUFtQyxDQUFDLENBQUM7QUFDN0QsY0FBYyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsK0NBQStDLENBQUMsQ0FBQztBQUN6RSxjQUFjLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxnREFBZ0QsQ0FBQyxDQUFDO0FBQzFFLGNBQWMsQ0FBQyxH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