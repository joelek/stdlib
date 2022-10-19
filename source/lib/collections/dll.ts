export class DoublyLinkedListNode<A> {
	private value: A;
	private last?: DoublyLinkedListNode<A>;
	private next?: DoublyLinkedListNode<A>;

	constructor(value: A) {
		this.value = value;
	}

	detach(): void {
		if (this.last != null) {
			this.last.setNext(this.next);
		}
		if (this.next != null) {
			this.next.setLast(this.last);
		}
	}

	getLast(): DoublyLinkedListNode<A> | undefined {
		return this.last;
	}

	getNext(): DoublyLinkedListNode<A> | undefined {
		return this.next;
	}

	getValue(): A {
		return this.value;
	}

	setLast(last?: DoublyLinkedListNode<A>): void {
		if (this.last != null) {
			this.last.next = undefined;
		}
		this.last = last;
		if (last != null) {
			last.next = this;
		}
	}

	setNext(next?: DoublyLinkedListNode<A>): void {
		if (this.next != null) {
			this.next.last = undefined;
		}
		this.next = next;
		if (next != null) {
			next.last = this;
		}
	}

	setValue(value: A): void {
		this.value = value;
	}
};

export class DoublyLinkedList<A> implements Iterable<A> {
	private head?: DoublyLinkedListNode<A>;
	private tail?: DoublyLinkedListNode<A>;

	constructor() {
		this.head = undefined;
		this.tail = undefined;
	}

	* [Symbol.iterator](): Iterator<A> {
		let node = this.head;
		while (node != null) {
			yield node.getValue();
			node = node.getNext();
		}
	}

	append(value: A): DoublyLinkedListNode<A> {
		let node = new DoublyLinkedListNode(value);
		if (this.tail != null) {
			this.tail.setNext(node);
		}
		this.head = this.head ?? node;
		this.tail = node;
		return node;
	}

	prepend(value: A): DoublyLinkedListNode<A> {
		let node = new DoublyLinkedListNode(value);
		if (this.head != null) {
			this.head.setLast(node);
		}
		this.head = node;
		this.tail = this.tail ?? node;
		return node;
	}

	remove(node: DoublyLinkedListNode<A>): void {
		if (this.head === node) {
			this.head = node.getNext();
		}
		if (this.tail === node) {
			this.tail = node.getLast();
		}
		node.detach();
	}

	unappend(): DoublyLinkedListNode<A> | undefined {
		if (this.tail == null) {
			return;
		}
		let node = this.tail;
		if (this.head === this.tail) {
			this.head = undefined;
			this.tail = undefined;
		} else {
			this.tail = node.getLast();
			if (this.tail != null) {
				this.tail.setNext(undefined);
			}
		}
		return node;
	}

	unprepend(): DoublyLinkedListNode<A> | undefined {
		if (this.head == null) {
			return;
		}
		let node = this.head;
		if (this.head === this.tail) {
			this.head = undefined;
			this.tail = undefined;
		} else {
			this.head = node.getNext();
			if (this.head != null) {
				this.head.setLast(undefined);
			}
		}
		return node;
	}
};
