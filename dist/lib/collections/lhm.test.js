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
Object.defineProperty(exports, "__esModule", { value: true });
const lhm_1 = require("./lhm");
const Assert = {
    true(condition, message = "") {
        if (!condition) {
            throw message;
        }
    },
    array: {
        equals(one, two, message = "") {
            if (one.length !== two.length) {
                throw message;
            }
            for (let i = 0; i < one.length; i++) {
                if (one[i] !== two[i]) {
                    throw message;
                }
            }
        }
    }
};
function log(...values) {
    globalThis.console.log(...values);
}
;
function test(name, cb) {
    cb(Assert).catch((error) => {
        log(name);
        log(error);
    });
}
;
test(`It should support iteration with no values inserted.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let lhm = new lhm_1.LinkedHashMap();
    let observed = Array.from(lhm).map((entry) => entry.value);
    let expected = [];
    assert.array.equals(observed, expected);
}));
test(`It should support iteration with value one inserted.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let lhm = new lhm_1.LinkedHashMap();
    lhm.insert(1, 1);
    let observed = Array.from(lhm).map((entry) => entry.value);
    let expected = [1];
    assert.array.equals(observed, expected);
}));
test(`It should support iteration with value two inserted.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let lhm = new lhm_1.LinkedHashMap();
    lhm.insert(2, 2);
    let observed = Array.from(lhm).map((entry) => entry.value);
    let expected = [2];
    assert.array.equals(observed, expected);
}));
test(`It should support iteration with both values inserted.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let lhm = new lhm_1.LinkedHashMap();
    lhm.insert(1, 1);
    lhm.insert(2, 2);
    let observed = Array.from(lhm).map((entry) => entry.value);
    let expected = [1, 2];
    assert.array.equals(observed, expected);
}));
test(`It should support inserting value one.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let lhm = new lhm_1.LinkedHashMap();
    assert.true(lhm.insert(1, 1) === true);
    assert.true(lhm.insert(1, 1) === false);
}));
test(`It should support inserting value two.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let lhm = new lhm_1.LinkedHashMap();
    assert.true(lhm.insert(2, 2) === true);
    assert.true(lhm.insert(2, 2) === false);
}));
test(`It should support inserting both values.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let lhm = new lhm_1.LinkedHashMap();
    assert.true(lhm.insert(1, 1) === true);
    assert.true(lhm.insert(2, 2) === true);
    assert.true(lhm.insert(1, 1) === false);
    assert.true(lhm.insert(2, 2) === false);
}));
test(`It should support keeping track of the total number of values.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let lhm = new lhm_1.LinkedHashMap();
    assert.true(lhm.length() === 0);
    lhm.insert(1, 1);
    assert.true(lhm.length() === 1);
    lhm.insert(2, 2);
    assert.true(lhm.length() === 2);
    lhm.remove(1);
    assert.true(lhm.length() === 1);
    lhm.remove(2);
    assert.true(lhm.length() === 0);
}));
test(`It should support looking up values with no values inserted.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let lhm = new lhm_1.LinkedHashMap();
    assert.true(lhm.lookup(1) === undefined);
    assert.true(lhm.lookup(2) === undefined);
}));
test(`It should support looking up values with value one inserted.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let lhm = new lhm_1.LinkedHashMap();
    lhm.insert(1, 1);
    assert.true(lhm.lookup(1) === 1);
    assert.true(lhm.lookup(2) === undefined);
}));
test(`It should support looking up values with value two inserted.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let lhm = new lhm_1.LinkedHashMap();
    lhm.insert(2, 2);
    assert.true(lhm.lookup(1) === undefined);
    assert.true(lhm.lookup(2) === 2);
}));
test(`It should support looking up values with both values inserted.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let lhm = new lhm_1.LinkedHashMap();
    lhm.insert(1, 1);
    lhm.insert(2, 2);
    assert.true(lhm.lookup(1) === 1);
    assert.true(lhm.lookup(2) === 2);
}));
test(`It should support removing values with no values inserted.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let lhm = new lhm_1.LinkedHashMap();
    assert.true(lhm.remove(1) === false);
    assert.true(lhm.remove(2) === false);
}));
test(`It should support removing values with value one inserted.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let lhm = new lhm_1.LinkedHashMap();
    lhm.insert(1, 1);
    assert.true(lhm.remove(1) === true);
    assert.true(lhm.remove(2) === false);
}));
test(`It should support removing values with value two inserted.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let lhm = new lhm_1.LinkedHashMap();
    lhm.insert(2, 2);
    assert.true(lhm.remove(1) === false);
    assert.true(lhm.remove(2) === true);
}));
test(`It should support removing values with both values inserted.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let lhm = new lhm_1.LinkedHashMap();
    lhm.insert(1, 1);
    lhm.insert(2, 2);
    assert.true(lhm.remove(1) === true);
    assert.true(lhm.remove(2) === true);
}));
test(`It should support vacating.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let lhm = new lhm_1.LinkedHashMap();
    lhm.insert(1, 1);
    lhm.insert(2, 2);
    lhm.vacate();
    let observed = Array.from(lhm).map((entry) => entry.value);
    let expected = [];
    assert.array.equals(observed, expected);
}));
