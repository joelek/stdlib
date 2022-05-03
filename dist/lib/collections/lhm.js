"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkedHashMap = void 0;
const dll_1 = require("./dll");
const rhh_1 = require("./rhh");
class LinkedHashMap {
    constructor() {
        this.list = new dll_1.DoublyLinkedList();
        this.hash = new rhh_1.RobinHoodHash();
    }
    *[Symbol.iterator]() {
        yield* this.list;
    }
    insert(key, value) {
        let node = this.hash.lookup(key);
        if (node != null) {
            node.getValue().value = value;
            return false;
        }
        else {
            node = this.list.append({ key, value });
            this.hash.insert(key, node);
            return true;
        }
    }
    length() {
        return this.hash.length();
    }
    lookup(key) {
        let node = this.hash.lookup(key);
        if (node == null) {
            return;
        }
        return node.getValue().value;
    }
    remove(key) {
        let node = this.hash.lookup(key);
        if (node != null) {
            this.hash.remove(key);
            this.list.remove(node);
            return true;
        }
        else {
            return false;
        }
    }
    vacate() {
        this.list = new dll_1.DoublyLinkedList();
        this.hash = new rhh_1.RobinHoodHash();
    }
}
exports.LinkedHashMap = LinkedHashMap;
;
