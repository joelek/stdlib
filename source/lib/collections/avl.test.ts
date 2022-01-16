import * as avl from "./avl";

const Assert = {
	true(condition: boolean, message: string = ""): void {
		if (!condition) {
			throw message;
		}
	},
	array: {
		equal<A>(one: Array<A>, two: Array<A>, message: string = ""): void {
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

test(`It should compute tree balance.`, async (assert) => {
	let n1 = new avl.Node(1, null, 2);
	let n2 = new avl.Node(2, null, 1);
	let n3 = new avl.Node(3, null, 3);
	let n4 = new avl.Node(4, null, 1);
	let n5 = new avl.Node(5, null, 2);
	n3.setLower(n1);
	n3.setUpper(n5);
	n5.setLower(n4);
	n1.setUpper(n2);
	assert.true(n1.computeBalance() === 1);
	assert.true(n2.computeBalance() === 0);
	assert.true(n3.computeBalance() === 0);
	assert.true(n4.computeBalance() === 0);
	assert.true(n5.computeBalance() === -1);
});

test(`It should compute tree height.`, async (assert) => {
	let n1 = new avl.Node(1, null, 2);
	let n2 = new avl.Node(2, null, 1);
	let n3 = new avl.Node(3, null, 3);
	let n4 = new avl.Node(4, null, 1);
	let n5 = new avl.Node(5, null, 2);
	n3.setLower(n1);
	n3.setUpper(n5);
	n5.setLower(n4);
	n1.setUpper(n2);
	assert.true(n1.computeHeight() === 2);
	assert.true(n2.computeHeight() === 1);
	assert.true(n3.computeHeight() === 3);
	assert.true(n4.computeHeight() === 1);
	assert.true(n5.computeHeight() === 2);
});

test(`It should support filtering nodes without using a filter.`, async (assert) => {
	let n1 = new avl.Node(1, null);
	let n2 = new avl.Node(2, null);
	let n3 = new avl.Node(3, null);
	let n4 = new avl.Node(4, null);
	let n5 = new avl.Node(5, null);
	n3.setLower(n1);
	n3.setUpper(n5);
	n5.setLower(n4);
	n1.setUpper(n2);
	let observed = Array.from(n3.filter()).map((entry) => entry.key);
	let expected = [1, 2, 3, 4, 5] as Array<number>;
	assert.array.equal(observed, expected);
});

test(`It should support filtering nodes using a ">" filter and a "<" filter.`, async (assert) => {
	let n1 = new avl.Node(1, null);
	let n2 = new avl.Node(2, null);
	let n3 = new avl.Node(3, null);
	let n4 = new avl.Node(4, null);
	let n5 = new avl.Node(5, null);
	n3.setLower(n1);
	n3.setUpper(n5);
	n5.setLower(n4);
	n1.setUpper(n2);
	let observed = Array.from(n3.filter({ operator: ">", key: 1 }, { operator: "<", key: 5 }))
		.map((entry) => entry.key);
	let expected = [2, 3, 4] as Array<number>;
	assert.array.equal(observed, expected);
});

test(`It should locate maximum nodes.`, async (assert) => {
	let n1 = new avl.Node(1, null);
	let n2 = new avl.Node(2, null);
	let n3 = new avl.Node(3, null);
	let n4 = new avl.Node(4, null);
	let n5 = new avl.Node(5, null);
	n3.setLower(n1);
	n3.setUpper(n5);
	n5.setLower(n4);
	n1.setUpper(n2);
	assert.true(n1.getMaximum() === n2);
	assert.true(n2.getMaximum() === n2);
	assert.true(n3.getMaximum() === n5);
	assert.true(n4.getMaximum() === n4);
	assert.true(n5.getMaximum() === n5);
});

test(`It should support filtering nodes using a single filter.`, async (assert) => {
	let n1 = new avl.Node(1, null);
	let n3 = new avl.Node(3, null);
	let n5 = new avl.Node(5, null);
	let n7 = new avl.Node(7, null);
	let n9 = new avl.Node(9, null);
	n5.setLower(n1);
	n5.setUpper(n9);
	n9.setLower(n7);
	n1.setUpper(n3);
	let operators = [">", ">=", "=", "<=", "<"] as Array<avl.Operator>;
	let keys = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	for (let operator of operators) {
		for (let key of keys) {
			let observed = Array.from(n5.filter({ operator: operator, key: key })).map((entry) => entry.key);
			let expected = [] as Array<number>;
			if (operator === "<") {
				expected = keys.filter((k) => k % 2 === 1 && k < key);
			} else if (operator === "<=") {
				expected = keys.filter((k) => k % 2 === 1 && k <= key);
			} else if (operator === "=") {
				expected = keys.filter((k) => k % 2 === 1 && k === key);
			} else if (operator === ">=") {
				expected = keys.filter((k) => k % 2 === 1 && k >= key);
			} else if (operator === ">") {
				expected = keys.filter((k) => k % 2 === 1 && k > key);
			}
			assert.array.equal(observed, expected, `Expected ${observed} for operator "${operator}" and key ${key} to be ${expected}!`);
		}
	}
});

test(`It should locate minimum nodes.`, async (assert) => {
	let n1 = new avl.Node(1, null);
	let n2 = new avl.Node(2, null);
	let n3 = new avl.Node(3, null);
	let n4 = new avl.Node(4, null);
	let n5 = new avl.Node(5, null);
	n3.setLower(n1);
	n3.setUpper(n5);
	n5.setLower(n4);
	n1.setUpper(n2);
	assert.true(n1.getMinimum() === n1);
	assert.true(n2.getMinimum() === n2);
	assert.true(n3.getMinimum() === n1);
	assert.true(n4.getMinimum() === n4);
	assert.true(n5.getMinimum() === n4);
});

test(`It should locate lower parent nodes.`, async (assert) => {
	let n1 = new avl.Node(1, null);
	let n2 = new avl.Node(2, null);
	let n3 = new avl.Node(3, null);
	let n4 = new avl.Node(4, null);
	let n5 = new avl.Node(5, null);
	n3.setLower(n1);
	n3.setUpper(n5);
	n5.setLower(n4);
	n1.setUpper(n2);
	assert.true(n2.getLowerParent() === n1);
	assert.true(n4.getLowerParent() === n3);
});

test(`It should locate upper parent nodes.`, async (assert) => {
	let n1 = new avl.Node(1, null);
	let n2 = new avl.Node(2, null);
	let n3 = new avl.Node(3, null);
	let n4 = new avl.Node(4, null);
	let n5 = new avl.Node(5, null);
	n3.setLower(n1);
	n3.setUpper(n5);
	n5.setLower(n4);
	n1.setUpper(n2);
	assert.true(n2.getUpperParent() === n3);
	assert.true(n4.getUpperParent() === n5);
});

test(`It should locate predecessor nodes.`, async (assert) => {
	let n1 = new avl.Node(1, null);
	let n2 = new avl.Node(2, null);
	let n3 = new avl.Node(3, null);
	let n4 = new avl.Node(4, null);
	let n5 = new avl.Node(5, null);
	n3.setLower(n1);
	n3.setUpper(n5);
	n5.setLower(n4);
	n1.setUpper(n2);
	assert.true(n1.getPredecessor() == null);
	assert.true(n2.getPredecessor() === n1);
	assert.true(n3.getPredecessor() === n2);
	assert.true(n4.getPredecessor() === n3);
	assert.true(n5.getPredecessor() === n4);
});

test(`It should locate successor nodes.`, async (assert) => {
	let n1 = new avl.Node(1, null);
	let n2 = new avl.Node(2, null);
	let n3 = new avl.Node(3, null);
	let n4 = new avl.Node(4, null);
	let n5 = new avl.Node(5, null);
	n3.setLower(n1);
	n3.setUpper(n5);
	n5.setLower(n4);
	n1.setUpper(n2);
	assert.true(n1.getSuccessor() === n2);
	assert.true(n2.getSuccessor() === n3);
	assert.true(n3.getSuccessor() === n4);
	assert.true(n4.getSuccessor() === n5);
	assert.true(n5.getSuccessor() == null);
});

test(`It should support inserting 1,2,3 in 1,2,3 order.`, async (assert) => {
	let n1 = new avl.Node(1, null);
	let n2 = new avl.Node(2, null);
	let n3 = new avl.Node(3, null);
	let r = n1;
	r = r.insert(n2) ?? r;
	r = r.insert(n3) ?? r;
	assert.true(r === n2);
	assert.true(r.getLower() === n1);
	assert.true(r.getUpper() === n3);
});

test(`It should support inserting 1,2,3 in 1,3,2 order.`, async (assert) => {
	let n1 = new avl.Node(1, null);
	let n2 = new avl.Node(2, null);
	let n3 = new avl.Node(3, null);
	let r = n1;
	r = r.insert(n3) ?? r;
	r = r.insert(n2) ?? r;
	assert.true(r === n2);
	assert.true(r.getLower() === n1);
	assert.true(r.getUpper() === n3);
});

test(`It should support inserting 1,2,3 in 2,1,3 order.`, async (assert) => {
	let n1 = new avl.Node(1, null);
	let n2 = new avl.Node(2, null);
	let n3 = new avl.Node(3, null);
	let r = n2;
	r = r.insert(n1) ?? r;
	r = r.insert(n3) ?? r;
	assert.true(r === n2);
	assert.true(r.getLower() === n1);
	assert.true(r.getUpper() === n3);
});

test(`It should support inserting 1,2,3 in 2,3,1 order.`, async (assert) => {
	let n1 = new avl.Node(1, null);
	let n2 = new avl.Node(2, null);
	let n3 = new avl.Node(3, null);
	let r = n2;
	r = r.insert(n3) ?? r;
	r = r.insert(n1) ?? r;
	assert.true(r === n2);
	assert.true(r.getLower() === n1);
	assert.true(r.getUpper() === n3);
});

test(`It should support inserting 1,2,3 in 3,1,2 order.`, async (assert) => {
	let n1 = new avl.Node(1, null);
	let n2 = new avl.Node(2, null);
	let n3 = new avl.Node(3, null);
	let r = n3;
	r = r.insert(n1) ?? r;
	r = r.insert(n2) ?? r;
	assert.true(r === n2);
	assert.true(r.getLower() === n1);
	assert.true(r.getUpper() === n3);
});

test(`It should support inserting 1,2,3 in 3,2,1 order.`, async (assert) => {
	let n1 = new avl.Node(1, null);
	let n2 = new avl.Node(2, null);
	let n3 = new avl.Node(3, null);
	let r = n3;
	r = r.insert(n2) ?? r;
	r = r.insert(n1) ?? r;
	assert.true(r === n2);
	assert.true(r.getLower() === n1);
	assert.true(r.getUpper() === n3);
});

test(`It should support locating nodes.`, async (assert) => {
	let n1 = new avl.Node(1, null);
	let n3 = new avl.Node(3, null);
	let n5 = new avl.Node(5, null);
	let n7 = new avl.Node(7, null);
	let n9 = new avl.Node(9, null);
	n5.setLower(n1);
	n5.setUpper(n9);
	n9.setLower(n7);
	n1.setUpper(n3);
	let operators = [">", ">=", "=", "<=", "<"] as Array<avl.Operator>;
	let keys = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	for (let operator of operators) {
		for (let key of keys) {
			let observed = n5.locate({ operator: operator, key: key })?.entry().key;
			let expected: number | undefined;
			if (operator === "<") {
				if (key >= 2) {
					expected = key - (key % 2 === 0 ? 1 : 2);
				}
			} else if (operator === "<=") {
				if (key >= 1) {
					expected = key - (key % 2 === 0 ? 1 : 0);
				}
			} else if (operator === "=") {
				if (key % 2 === 1) {
					expected = key;
				}
			} else if (operator === ">=") {
				if (key <= 9) {
					expected = key + (key % 2 === 0 ? 1 : 0);
				}
			} else if (operator === ">") {
				if (key <= 8) {
					expected = key + (key % 2 === 0 ? 1 : 2);
				}
			}
			assert.true(observed === expected, `Expected ${observed} for operator "${operator}" and key ${key} to be ${expected}!`);
		}
	}
});

test(`It should support removing nodes with no children.`, async (assert) => {
	let n1 = new avl.Node(1, null, 2);
	let n2 = new avl.Node(2, null, 1);
	let n3 = new avl.Node(3, null, 3);
	let n4 = new avl.Node(4, null, 2);
	let n5 = new avl.Node(5, null, 1);
	n1.setUpper(n2);
	n3.setLower(n1);
	n3.setUpper(n5);
	n5.setLower(n4);
	let result = n3.remove(2);
	assert.true(result === n3);
	assert.true(n1.getUpper() == null);
});

test(`It should support removing nodes with one lower child.`, async (assert) => {
	let n1 = new avl.Node(1, null, 2);
	let n2 = new avl.Node(2, null, 1);
	let n3 = new avl.Node(3, null, 3);
	let n4 = new avl.Node(4, null, 2);
	let n5 = new avl.Node(5, null, 1);
	n1.setUpper(n2);
	n3.setLower(n1);
	n3.setUpper(n5);
	n5.setLower(n4);
	let result = n3.remove(5);
	assert.true(result === n3);
	assert.true(n3.getUpper() === n4);
});

test(`It should support removing nodes with one upper child.`, async (assert) => {
	let n1 = new avl.Node(1, null, 2);
	let n2 = new avl.Node(2, null, 1);
	let n3 = new avl.Node(3, null, 3);
	let n4 = new avl.Node(4, null, 2);
	let n5 = new avl.Node(5, null, 1);
	n1.setUpper(n2);
	n3.setLower(n1);
	n3.setUpper(n5);
	n5.setLower(n4);
	let result = n3.remove(1);
	assert.true(result === n3);
	assert.true(n3.getLower() === n2);
});

test(`It should support removing nodes with two children through substitution.`, async (assert) => {
	let n1 = new avl.Node(1, null, 2);
	let n2 = new avl.Node(2, null, 1);
	let n3 = new avl.Node(3, null, 3);
	let n4 = new avl.Node(4, null, 2);
	let n5 = new avl.Node(5, null, 1);
	n1.setUpper(n2);
	n3.setLower(n1);
	n3.setUpper(n5);
	n5.setLower(n4);
	let result = n3.remove(3);
	assert.true(result === n3);
	assert.true(result?.entry().key === 4);
	assert.true(n3.getLower() === n1);
	assert.true(n3.getUpper() === n5);
});

test(`It should rebalance left left heavy nodes.`, async (assert) => {
	let n1 = new avl.Node(1, null, 2);
	let n2 = new avl.Node(2, null, 3);
	let n3 = new avl.Node(3, null, 1);
	let n4 = new avl.Node(4, null, 4);
	let n5 = new avl.Node(5, null, 1);
	n4.setLower(n2);
	n4.setUpper(n5);
	n2.setLower(n1);
	n2.setUpper(n3);
	let result = n4.rebalance();
	assert.true(result === n2);
	assert.true(n2.getLower() === n1);
	assert.true(n2.getUpper() === n4);
	assert.true(n4.getLower() === n3);
	assert.true(n4.getUpper() === n5);
});

test(`It should rebalance left right heavy nodes.`, async (assert) => {
	let n1 = new avl.Node(1, null, 1);
	let n2 = new avl.Node(2, null, 3);
	let n3 = new avl.Node(3, null, 2);
	let n4 = new avl.Node(4, null, 4);
	let n5 = new avl.Node(5, null, 1);
	n4.setLower(n2);
	n4.setUpper(n5);
	n2.setLower(n1);
	n2.setUpper(n3);
	let result = n4.rebalance();
	assert.true(result === n3);
	assert.true(n3.getLower() === n2);
	assert.true(n3.getUpper() === n4);
	assert.true(n2.getLower() === n1);
	assert.true(n4.getUpper() === n5);
});

test(`It should rebalance right left heavy nodes.`, async (assert) => {
	let n1 = new avl.Node(1, null, 1);
	let n2 = new avl.Node(2, null, 4);
	let n3 = new avl.Node(3, null, 2);
	let n4 = new avl.Node(4, null, 3);
	let n5 = new avl.Node(5, null, 1);
	n2.setLower(n1);
	n2.setUpper(n4);
	n4.setLower(n3);
	n4.setUpper(n5);
	let result = n2.rebalance();
	assert.true(result === n3);
	assert.true(n3.getLower() === n2);
	assert.true(n3.getUpper() === n4);
	assert.true(n2.getLower() === n1);
	assert.true(n4.getUpper() === n5);
});

test(`It should rebalance right right heavy nodes.`, async (assert) => {
	let n1 = new avl.Node(1, null, 1);
	let n2 = new avl.Node(2, null, 4);
	let n3 = new avl.Node(3, null, 1);
	let n4 = new avl.Node(4, null, 3);
	let n5 = new avl.Node(5, null, 2);
	n2.setLower(n1);
	n2.setUpper(n4);
	n4.setLower(n3);
	n4.setUpper(n5);
	let result = n2.rebalance();
	assert.true(result === n4);
	assert.true(n4.getLower() === n2);
	assert.true(n4.getUpper() === n5);
	assert.true(n2.getLower() === n1);
	assert.true(n2.getUpper() === n3);
});

test(`It should perform left rotations.`, async (assert) => {
	let n1 = new avl.Node(1, null);
	let n2 = new avl.Node(2, null);
	let n3 = new avl.Node(3, null);
	let n4 = new avl.Node(4, null);
	let n5 = new avl.Node(5, null);
	n2.setLower(n1);
	n2.setUpper(n4);
	n4.setLower(n3);
	n4.setUpper(n5);
	let result = n2.rotateLeft();
	assert.true(result === n4);
	assert.true(n4.getLower() === n2);
	assert.true(n4.getUpper() === n5);
	assert.true(n2.getLower() === n1);
	assert.true(n2.getUpper() === n3);
	assert.true(n2.getHeight() === 2);
	assert.true(n4.getHeight() === 3);
});

test(`It should perform right rotations.`, async (assert) => {
	let n1 = new avl.Node(1, null);
	let n2 = new avl.Node(2, null);
	let n3 = new avl.Node(3, null);
	let n4 = new avl.Node(4, null);
	let n5 = new avl.Node(5, null);
	n4.setLower(n2);
	n4.setUpper(n5);
	n2.setLower(n1);
	n2.setUpper(n3);
	let result = n4.rotateRight();
	assert.true(result === n2);
	assert.true(n2.getLower() === n1);
	assert.true(n2.getUpper() === n4);
	assert.true(n4.getLower() === n3);
	assert.true(n4.getUpper() === n5);
	assert.true(n4.getHeight() === 2);
	assert.true(n2.getHeight() === 3);
});

test(`It should update all pointers when setting the lower child.`, async (assert) => {
	let n0 = new avl.Node(0, null);
	let n1 = new avl.Node(1, null);
	let n2 = new avl.Node(2, null);
	n1.setLower(n0);
	assert.true(n0.getParent() === n1);
	assert.true(n1.getLower() === n0);
	assert.true(n2.getLower() === undefined);
	n2.setLower(n0);
	assert.true(n0.getParent() === n2);
	assert.true(n1.getLower() === undefined);
	assert.true(n2.getLower() === n0);
});

test(`It should update all pointers when setting the upper child.`, async (assert) => {
	let n0 = new avl.Node(0, null);
	let n1 = new avl.Node(1, null);
	let n2 = new avl.Node(2, null);
	n1.setUpper(n0);
	assert.true(n0.getParent() === n1);
	assert.true(n1.getUpper() === n0);
	assert.true(n2.getUpper() === undefined);
	n2.setUpper(n0);
	assert.true(n0.getParent() === n2);
	assert.true(n1.getUpper() === undefined);
	assert.true(n2.getUpper() === n0);
});
