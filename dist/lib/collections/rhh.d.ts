export type RobinHoodHashEntry<A> = {
    key: number;
    value: A;
};
export declare class RobinHoodHash<A> implements Iterable<RobinHoodHashEntry<A>> {
    private slots;
    private slotsUsed;
    constructor();
    private computeOptimalSlot;
    private doInsert;
    private doLookup;
    private doRemove;
    private propagateBackwards;
    private resizeIfNecessary;
    [Symbol.iterator](): Iterator<RobinHoodHashEntry<A>>;
    insert(key: number, value: A): boolean;
    length(): number;
    lookup(key: number): A | undefined;
    remove(key: number): boolean;
    vacate(): void;
}
