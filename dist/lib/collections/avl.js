"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tree = exports.Node = void 0;
class Node {
    constructor(key, value, height) {
        this.key = key;
        this.value = value;
        this.height = height !== null && height !== void 0 ? height : 1;
        this.parent = undefined;
        this.lower = undefined;
        this.upper = undefined;
    }
    compare(filter) {
        if (filter.operator === "<") {
            if (this.key > filter.key) {
                return -1;
            }
            else if (this.key < filter.key) {
                return 0;
            }
            else {
                return -1;
            }
        }
        if (filter.operator === "<=") {
            if (this.key > filter.key) {
                return -1;
            }
            else if (this.key < filter.key) {
                return 0;
            }
            else {
                return 0;
            }
        }
        if (filter.operator === "=") {
            if (this.key > filter.key) {
                return -1;
            }
            else if (this.key < filter.key) {
                return 1;
            }
            else {
                return 0;
            }
        }
        if (filter.operator === ">=") {
            if (this.key > filter.key) {
                return 0;
            }
            else if (this.key < filter.key) {
                return 1;
            }
            else {
                return 0;
            }
        }
        if (filter.operator === ">") {
            if (this.key > filter.key) {
                return 0;
            }
            else if (this.key < filter.key) {
                return 1;
            }
            else {
                return 1;
            }
        }
        throw `Expected code to be unreachable!`;
    }
    computeBalance() {
        var _a, _b, _c, _d;
        return ((_b = (_a = this.upper) === null || _a === void 0 ? void 0 : _a.height) !== null && _b !== void 0 ? _b : 0) - ((_d = (_c = this.lower) === null || _c === void 0 ? void 0 : _c.height) !== null && _d !== void 0 ? _d : 0);
    }
    computeHeight() {
        var _a, _b, _c, _d;
        return Math.max(((_b = (_a = this.lower) === null || _a === void 0 ? void 0 : _a.height) !== null && _b !== void 0 ? _b : 0), ((_d = (_c = this.upper) === null || _c === void 0 ? void 0 : _c.height) !== null && _d !== void 0 ? _d : 0)) + 1;
    }
    entry() {
        return {
            key: this.key,
            value: this.value
        };
    }
    *filter(...filters) {
        let lower = true;
        let current = true;
        let upper = true;
        for (let filter of filters) {
            let comparison = this.compare(filter);
            lower = lower && comparison <= 0;
            current = current && comparison === 0;
            upper = upper && comparison >= 0;
        }
        if (lower && this.lower != null) {
            yield* this.lower.filter(...filters);
        }
        if (current) {
            yield this.entry();
        }
        if (upper && this.upper != null) {
            yield* this.upper.filter(...filters);
        }
    }
    getMaximum() {
        let node = this;
        while (node.upper != null) {
            node = node.upper;
        }
        return node;
    }
    getMinimum() {
        let node = this;
        while (node.lower != null) {
            node = node.lower;
        }
        return node;
    }
    getLowerParent() {
        let parent = this.parent;
        let child = this;
        while (parent != null && child === parent.lower) {
            child = parent;
            parent = parent.parent;
        }
        return parent;
    }
    getUpperParent() {
        let parent = this.parent;
        let child = this;
        while (parent != null && child === parent.upper) {
            child = parent;
            parent = parent.parent;
        }
        return parent;
    }
    getPredecessor() {
        if (this.lower != null) {
            return this.lower.getMaximum();
        }
        return this.getLowerParent();
    }
    getSuccessor() {
        if (this.upper != null) {
            return this.upper.getMinimum();
        }
        return this.getUpperParent();
    }
    insert(node) {
        if (node.key === this.key) {
            this.value = node.value;
            return this;
        }
        if (node.key < this.key) {
            if (this.lower == null) {
                this.setLower(node);
            }
            else {
                this.setLower(this.lower.insert(node));
            }
        }
        else {
            if (this.upper == null) {
                this.setUpper(node);
            }
            else {
                this.setUpper(this.upper.insert(node));
            }
        }
        this.setHeight(this.computeHeight());
        return this.rebalance();
    }
    locate(filter) {
        if (filter.key === this.key) {
            if (filter.operator === "<") {
                return this.getPredecessor();
            }
            if (filter.operator === "<=") {
                return this;
            }
            if (filter.operator === "=") {
                return this;
            }
            if (filter.operator === ">=") {
                return this;
            }
            if (filter.operator === ">") {
                return this.getSuccessor();
            }
        }
        if (filter.key < this.key) {
            if (this.lower != null) {
                return this.lower.locate(filter);
            }
            else {
                if (filter.operator === "<") {
                    return this.getLowerParent();
                }
                if (filter.operator === "<=") {
                    return this.getLowerParent();
                }
                if (filter.operator === ">=") {
                    return this;
                }
                if (filter.operator === ">") {
                    return this;
                }
            }
        }
        else {
            if (this.upper != null) {
                return this.upper.locate(filter);
            }
            else {
                if (filter.operator === "<") {
                    return this;
                }
                if (filter.operator === "<=") {
                    return this;
                }
                if (filter.operator === ">=") {
                    return this.getUpperParent();
                }
                if (filter.operator === ">") {
                    return this.getUpperParent();
                }
            }
        }
    }
    rebalance() {
        let balance = this.computeBalance();
        if (balance < -1) {
            if (this.lower == null) {
                throw `Expected lower child to be non-null!`;
            }
            let balance = this.lower.computeBalance();
            if (balance <= 0) {
                return this.rotateRight();
            }
            else {
                this.setLower(this.lower.rotateLeft());
                return this.rotateRight();
            }
        }
        if (balance > 1) {
            if (this.upper == null) {
                throw `Expected upper child to be non-null!`;
            }
            let balance = this.upper.computeBalance();
            if (balance >= 0) {
                return this.rotateLeft();
            }
            else {
                this.setUpper(this.upper.rotateRight());
                return this.rotateLeft();
            }
        }
        return this;
    }
    remove(key) {
        if (key === this.key) {
            if (this.lower != null) {
                if (this.upper != null) {
                    let minimum = this.upper.getMinimum();
                    let key = minimum.key;
                    this.setUpper(this.upper.remove(key));
                    this.key = key;
                    this.setHeight(this.computeHeight());
                    return this.rebalance();
                }
                else {
                    return this.lower;
                }
            }
            else {
                if (this.upper != null) {
                    return this.upper;
                }
                else {
                    return;
                }
            }
        }
        if (key < this.key) {
            if (this.lower != null) {
                this.setLower(this.lower.remove(key));
            }
            else {
                return this;
            }
        }
        else {
            if (this.upper != null) {
                this.setUpper(this.upper.remove(key));
            }
            else {
                return this;
            }
        }
        this.setHeight(this.computeHeight());
        return this.rebalance();
    }
    rotateLeft() {
        let upper = this.upper;
        if (upper == null) {
            throw `Expected upper child to be non-null!`;
        }
        this.setUpper(upper.lower);
        upper.setLower(this);
        this.setHeight(this.computeHeight());
        upper.setHeight(upper.computeHeight());
        return upper;
    }
    rotateRight() {
        let lower = this.lower;
        if (lower == null) {
            throw `Expected lower child to be non-null!`;
        }
        this.setLower(lower.upper);
        lower.setUpper(this);
        this.setHeight(this.computeHeight());
        lower.setHeight(lower.computeHeight());
        return lower;
    }
    getHeight() {
        return this.height;
    }
    setHeight(height) {
        return this.height = height;
    }
    getParent() {
        return this.parent;
    }
    setParent(parent) {
        if (this.parent != null) {
            if (this.parent.lower === this) {
                this.parent.lower = undefined;
            }
            else if (this.parent.upper === this) {
                this.parent.upper = undefined;
            }
        }
        this.parent = parent;
    }
    getLower() {
        return this.lower;
    }
    setLower(lower) {
        if (lower != null) {
            lower.setParent(this);
        }
        if (this.lower != null) {
            this.lower.setParent(undefined);
        }
        this.lower = lower;
    }
    getUpper() {
        return this.upper;
    }
    setUpper(upper) {
        if (upper != null) {
            upper.setParent(this);
        }
        if (this.upper != null) {
            this.upper.setParent(undefined);
        }
        this.upper = upper;
    }
}
exports.Node = Node;
;
class Tree {
    constructor() {
        this.root = undefined;
    }
    *[Symbol.iterator]() {
        yield* this.filter();
    }
    clear() {
        this.root = undefined;
    }
    *filter(...filters) {
        if (this.root == null) {
            return;
        }
        for (let node of this.root.filter(...filters)) {
            yield {
                key: node.key,
                value: node.value
            };
        }
    }
    insert(key, value) {
        let node = new Node(key, value);
        if (this.root != null) {
            this.root = this.root.insert(node);
        }
        else {
            this.root = node;
        }
    }
    length() {
        let length = 0;
        for (let entry of this) {
            length += 1;
        }
        return length;
    }
    locate(filter) {
        var _a;
        if (this.root != null) {
            return (_a = this.root.locate(filter)) === null || _a === void 0 ? void 0 : _a.entry();
        }
    }
    lookup(key) {
        var _a;
        return (_a = this.locate({ operator: "=", key: key })) === null || _a === void 0 ? void 0 : _a.value;
    }
    remove(key) {
        if (this.root != null) {
            this.root = this.root.remove(key);
        }
    }
}
exports.Tree = Tree;
;
