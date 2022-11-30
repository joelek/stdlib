"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegerAssert = void 0;
class IntegerAssert {
    constructor() { }
    static atLeast(min, value) {
        this.integer(min);
        this.integer(value);
        if (value < min) {
            throw new Error(`Expected ${value} to be at least ${min}!`);
        }
        return value;
    }
    static atMost(max, value) {
        this.integer(value);
        this.integer(max);
        if (value > max) {
            throw new Error(`Expected ${value} to be at most ${max}!`);
        }
        return value;
    }
    static between(min, value, max) {
        this.integer(min);
        this.integer(value);
        this.integer(max);
        if (value < min || value > max) {
            throw new Error(`Expected ${value} to be between ${min} and ${max}!`);
        }
        return value;
    }
    static exactly(value, expected) {
        this.integer(expected);
        this.integer(value);
        if (value !== expected) {
            throw new Error(`Expected ${value} to be exactly ${expected}!`);
        }
        return value;
    }
    static integer(value) {
        if (!Number.isInteger(value)) {
            throw new Error(`Expected ${value} to be an integer!`);
        }
        return value;
    }
}
exports.IntegerAssert = IntegerAssert;
;
