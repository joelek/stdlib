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
const dll_1 = require("./dll");
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
test(`It should support iteration with no values appended.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let dll = new dll_1.DoublyLinkedList();
    assert.array.equals(Array.from(dll), []);
}));
test(`It should support iteration with value one appended.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let dll = new dll_1.DoublyLinkedList();
    dll.append(1);
    assert.array.equals(Array.from(dll), [1]);
}));
test(`It should support iteration with value two appended.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let dll = new dll_1.DoublyLinkedList();
    dll.append(2);
    assert.array.equals(Array.from(dll), [2]);
}));
test(`It should support iteration with both values appended.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let dll = new dll_1.DoublyLinkedList();
    dll.append(1);
    dll.append(2);
    assert.array.equals(Array.from(dll), [1, 2]);
}));
test(`It should support appending value one.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let dll = new dll_1.DoublyLinkedList();
    let one = dll.append(1);
    assert.true(one.getValue() === 1);
    assert.true(one.getLast() === undefined);
    assert.true(one.getNext() === undefined);
}));
test(`It should support appending value two.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let dll = new dll_1.DoublyLinkedList();
    let two = dll.append(2);
    assert.true(two.getValue() === 2);
    assert.true(two.getLast() === undefined);
    assert.true(two.getNext() === undefined);
}));
test(`It should support appending both values.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let dll = new dll_1.DoublyLinkedList();
    let one = dll.append(1);
    let two = dll.append(2);
    assert.true(one.getValue() === 1);
    assert.true(one.getLast() === undefined);
    assert.true(one.getNext() === two);
    assert.true(two.getValue() === 2);
    assert.true(two.getLast() === one);
    assert.true(two.getNext() === undefined);
}));
test(`It should support prepending value one.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let dll = new dll_1.DoublyLinkedList();
    let one = dll.prepend(1);
    assert.true(one.getValue() === 1);
    assert.true(one.getLast() === undefined);
    assert.true(one.getNext() === undefined);
}));
test(`It should support prepending value two.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let dll = new dll_1.DoublyLinkedList();
    let two = dll.prepend(2);
    assert.true(two.getValue() === 2);
    assert.true(two.getLast() === undefined);
    assert.true(two.getNext() === undefined);
}));
test(`It should support prepending both values.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let dll = new dll_1.DoublyLinkedList();
    let one = dll.prepend(1);
    let two = dll.prepend(2);
    assert.true(one.getValue() === 1);
    assert.true(one.getLast() === two);
    assert.true(one.getNext() === undefined);
    assert.true(two.getValue() === 2);
    assert.true(two.getLast() === undefined);
    assert.true(two.getNext() === one);
}));
test(`It should support appending and removing values in fifo order.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let dll = new dll_1.DoublyLinkedList();
    assert.array.equals(Array.from(dll), []);
    let one = dll.append(1);
    assert.array.equals(Array.from(dll), [1]);
    let two = dll.append(2);
    assert.array.equals(Array.from(dll), [1, 2]);
    let three = dll.append(3);
    assert.array.equals(Array.from(dll), [1, 2, 3]);
    dll.remove(one);
    assert.array.equals(Array.from(dll), [2, 3]);
    dll.remove(two);
    assert.array.equals(Array.from(dll), [3]);
    dll.remove(three);
    assert.array.equals(Array.from(dll), []);
}));
test(`It should support appending and removing values in lifo order.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let dll = new dll_1.DoublyLinkedList();
    assert.array.equals(Array.from(dll), []);
    let one = dll.append(1);
    assert.array.equals(Array.from(dll), [1]);
    let two = dll.append(2);
    assert.array.equals(Array.from(dll), [1, 2]);
    let three = dll.append(3);
    assert.array.equals(Array.from(dll), [1, 2, 3]);
    dll.remove(three);
    assert.array.equals(Array.from(dll), [1, 2]);
    dll.remove(two);
    assert.array.equals(Array.from(dll), [1]);
    dll.remove(one);
    assert.array.equals(Array.from(dll), []);
}));
test(`It should support appending and unappending values.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let dll = new dll_1.DoublyLinkedList();
    assert.array.equals(Array.from(dll), []);
    let one = dll.append(1);
    assert.array.equals(Array.from(dll), [1]);
    let two = dll.append(2);
    assert.array.equals(Array.from(dll), [1, 2]);
    let three = dll.append(3);
    assert.array.equals(Array.from(dll), [1, 2, 3]);
    assert.true(dll.unappend() === three);
    assert.array.equals(Array.from(dll), [1, 2]);
    assert.true(dll.unappend() === two);
    assert.array.equals(Array.from(dll), [1]);
    assert.true(dll.unappend() === one);
    assert.array.equals(Array.from(dll), []);
    assert.true(dll.unappend() === undefined);
}));
test(`It should support prepending and unprepending values.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let dll = new dll_1.DoublyLinkedList();
    assert.array.equals(Array.from(dll), []);
    let one = dll.prepend(1);
    assert.array.equals(Array.from(dll), [1]);
    let two = dll.prepend(2);
    assert.array.equals(Array.from(dll), [2, 1]);
    let three = dll.prepend(3);
    assert.array.equals(Array.from(dll), [3, 2, 1]);
    assert.true(dll.unprepend() === three);
    assert.array.equals(Array.from(dll), [2, 1]);
    assert.true(dll.unprepend() === two);
    assert.array.equals(Array.from(dll), [1]);
    assert.true(dll.unprepend() === one);
    assert.array.equals(Array.from(dll), []);
    assert.true(dll.unprepend() === undefined);
}));
