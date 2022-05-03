import { DoublyLinkedList } from "./dll";

const Assert = {
	true(condition: boolean, message: string = ""): void {
		if (!condition) {
			throw message;
		}
	},
	array: {
		equals<A>(one: Array<A>, two: Array<A>, message: string = ""): void {
			if (one.length !== two.length) {
				throw message;
			}
			for (let i = 0; i < one.length; i++) {
				if (one[i] !== two[i]) {
					throw message;
				}
			}
		}
	}
};

function log(...values: Array<any>): void {
	(globalThis as any).console.log(...values);
};

function test(name: string, cb: (assert: typeof Assert) => Promise<any>): void {
	cb(Assert).catch((error) => {
		log(name);
		log(error);
	});
};

test(`It should support iteration with no values appended.`, async (assert) => {
	let dll = new DoublyLinkedList<number>();
	assert.array.equals(Array.from(dll), []);
});

test(`It should support iteration with value one appended.`, async (assert) => {
	let dll = new DoublyLinkedList<number>();
	dll.append(1);
	assert.array.equals(Array.from(dll), [1]);
});

test(`It should support iteration with value two appended.`, async (assert) => {
	let dll = new DoublyLinkedList<number>();
	dll.append(2);
	assert.array.equals(Array.from(dll), [2]);
});

test(`It should support iteration with both values appended.`, async (assert) => {
	let dll = new DoublyLinkedList<number>();
	dll.append(1);
	dll.append(2);
	assert.array.equals(Array.from(dll), [1, 2]);
});

test(`It should support appending value one.`, async (assert) => {
	let dll = new DoublyLinkedList<number>();
	let one = dll.append(1);
	assert.true(one.getValue() === 1);
	assert.true(one.getLast() === undefined);
	assert.true(one.getNext() === undefined);
});

test(`It should support appending value two.`, async (assert) => {
	let dll = new DoublyLinkedList<number>();
	let two = dll.append(2);
	assert.true(two.getValue() === 2);
	assert.true(two.getLast() === undefined);
	assert.true(two.getNext() === undefined);
});

test(`It should support appending both values.`, async (assert) => {
	let dll = new DoublyLinkedList<number>();
	let one = dll.append(1);
	let two = dll.append(2);
	assert.true(one.getValue() === 1);
	assert.true(one.getLast() === undefined);
	assert.true(one.getNext() === two);
	assert.true(two.getValue() === 2);
	assert.true(two.getLast() === one);
	assert.true(two.getNext() === undefined);
});

test(`It should support prepending value one.`, async (assert) => {
	let dll = new DoublyLinkedList<number>();
	let one = dll.prepend(1);
	assert.true(one.getValue() === 1);
	assert.true(one.getLast() === undefined);
	assert.true(one.getNext() === undefined);
});

test(`It should support prepending value two.`, async (assert) => {
	let dll = new DoublyLinkedList<number>();
	let two = dll.prepend(2);
	assert.true(two.getValue() === 2);
	assert.true(two.getLast() === undefined);
	assert.true(two.getNext() === undefined);
});

test(`It should support prepending both values.`, async (assert) => {
	let dll = new DoublyLinkedList<number>();
	let one = dll.prepend(1);
	let two = dll.prepend(2);
	assert.true(one.getValue() === 1);
	assert.true(one.getLast() === two);
	assert.true(one.getNext() === undefined);
	assert.true(two.getValue() === 2);
	assert.true(two.getLast() === undefined);
	assert.true(two.getNext() === one);
});

test(`It should support appending and removing values in fifo order.`, async (assert) => {
	let dll = new DoublyLinkedList<number>();
	assert.array.equals(Array.from(dll), []);
	let one = dll.append(1);
	assert.array.equals(Array.from(dll), [1]);
	let two = dll.append(2);
	assert.array.equals(Array.from(dll), [1, 2]);
	let three = dll.append(3);
	assert.array.equals(Array.from(dll), [1, 2, 3]);
	dll.remove(one);
	assert.array.equals(Array.from(dll), [2, 3]);
	dll.remove(two);
	assert.array.equals(Array.from(dll), [3]);
	dll.remove(three);
	assert.array.equals(Array.from(dll), []);
});

test(`It should support appending and removing values in lifo order.`, async (assert) => {
	let dll = new DoublyLinkedList<number>();
	assert.array.equals(Array.from(dll), []);
	let one = dll.append(1);
	assert.array.equals(Array.from(dll), [1]);
	let two = dll.append(2);
	assert.array.equals(Array.from(dll), [1, 2]);
	let three = dll.append(3);
	assert.array.equals(Array.from(dll), [1, 2, 3]);
	dll.remove(three);
	assert.array.equals(Array.from(dll), [1, 2]);
	dll.remove(two);
	assert.array.equals(Array.from(dll), [1]);
	dll.remove(one);
	assert.array.equals(Array.from(dll), []);
});

test(`It should support appending and unappending values.`, async (assert) => {
	let dll = new DoublyLinkedList<number>();
	assert.array.equals(Array.from(dll), []);
	let one = dll.append(1);
	assert.array.equals(Array.from(dll), [1]);
	let two = dll.append(2);
	assert.array.equals(Array.from(dll), [1, 2]);
	let three = dll.append(3);
	assert.array.equals(Array.from(dll), [1, 2, 3]);
	assert.true(dll.unappend() === three);
	assert.array.equals(Array.from(dll), [1, 2]);
	assert.true(dll.unappend() === two);
	assert.array.equals(Array.from(dll), [1]);
	assert.true(dll.unappend() === one);
	assert.array.equals(Array.from(dll), []);
	assert.true(dll.unappend() === undefined);
});

test(`It should support prepending and unprepending values.`, async (assert) => {
	let dll = new DoublyLinkedList<number>();
	assert.array.equals(Array.from(dll), []);
	let one = dll.prepend(1);
	assert.array.equals(Array.from(dll), [1]);
	let two = dll.prepend(2);
	assert.array.equals(Array.from(dll), [2, 1]);
	let three = dll.prepend(3);
	assert.array.equals(Array.from(dll), [3, 2, 1]);
	assert.true(dll.unprepend() === three);
	assert.array.equals(Array.from(dll), [2, 1]);
	assert.true(dll.unprepend() === two);
	assert.array.equals(Array.from(dll), [1]);
	assert.true(dll.unprepend() === one);
	assert.array.equals(Array.from(dll), []);
	assert.true(dll.unprepend() === undefined);
});
