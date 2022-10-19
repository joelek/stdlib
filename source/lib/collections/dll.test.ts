import * as wtf from "@joelek/wtf";
import { DoublyLinkedList } from "./dll";

wtf.test(`It should support iteration with no values appended.`, async (assert) => {
	let dll = new DoublyLinkedList<number>();
	assert.equals(Array.from(dll), []);
});

wtf.test(`It should support iteration with value one appended.`, async (assert) => {
	let dll = new DoublyLinkedList<number>();
	dll.append(1);
	assert.equals(Array.from(dll), [1]);
});

wtf.test(`It should support iteration with value two appended.`, async (assert) => {
	let dll = new DoublyLinkedList<number>();
	dll.append(2);
	assert.equals(Array.from(dll), [2]);
});

wtf.test(`It should support iteration with both values appended.`, async (assert) => {
	let dll = new DoublyLinkedList<number>();
	dll.append(1);
	dll.append(2);
	assert.equals(Array.from(dll), [1, 2]);
});

wtf.test(`It should support appending value one.`, async (assert) => {
	let dll = new DoublyLinkedList<number>();
	let one = dll.append(1);
	assert.equals(one.getValue(), 1);
	assert.equals(one.getLast() === undefined, true);
	assert.equals(one.getNext() === undefined, true);
});

wtf.test(`It should support appending value two.`, async (assert) => {
	let dll = new DoublyLinkedList<number>();
	let two = dll.append(2);
	assert.equals(two.getValue(), 2);
	assert.equals(two.getLast() === undefined, true);
	assert.equals(two.getNext() === undefined, true);
});

wtf.test(`It should support appending both values.`, async (assert) => {
	let dll = new DoublyLinkedList<number>();
	let one = dll.append(1);
	let two = dll.append(2);
	assert.equals(one.getValue(), 1);
	assert.equals(one.getLast() === undefined, true);
	assert.equals(one.getNext() === two, true);
	assert.equals(two.getValue(), 2);
	assert.equals(two.getLast() === one, true);
	assert.equals(two.getNext() === undefined, true);
});

wtf.test(`It should support prepending value one.`, async (assert) => {
	let dll = new DoublyLinkedList<number>();
	let one = dll.prepend(1);
	assert.equals(one.getValue(), 1);
	assert.equals(one.getLast() === undefined, true);
	assert.equals(one.getNext() === undefined, true);
});

wtf.test(`It should support prepending value two.`, async (assert) => {
	let dll = new DoublyLinkedList<number>();
	let two = dll.prepend(2);
	assert.equals(two.getValue(), 2);
	assert.equals(two.getLast() === undefined, true);
	assert.equals(two.getNext() === undefined, true);
});

wtf.test(`It should support prepending both values.`, async (assert) => {
	let dll = new DoublyLinkedList<number>();
	let one = dll.prepend(1);
	let two = dll.prepend(2);
	assert.equals(one.getValue(), 1);
	assert.equals(one.getLast() === two, true);
	assert.equals(one.getNext() === undefined, true);
	assert.equals(two.getValue(), 2);
	assert.equals(two.getLast() === undefined, true);
	assert.equals(two.getNext() === one, true);
});

wtf.test(`It should support appending and removing values in fifo order.`, async (assert) => {
	let dll = new DoublyLinkedList<number>();
	assert.equals(Array.from(dll), []);
	let one = dll.append(1);
	assert.equals(Array.from(dll), [1]);
	let two = dll.append(2);
	assert.equals(Array.from(dll), [1, 2]);
	let three = dll.append(3);
	assert.equals(Array.from(dll), [1, 2, 3]);
	dll.remove(one);
	assert.equals(Array.from(dll), [2, 3]);
	dll.remove(two);
	assert.equals(Array.from(dll), [3]);
	dll.remove(three);
	assert.equals(Array.from(dll), []);
});

wtf.test(`It should support appending and removing values in lifo order.`, async (assert) => {
	let dll = new DoublyLinkedList<number>();
	assert.equals(Array.from(dll), []);
	let one = dll.append(1);
	assert.equals(Array.from(dll), [1]);
	let two = dll.append(2);
	assert.equals(Array.from(dll), [1, 2]);
	let three = dll.append(3);
	assert.equals(Array.from(dll), [1, 2, 3]);
	dll.remove(three);
	assert.equals(Array.from(dll), [1, 2]);
	dll.remove(two);
	assert.equals(Array.from(dll), [1]);
	dll.remove(one);
	assert.equals(Array.from(dll), []);
});

wtf.test(`It should support appending and unappending values.`, async (assert) => {
	let dll = new DoublyLinkedList<number>();
	assert.equals(Array.from(dll), []);
	let one = dll.append(1);
	assert.equals(Array.from(dll), [1]);
	let two = dll.append(2);
	assert.equals(Array.from(dll), [1, 2]);
	let three = dll.append(3);
	assert.equals(Array.from(dll), [1, 2, 3]);
	assert.equals(dll.unappend() === three, true);
	assert.equals(Array.from(dll), [1, 2]);
	assert.equals(dll.unappend() === two, true);
	assert.equals(Array.from(dll), [1]);
	assert.equals(dll.unappend() === one, true);
	assert.equals(Array.from(dll), []);
	assert.equals(dll.unappend() === undefined, true);
});

wtf.test(`It should support prepending and unprepending values.`, async (assert) => {
	let dll = new DoublyLinkedList<number>();
	assert.equals(Array.from(dll), []);
	let one = dll.prepend(1);
	assert.equals(Array.from(dll), [1]);
	let two = dll.prepend(2);
	assert.equals(Array.from(dll), [2, 1]);
	let three = dll.prepend(3);
	assert.equals(Array.from(dll), [3, 2, 1]);
	assert.equals(dll.unprepend() === three, true);
	assert.equals(Array.from(dll), [2, 1]);
	assert.equals(dll.unprepend() === two, true);
	assert.equals(Array.from(dll), [1]);
	assert.equals(dll.unprepend() === one, true);
	assert.equals(Array.from(dll), []);
	assert.equals(dll.unprepend() === undefined, true);
});
