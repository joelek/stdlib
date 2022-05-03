import { RobinHoodHash } from "./rhh";

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

test(`It should support iteration with no values inserted.`, async (assert) => {
	let rhh = new RobinHoodHash<number>();
	let observed = Array.from(rhh).map((entry) => entry.value).sort();
	let expected = [] as Array<number>;
	assert.array.equals(observed, expected);
});

test(`It should support iteration with value one inserted.`, async (assert) => {
	let rhh = new RobinHoodHash<number>();
	rhh.insert(1, 1);
	let observed = Array.from(rhh).map((entry) => entry.value).sort();
	let expected = [1] as Array<number>;
	assert.array.equals(observed, expected);
});

test(`It should support iteration with value two inserted.`, async (assert) => {
	let rhh = new RobinHoodHash<number>();
	rhh.insert(2, 2);
	let observed = Array.from(rhh).map((entry) => entry.value).sort();
	let expected = [2] as Array<number>;
	assert.array.equals(observed, expected);
});

test(`It should support iteration with both values inserted.`, async (assert) => {
	let rhh = new RobinHoodHash<number>();
	rhh.insert(1, 1);
	rhh.insert(2, 2);
	let observed = Array.from(rhh).map((entry) => entry.value).sort();
	let expected = [1, 2] as Array<number>;
	assert.array.equals(observed, expected);
});

test(`It should support inserting value one.`, async (assert) => {
	let rhh = new RobinHoodHash<number>();
	assert.true(rhh.insert(1, 1) === true);
	assert.true(rhh.insert(1, 1) === false);
});

test(`It should support inserting value two.`, async (assert) => {
	let rhh = new RobinHoodHash<number>();
	assert.true(rhh.insert(2, 2) === true);
	assert.true(rhh.insert(2, 2) === false);
});

test(`It should support inserting both values.`, async (assert) => {
	let rhh = new RobinHoodHash<number>();
	assert.true(rhh.insert(1, 1) === true);
	assert.true(rhh.insert(2, 2) === true);
	assert.true(rhh.insert(1, 1) === false);
	assert.true(rhh.insert(2, 2) === false);
});

test(`It should support keeping track of the total number of values.`, async (assert) => {
	let rhh = new RobinHoodHash<number>();
	assert.true(rhh.length() === 0);
	rhh.insert(1, 1);
	assert.true(rhh.length() === 1);
	rhh.insert(2, 2);
	assert.true(rhh.length() === 2);
	rhh.remove(1);
	assert.true(rhh.length() === 1);
	rhh.remove(2);
	assert.true(rhh.length() === 0);
});

test(`It should support looking up values with no values inserted.`, async (assert) => {
	let rhh = new RobinHoodHash<number>();
	assert.true(rhh.lookup(1) === undefined);
	assert.true(rhh.lookup(2) === undefined);
});

test(`It should support looking up values with value one inserted.`, async (assert) => {
	let rhh = new RobinHoodHash<number>();
	rhh.insert(1, 1);
	assert.true(rhh.lookup(1) === 1);
	assert.true(rhh.lookup(2) === undefined);
});

test(`It should support looking up values with value two inserted.`, async (assert) => {
	let rhh = new RobinHoodHash<number>();
	rhh.insert(2, 2);
	assert.true(rhh.lookup(1) === undefined);
	assert.true(rhh.lookup(2) === 2);
});

test(`It should support looking up values with both values inserted.`, async (assert) => {
	let rhh = new RobinHoodHash<number>();
	rhh.insert(1, 1);
	rhh.insert(2, 2);
	assert.true(rhh.lookup(1) === 1);
	assert.true(rhh.lookup(2) === 2);
});

test(`It should support removing values with no values inserted.`, async (assert) => {
	let rhh = new RobinHoodHash<number>();
	assert.true(rhh.remove(1) === false);
	assert.true(rhh.remove(2) === false);
});

test(`It should support removing values with value one inserted.`, async (assert) => {
	let rhh = new RobinHoodHash<number>();
	rhh.insert(1, 1);
	assert.true(rhh.remove(1) === true);
	assert.true(rhh.remove(2) === false);
});

test(`It should support removing values with value two inserted.`, async (assert) => {
	let rhh = new RobinHoodHash<number>();
	rhh.insert(2, 2);
	assert.true(rhh.remove(1) === false);
	assert.true(rhh.remove(2) === true);
});

test(`It should support removing values with both values inserted.`, async (assert) => {
	let rhh = new RobinHoodHash<number>();
	rhh.insert(1, 1);
	rhh.insert(2, 2);
	assert.true(rhh.remove(1) === true);
	assert.true(rhh.remove(2) === true);
});

test(`It should support vacating.`, async (assert) => {
	let rhh = new RobinHoodHash<number>();
	rhh.insert(1, 1);
	rhh.insert(2, 2);
	rhh.vacate();
	let observed = Array.from(rhh).map((entry) => entry.value).sort();
	let expected = [] as Array<number>;
	assert.array.equals(observed, expected);
});
