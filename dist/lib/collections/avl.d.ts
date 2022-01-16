export declare type Entry<A> = {
    key: number;
    value: A;
};
export declare type Operator = "<" | "<=" | "=" | ">=" | ">";
export declare type Filter = {
    operator: Operator;
    key: number;
};
export declare class Node<A> {
    private key;
    private value;
    private height;
    private parent;
    private lower;
    private upper;
    constructor(key: number, value: A, height?: number);
    compare(filter: Filter): number;
    computeBalance(): number;
    computeHeight(): number;
    entry(): Entry<A>;
    filter(...filters: Array<Filter>): Iterable<Entry<A>>;
    getMaximum(): Node<A>;
    getMinimum(): Node<A>;
    getLowerParent(): Node<A> | undefined;
    getUpperParent(): Node<A> | undefined;
    getPredecessor(): Node<A> | undefined;
    getSuccessor(): Node<A> | undefined;
    insert(node: Node<A>): Node<A>;
    locate(filter: Filter): Node<A> | undefined;
    rebalance(): Node<A>;
    remove(key: number): Node<A> | undefined;
    rotateLeft(): Node<A>;
    rotateRight(): Node<A>;
    getHeight(): number;
    setHeight(height: number): number;
    getParent(): Node<A> | undefined;
    setParent(parent: Node<A> | undefined): void;
    getLower(): Node<A> | undefined;
    setLower(lower: Node<A> | undefined): void;
    getUpper(): Node<A> | undefined;
    setUpper(upper: Node<A> | undefined): void;
}
export declare class Tree<A> {
    private root;
    constructor();
    [Symbol.iterator](): Iterable<Entry<A>>;
    clear(): void;
    filter(...filters: Filter[]): Iterable<Entry<A>>;
    insert(key: number, value: A): void;
    length(): number;
    locate(filter: Filter): Entry<A> | undefined;
    lookup(key: number): A | undefined;
    remove(key: number): void;
}
