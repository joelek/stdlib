"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoublyLinkedList = exports.DoublyLinkedListNode = void 0;
class DoublyLinkedListNode {
    constructor(value) {
        this.value = value;
    }
    detach() {
        if (this.last != null) {
            this.last.setNext(this.next);
        }
        if (this.next != null) {
            this.next.setLast(this.last);
        }
    }
    getLast() {
        return this.last;
    }
    getNext() {
        return this.next;
    }
    getValue() {
        return this.value;
    }
    setLast(last) {
        if (this.last != null) {
            this.last.next = undefined;
        }
        this.last = last;
        if (last != null) {
            last.next = this;
        }
    }
    setNext(next) {
        if (this.next != null) {
            this.next.last = undefined;
        }
        this.next = next;
        if (next != null) {
            next.last = this;
        }
    }
    setValue(value) {
        this.value = value;
    }
}
exports.DoublyLinkedListNode = DoublyLinkedListNode;
;
class DoublyLinkedList {
    constructor() {
        this.head = undefined;
        this.tail = undefined;
    }
    *[Symbol.iterator]() {
        let node = this.head;
        while (node != null) {
            yield node.getValue();
            node = node.getNext();
        }
    }
    append(value) {
        var _a;
        let node = new DoublyLinkedListNode(value);
        if (this.tail != null) {
            this.tail.setNext(node);
        }
        this.head = (_a = this.head) !== null && _a !== void 0 ? _a : node;
        this.tail = node;
        return node;
    }
    prepend(value) {
        var _a;
        let node = new DoublyLinkedListNode(value);
        if (this.head != null) {
            this.head.setLast(node);
        }
        this.head = node;
        this.tail = (_a = this.tail) !== null && _a !== void 0 ? _a : node;
        return node;
    }
    remove(node) {
        if (this.head === node) {
            this.head = node.getNext();
        }
        if (this.tail === node) {
            this.tail = node.getLast();
        }
        node.detach();
    }
    unappend() {
        if (this.tail == null) {
            return;
        }
        let node = this.tail;
        if (this.head === this.tail) {
            this.head = undefined;
            this.tail = undefined;
        }
        else {
            this.tail = node.getLast();
            if (this.tail != null) {
                this.tail.setNext(undefined);
            }
        }
        return node;
    }
    unprepend() {
        if (this.head == null) {
            return;
        }
        let node = this.head;
        if (this.head === this.tail) {
            this.head = undefined;
            this.tail = undefined;
        }
        else {
            this.head = node.getNext();
            if (this.head != null) {
                this.head.setLast(undefined);
            }
        }
        return node;
    }
}
exports.DoublyLinkedList = DoublyLinkedList;
;
