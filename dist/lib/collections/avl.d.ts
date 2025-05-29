export type Key = string | number | boolean | undefined | null | bigint;
export type GenericEntry<A, B extends Key> = {
    key: B;
    value: A;
};
export type Entry<A> = GenericEntry<A, number>;
export type Operator = "<" | "<=" | "=" | ">=" | ">";
export type GenericFilter<A extends Key> = {
    operator: Operator;
    key: A;
};
export type Filter = GenericFilter<number>;
export type CollatorResult = "ONE_COMES_FIRST" | "IDENTICAL" | "TWO_COMES_FIRST";
export type Collator<A> = (one: A, two: A) => CollatorResult;
export declare const COLLATOR: Collator<Key>;
export declare class GenericNode<A, B extends Key> {
    private key;
    private value;
    private height;
    private parent;
    private lower;
    private upper;
    constructor(key: B, value: A, height?: number);
    compare(filter: GenericFilter<B>): number;
    computeBalance(): number;
    computeHeight(): number;
    entry(): GenericEntry<A, B>;
    filter(...filters: Array<GenericFilter<B>>): Iterable<GenericEntry<A, B>>;
    getMaximum(): GenericNode<A, B>;
    getMinimum(): GenericNode<A, B>;
    getLowerParent(): GenericNode<A, B> | undefined;
    getUpperParent(): GenericNode<A, B> | undefined;
    getPredecessor(): GenericNode<A, B> | undefined;
    getSuccessor(): GenericNode<A, B> | undefined;
    insert(node: GenericNode<A, B>): GenericNode<A, B>;
    locate(filter: GenericFilter<B>): GenericNode<A, B> | undefined;
    rebalance(): GenericNode<A, B>;
    remove(key: B): GenericNode<A, B> | undefined;
    rotateLeft(): GenericNode<A, B>;
    rotateRight(): GenericNode<A, B>;
    getHeight(): number;
    setHeight(height: number): number;
    getParent(): GenericNode<A, B> | undefined;
    setParent(parent: GenericNode<A, B> | undefined): void;
    getLower(): GenericNode<A, B> | undefined;
    setLower(lower: GenericNode<A, B> | undefined): void;
    getUpper(): GenericNode<A, B> | undefined;
    setUpper(upper: GenericNode<A, B> | undefined): void;
}
export declare class Node<A> extends GenericNode<A, number> {
}
export declare class GenericTree<A, B extends Key> {
    private root;
    constructor();
    [Symbol.iterator](): Iterator<GenericEntry<A, B>>;
    clear(): void;
    filter(...filters: GenericFilter<B>[]): Iterable<GenericEntry<A, B>>;
    insert(key: B, value: A): void;
    length(): number;
    locate(filter: GenericFilter<B>): GenericEntry<A, B> | undefined;
    lookup(key: B): A | undefined;
    remove(key: B): void;
    vacate(): void;
}
export declare class Tree<A> extends GenericTree<A, number> {
}
