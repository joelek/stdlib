export declare class DoublyLinkedListNode<A> {
    private value;
    private last?;
    private next?;
    constructor(value: A);
    detach(): void;
    getLast(): DoublyLinkedListNode<A> | undefined;
    getNext(): DoublyLinkedListNode<A> | undefined;
    getValue(): A;
    setLast(last?: DoublyLinkedListNode<A>): void;
    setNext(next?: DoublyLinkedListNode<A>): void;
    setValue(value: A): void;
}
export declare class DoublyLinkedList<A> implements Iterable<A> {
    private head?;
    private tail?;
    constructor();
    [Symbol.iterator](): Iterator<A>;
    append(value: A): DoublyLinkedListNode<A>;
    prepend(value: A): DoublyLinkedListNode<A>;
    remove(node: DoublyLinkedListNode<A>): void;
    unappend(): DoublyLinkedListNode<A> | undefined;
    unprepend(): DoublyLinkedListNode<A> | undefined;
}
