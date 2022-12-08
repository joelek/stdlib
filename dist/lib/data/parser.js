"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const integer_1 = require("../asserts/integer");
const chunk_1 = require("./chunk");
class Parser {
    constructor(buffer, offset) {
        this.buffer = buffer;
        this.offset = offset !== null && offset !== void 0 ? offset : 0;
    }
    chunk(length) {
        length = length !== null && length !== void 0 ? length : this.buffer.length - this.offset;
        if (this.offset + length > this.buffer.length) {
            throw new Error(`Expected to read at least ${length} bytes!`);
        }
        let buffer = this.buffer.slice(this.offset, this.offset + length);
        this.offset += length;
        return buffer;
    }
    eof() {
        return this.offset >= this.buffer.length;
    }
    seek(offset) {
        if (offset > this.buffer.length) {
            throw new Error(`Expected a valid offset!`);
        }
        this.offset = offset;
    }
    signed(length, endian) {
        let value = this.unsigned(length, endian);
        let bias = Math.pow(2, (length * 8 - 1));
        if (value >= bias) {
            value -= bias + bias;
        }
        return value;
    }
    string(encoding, length) {
        if (length != null) {
            let chunk = this.chunk(length);
            return chunk_1.Chunk.toString(chunk, encoding);
        }
        let bytes = [];
        while (!this.eof()) {
            if (this.offset > this.buffer.length) {
                throw new Error(`Expected to read at least 1 byte!`);
            }
            let byte = this.buffer[this.offset];
            this.offset += 1;
            if (byte === 0) {
                break;
            }
            bytes.push(byte);
        }
        let chunk = Uint8Array.from(bytes);
        return chunk_1.Chunk.toString(chunk, encoding);
    }
    try(supplier) {
        let offset = this.offset;
        try {
            return supplier(this);
        }
        catch (error) {
            this.offset = offset;
            throw error;
        }
    }
    tryArray(suppliers) {
        let offset = this.offset;
        for (let supplier of suppliers) {
            try {
                return supplier(this);
            }
            catch (error) {
                this.offset = offset;
            }
        }
        throw new Error(`Expected one supplier to succeed!`);
    }
    unsigned(length, endian) {
        integer_1.IntegerAssert.between(1, length, 6);
        if (this.offset + length > this.buffer.length) {
            throw new Error(`Expected to read at least ${length} bytes!`);
        }
        if (endian === "little") {
            let value = 0;
            for (let i = length - 1; i >= 0; i--) {
                value *= 256;
                value += this.buffer[this.offset + i];
            }
            this.offset += length;
            return value;
        }
        else {
            let value = 0;
            for (let i = 0; i < length; i++) {
                value *= 256;
                value += this.buffer[this.offset + i];
            }
            this.offset += length;
            return value;
        }
    }
}
exports.Parser = Parser;
;
