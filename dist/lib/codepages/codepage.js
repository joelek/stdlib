"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Codepage = exports.CodepageEncodingError = exports.CodepageDecodingError = void 0;
class CodepageDecodingError extends Error {
    byte;
    constructor(byte, message) {
        super(message);
        this.byte = byte;
    }
}
exports.CodepageDecodingError = CodepageDecodingError;
;
class CodepageEncodingError extends Error {
    string;
    constructor(string, message) {
        super(message);
        this.string = string;
    }
}
exports.CodepageEncodingError = CodepageEncodingError;
;
class Codepage {
    string_from_byte;
    byte_from_string;
    constructor(codepoints) {
        this.string_from_byte = new Map();
        this.byte_from_string = new Map();
        for (let [codepoint_index, codepoint] of codepoints.entries()) {
            let byte = codepoint_index;
            let string = String.fromCodePoint(codepoint);
            this.string_from_byte.set(byte, string);
            this.byte_from_string.set(string, byte);
        }
    }
    decode(buffer) {
        let strings = [];
        for (let [byte_index, byte] of buffer.entries()) {
            let string = this.string_from_byte.get(byte);
            if (string == null) {
                throw new CodepageDecodingError(byte);
            }
            strings.push(string);
        }
        return strings.join("");
    }
    encode(string) {
        let bytes = [];
        for (let [part_index, part] of [...string].entries()) {
            let byte = this.byte_from_string.get(part);
            if (byte == null) {
                throw new CodepageEncodingError(part);
            }
            bytes.push(byte);
        }
        return Uint8Array.from(bytes);
    }
}
exports.Codepage = Codepage;
;
