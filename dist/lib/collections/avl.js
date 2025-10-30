"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tree = exports.GenericTree = exports.Node = exports.GenericNode = exports.COLLATOR = void 0;
const COLLATOR = (one, two) => {
    if (one == null) {
        if (two == null) {
            return "IDENTICAL";
        }
        else {
            return "ONE_COMES_FIRST";
        }
    }
    else {
        if (two == null) {
            return "TWO_COMES_FIRST";
        }
        else {
            if (one < two) {
                return "ONE_COMES_FIRST";
            }
            if (two < one) {
                return "TWO_COMES_FIRST";
            }
            return "IDENTICAL";
        }
    }
};
exports.COLLATOR = COLLATOR;
class GenericNode {
    key;
    value;
    height;
    parent;
    lower;
    upper;
    constructor(key, value, height) {
        this.key = key;
        this.value = value;
        this.height = height ?? 1;
        this.parent = undefined;
        this.lower = undefined;
        this.upper = undefined;
    }
    compare(filter) {
        let position = (0, exports.COLLATOR)(this.key, filter.key);
        if (filter.operator === "<") {
            if (position === "TWO_COMES_FIRST") {
                return -1;
            }
            else if (position === "ONE_COMES_FIRST") {
                return 0;
            }
            else {
                return -1;
            }
        }
        if (filter.operator === "<=") {
            if (position === "TWO_COMES_FIRST") {
                return -1;
            }
            else if (position === "ONE_COMES_FIRST") {
                return 0;
            }
            else {
                return 0;
            }
        }
        if (filter.operator === "=") {
            if (position === "TWO_COMES_FIRST") {
                return -1;
            }
            else if (position === "ONE_COMES_FIRST") {
                return 1;
            }
            else {
                return 0;
            }
        }
        if (filter.operator === ">=") {
            if (position === "TWO_COMES_FIRST") {
                return 0;
            }
            else if (position === "ONE_COMES_FIRST") {
                return 1;
            }
            else {
                return 0;
            }
        }
        if (filter.operator === ">") {
            if (position === "TWO_COMES_FIRST") {
                return 0;
            }
            else if (position === "ONE_COMES_FIRST") {
                return 1;
            }
            else {
                return 1;
            }
        }
        throw `Expected code to be unreachable!`;
    }
    computeBalance() {
        return (this.upper?.height ?? 0) - (this.lower?.height ?? 0);
    }
    computeHeight() {
        return Math.max((this.lower?.height ?? 0), (this.upper?.height ?? 0)) + 1;
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
        let position = (0, exports.COLLATOR)(node.key, this.key);
        if (position === "IDENTICAL") {
            this.value = node.value;
            return this;
        }
        if (position === "ONE_COMES_FIRST") {
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
        let position = (0, exports.COLLATOR)(filter.key, this.key);
        if (position === "IDENTICAL") {
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
        if (position === "ONE_COMES_FIRST") {
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
        let position = (0, exports.COLLATOR)(key, this.key);
        if (position === "IDENTICAL") {
            if (this.lower != null) {
                if (this.upper != null) {
                    let { key, value } = this.upper.getMinimum();
                    this.setUpper(this.upper.remove(key));
                    this.key = key;
                    this.value = value;
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
        if (position === "ONE_COMES_FIRST") {
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
exports.GenericNode = GenericNode;
;
class Node extends GenericNode {
}
exports.Node = Node;
;
class GenericTree {
    root;
    constructor() {
        this.root = undefined;
    }
    *[Symbol.iterator]() {
        yield* this.filter();
    }
    clear() {
        this.vacate();
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
        let node = new GenericNode(key, value);
        if (this.root != null) {
            this.root = this.root.insert(node);
            this.root?.setParent(undefined);
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
        if (this.root != null) {
            return this.root.locate(filter)?.entry();
        }
    }
    lookup(key) {
        return this.locate({ operator: "=", key: key })?.value;
    }
    remove(key) {
        if (this.root != null) {
            this.root = this.root.remove(key);
            this.root?.setParent(undefined);
        }
    }
    vacate() {
        this.root = undefined;
    }
}
exports.GenericTree = GenericTree;
;
class Tree extends GenericTree {
}
exports.Tree = Tree;
;
