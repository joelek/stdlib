import { DoublyLinkedList, DoublyLinkedListNode } from "./dll";
import { RobinHoodHash } from "./rhh";

export type LinkedHashMapEntry<A> = {
	key: number;
	value: A;
};

export class LinkedHashMap<A> implements Iterable<LinkedHashMapEntry<A>> {
	private list: DoublyLinkedList<LinkedHashMapEntry<A>>;
	private hash: RobinHoodHash<DoublyLinkedListNode<LinkedHashMapEntry<A>>>;

	constructor() {
		this.list = new DoublyLinkedList<LinkedHashMapEntry<A>>();
		this.hash = new RobinHoodHash<DoublyLinkedListNode<LinkedHashMapEntry<A>>>();
	}

	* [Symbol.iterator](): Iterator<LinkedHashMapEntry<A>> {
		yield * this.list;
	}

	insert(key: number, value: A): boolean {
		let node = this.hash.lookup(key);
		if (node != null) {
			node.getValue().value = value;
			return false;
		} else {
			node = this.list.append({ key, value });
			this.hash.insert(key, node);
			return true;
		}
	}

	length(): number {
		return this.hash.length();
	}

	lookup(key: number): A | undefined {
		let node = this.hash.lookup(key);
		if (node == null) {
			return;
		}
		return node.getValue().value;
	}

	remove(key: number): boolean {
		let node = this.hash.lookup(key);
		if (node != null) {
			this.hash.remove(key);
			this.list.remove(node);
			return true;
		} else {
			return false;
		}
	}

	vacate(): void {
		this.list = new DoublyLinkedList<LinkedHashMapEntry<A>>();
		this.hash = new RobinHoodHash<DoublyLinkedListNode<LinkedHashMapEntry<A>>>();
	}
};
