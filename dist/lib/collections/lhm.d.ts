export type LinkedHashMapEntry<A> = {
    key: number;
    value: A;
};
export declare class LinkedHashMap<A> implements Iterable<LinkedHashMapEntry<A>> {
    private list;
    private hash;
    constructor();
    [Symbol.iterator](): Iterator<LinkedHashMapEntry<A>>;
    insert(key: number, value: A): boolean;
    length(): number;
    lookup(key: number): A | undefined;
    remove(key: number): boolean;
    vacate(): void;
}
