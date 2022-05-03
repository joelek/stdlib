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
const rhh_1 = require("./rhh");
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
    let rhh = new rhh_1.RobinHoodHash();
    let observed = Array.from(rhh).map((entry) => entry.value).sort();
    let expected = [];
    assert.array.equals(observed, expected);
}));
test(`It should support iteration with value one inserted.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let rhh = new rhh_1.RobinHoodHash();
    rhh.insert(1, 1);
    let observed = Array.from(rhh).map((entry) => entry.value).sort();
    let expected = [1];
    assert.array.equals(observed, expected);
}));
test(`It should support iteration with value two inserted.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let rhh = new rhh_1.RobinHoodHash();
    rhh.insert(2, 2);
    let observed = Array.from(rhh).map((entry) => entry.value).sort();
    let expected = [2];
    assert.array.equals(observed, expected);
}));
test(`It should support iteration with both values inserted.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let rhh = new rhh_1.RobinHoodHash();
    rhh.insert(1, 1);
    rhh.insert(2, 2);
    let observed = Array.from(rhh).map((entry) => entry.value).sort();
    let expected = [1, 2];
    assert.array.equals(observed, expected);
}));
test(`It should support inserting value one.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let rhh = new rhh_1.RobinHoodHash();
    assert.true(rhh.insert(1, 1) === true);
    assert.true(rhh.insert(1, 1) === false);
}));
test(`It should support inserting value two.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let rhh = new rhh_1.RobinHoodHash();
    assert.true(rhh.insert(2, 2) === true);
    assert.true(rhh.insert(2, 2) === false);
}));
test(`It should support inserting both values.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let rhh = new rhh_1.RobinHoodHash();
    assert.true(rhh.insert(1, 1) === true);
    assert.true(rhh.insert(2, 2) === true);
    assert.true(rhh.insert(1, 1) === false);
    assert.true(rhh.insert(2, 2) === false);
}));
test(`It should support keeping track of the total number of values.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let rhh = new rhh_1.RobinHoodHash();
    assert.true(rhh.length() === 0);
    rhh.insert(1, 1);
    assert.true(rhh.length() === 1);
    rhh.insert(2, 2);
    assert.true(rhh.length() === 2);
    rhh.remove(1);
    assert.true(rhh.length() === 1);
    rhh.remove(2);
    assert.true(rhh.length() === 0);
}));
test(`It should support looking up values with no values inserted.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let rhh = new rhh_1.RobinHoodHash();
    assert.true(rhh.lookup(1) === undefined);
    assert.true(rhh.lookup(2) === undefined);
}));
test(`It should support looking up values with value one inserted.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let rhh = new rhh_1.RobinHoodHash();
    rhh.insert(1, 1);
    assert.true(rhh.lookup(1) === 1);
    assert.true(rhh.lookup(2) === undefined);
}));
test(`It should support looking up values with value two inserted.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let rhh = new rhh_1.RobinHoodHash();
    rhh.insert(2, 2);
    assert.true(rhh.lookup(1) === undefined);
    assert.true(rhh.lookup(2) === 2);
}));
test(`It should support looking up values with both values inserted.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let rhh = new rhh_1.RobinHoodHash();
    rhh.insert(1, 1);
    rhh.insert(2, 2);
    assert.true(rhh.lookup(1) === 1);
    assert.true(rhh.lookup(2) === 2);
}));
test(`It should support removing values with no values inserted.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let rhh = new rhh_1.RobinHoodHash();
    assert.true(rhh.remove(1) === false);
    assert.true(rhh.remove(2) === false);
}));
test(`It should support removing values with value one inserted.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let rhh = new rhh_1.RobinHoodHash();
    rhh.insert(1, 1);
    assert.true(rhh.remove(1) === true);
    assert.true(rhh.remove(2) === false);
}));
test(`It should support removing values with value two inserted.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let rhh = new rhh_1.RobinHoodHash();
    rhh.insert(2, 2);
    assert.true(rhh.remove(1) === false);
    assert.true(rhh.remove(2) === true);
}));
test(`It should support removing values with both values inserted.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let rhh = new rhh_1.RobinHoodHash();
    rhh.insert(1, 1);
    rhh.insert(2, 2);
    assert.true(rhh.remove(1) === true);
    assert.true(rhh.remove(2) === true);
}));
test(`It should support vacating.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let rhh = new rhh_1.RobinHoodHash();
    rhh.insert(1, 1);
    rhh.insert(2, 2);
    rhh.vacate();
    let observed = Array.from(rhh).map((entry) => entry.value).sort();
    let expected = [];
    assert.array.equals(observed, expected);
}));
