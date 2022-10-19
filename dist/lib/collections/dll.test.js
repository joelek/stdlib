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
const wtf = require("@joelek/wtf");
const dll_1 = require("./dll");
wtf.test(`It should support iteration with no values appended.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let dll = new dll_1.DoublyLinkedList();
    assert.equals(Array.from(dll), []);
}));
wtf.test(`It should support iteration with value one appended.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let dll = new dll_1.DoublyLinkedList();
    dll.append(1);
    assert.equals(Array.from(dll), [1]);
}));
wtf.test(`It should support iteration with value two appended.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let dll = new dll_1.DoublyLinkedList();
    dll.append(2);
    assert.equals(Array.from(dll), [2]);
}));
wtf.test(`It should support iteration with both values appended.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let dll = new dll_1.DoublyLinkedList();
    dll.append(1);
    dll.append(2);
    assert.equals(Array.from(dll), [1, 2]);
}));
wtf.test(`It should support appending value one.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let dll = new dll_1.DoublyLinkedList();
    let one = dll.append(1);
    assert.equals(one.getValue(), 1);
    assert.equals(one.getLast() === undefined, true);
    assert.equals(one.getNext() === undefined, true);
}));
wtf.test(`It should support appending value two.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let dll = new dll_1.DoublyLinkedList();
    let two = dll.append(2);
    assert.equals(two.getValue(), 2);
    assert.equals(two.getLast() === undefined, true);
    assert.equals(two.getNext() === undefined, true);
}));
wtf.test(`It should support appending both values.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let dll = new dll_1.DoublyLinkedList();
    let one = dll.append(1);
    let two = dll.append(2);
    assert.equals(one.getValue(), 1);
    assert.equals(one.getLast() === undefined, true);
    assert.equals(one.getNext() === two, true);
    assert.equals(two.getValue(), 2);
    assert.equals(two.getLast() === one, true);
    assert.equals(two.getNext() === undefined, true);
}));
wtf.test(`It should support prepending value one.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let dll = new dll_1.DoublyLinkedList();
    let one = dll.prepend(1);
    assert.equals(one.getValue(), 1);
    assert.equals(one.getLast() === undefined, true);
    assert.equals(one.getNext() === undefined, true);
}));
wtf.test(`It should support prepending value two.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let dll = new dll_1.DoublyLinkedList();
    let two = dll.prepend(2);
    assert.equals(two.getValue(), 2);
    assert.equals(two.getLast() === undefined, true);
    assert.equals(two.getNext() === undefined, true);
}));
wtf.test(`It should support prepending both values.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let dll = new dll_1.DoublyLinkedList();
    let one = dll.prepend(1);
    let two = dll.prepend(2);
    assert.equals(one.getValue(), 1);
    assert.equals(one.getLast() === two, true);
    assert.equals(one.getNext() === undefined, true);
    assert.equals(two.getValue(), 2);
    assert.equals(two.getLast() === undefined, true);
    assert.equals(two.getNext() === one, true);
}));
wtf.test(`It should support appending and removing values in fifo order.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let dll = new dll_1.DoublyLinkedList();
    assert.equals(Array.from(dll), []);
    let one = dll.append(1);
    assert.equals(Array.from(dll), [1]);
    let two = dll.append(2);
    assert.equals(Array.from(dll), [1, 2]);
    let three = dll.append(3);
    assert.equals(Array.from(dll), [1, 2, 3]);
    dll.remove(one);
    assert.equals(Array.from(dll), [2, 3]);
    dll.remove(two);
    assert.equals(Array.from(dll), [3]);
    dll.remove(three);
    assert.equals(Array.from(dll), []);
}));
wtf.test(`It should support appending and removing values in lifo order.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let dll = new dll_1.DoublyLinkedList();
    assert.equals(Array.from(dll), []);
    let one = dll.append(1);
    assert.equals(Array.from(dll), [1]);
    let two = dll.append(2);
    assert.equals(Array.from(dll), [1, 2]);
    let three = dll.append(3);
    assert.equals(Array.from(dll), [1, 2, 3]);
    dll.remove(three);
    assert.equals(Array.from(dll), [1, 2]);
    dll.remove(two);
    assert.equals(Array.from(dll), [1]);
    dll.remove(one);
    assert.equals(Array.from(dll), []);
}));
wtf.test(`It should support appending and unappending values.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let dll = new dll_1.DoublyLinkedList();
    assert.equals(Array.from(dll), []);
    let one = dll.append(1);
    assert.equals(Array.from(dll), [1]);
    let two = dll.append(2);
    assert.equals(Array.from(dll), [1, 2]);
    let three = dll.append(3);
    assert.equals(Array.from(dll), [1, 2, 3]);
    assert.equals(dll.unappend() === three, true);
    assert.equals(Array.from(dll), [1, 2]);
    assert.equals(dll.unappend() === two, true);
    assert.equals(Array.from(dll), [1]);
    assert.equals(dll.unappend() === one, true);
    assert.equals(Array.from(dll), []);
    assert.equals(dll.unappend() === undefined, true);
}));
wtf.test(`It should support prepending and unprepending values.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let dll = new dll_1.DoublyLinkedList();
    assert.equals(Array.from(dll), []);
    let one = dll.prepend(1);
    assert.equals(Array.from(dll), [1]);
    let two = dll.prepend(2);
    assert.equals(Array.from(dll), [2, 1]);
    let three = dll.prepend(3);
    assert.equals(Array.from(dll), [3, 2, 1]);
    assert.equals(dll.unprepend() === three, true);
    assert.equals(Array.from(dll), [2, 1]);
    assert.equals(dll.unprepend() === two, true);
    assert.equals(Array.from(dll), [1]);
    assert.equals(dll.unprepend() === one, true);
    assert.equals(Array.from(dll), []);
    assert.equals(dll.unprepend() === undefined, true);
}));
