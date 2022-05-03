import { LinkedHashMap } from "./lhm";

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
	let lhm = new LinkedHashMap<number>();
	let observed = Array.from(lhm).map((entry) => entry.value);
	let expected = [] as Array<number>;
	assert.array.equals(observed, expected);
});

test(`It should support iteration with value one inserted.`, async (assert) => {
	let lhm = new LinkedHashMap<number>();
	lhm.insert(1, 1);
	let observed = Array.from(lhm).map((entry) => entry.value);
	let expected = [1] as Array<number>;
	assert.array.equals(observed, expected);
});

test(`It should support iteration with value two inserted.`, async (assert) => {
	let lhm = new LinkedHashMap<number>();
	lhm.insert(2, 2);
	let observed = Array.from(lhm).map((entry) => entry.value);
	let expected = [2] as Array<number>;
	assert.array.equals(observed, expected);
});

test(`It should support iteration with both values inserted.`, async (assert) => {
	let lhm = new LinkedHashMap<number>();
	lhm.insert(1, 1);
	lhm.insert(2, 2);
	let observed = Array.from(lhm).map((entry) => entry.value);
	let expected = [1, 2] as Array<number>;
	assert.array.equals(observed, expected);
});

test(`It should support inserting value one.`, async (assert) => {
	let lhm = new LinkedHashMap<number>();
	assert.true(lhm.insert(1, 1) === true);
	assert.true(lhm.insert(1, 1) === false);
});

test(`It should support inserting value two.`, async (assert) => {
	let lhm = new LinkedHashMap<number>();
	assert.true(lhm.insert(2, 2) === true);
	assert.true(lhm.insert(2, 2) === false);
});

test(`It should support inserting both values.`, async (assert) => {
	let lhm = new LinkedHashMap<number>();
	assert.true(lhm.insert(1, 1) === true);
	assert.true(lhm.insert(2, 2) === true);
	assert.true(lhm.insert(1, 1) === false);
	assert.true(lhm.insert(2, 2) === false);
});

test(`It should support keeping track of the total number of values.`, async (assert) => {
	let lhm = new LinkedHashMap<number>();
	assert.true(lhm.length() === 0);
	lhm.insert(1, 1);
	assert.true(lhm.length() === 1);
	lhm.insert(2, 2);
	assert.true(lhm.length() === 2);
	lhm.remove(1);
	assert.true(lhm.length() === 1);
	lhm.remove(2);
	assert.true(lhm.length() === 0);
});

test(`It should support looking up values with no values inserted.`, async (assert) => {
	let lhm = new LinkedHashMap<number>();
	assert.true(lhm.lookup(1) === undefined);
	assert.true(lhm.lookup(2) === undefined);
});

test(`It should support looking up values with value one inserted.`, async (assert) => {
	let lhm = new LinkedHashMap<number>();
	lhm.insert(1, 1);
	assert.true(lhm.lookup(1) === 1);
	assert.true(lhm.lookup(2) === undefined);
});

test(`It should support looking up values with value two inserted.`, async (assert) => {
	let lhm = new LinkedHashMap<number>();
	lhm.insert(2, 2);
	assert.true(lhm.lookup(1) === undefined);
	assert.true(lhm.lookup(2) === 2);
});

test(`It should support looking up values with both values inserted.`, async (assert) => {
	let lhm = new LinkedHashMap<number>();
	lhm.insert(1, 1);
	lhm.insert(2, 2);
	assert.true(lhm.lookup(1) === 1);
	assert.true(lhm.lookup(2) === 2);
});

test(`It should support removing values with no values inserted.`, async (assert) => {
	let lhm = new LinkedHashMap<number>();
	assert.true(lhm.remove(1) === false);
	assert.true(lhm.remove(2) === false);
});

test(`It should support removing values with value one inserted.`, async (assert) => {
	let lhm = new LinkedHashMap<number>();
	lhm.insert(1, 1);
	assert.true(lhm.remove(1) === true);
	assert.true(lhm.remove(2) === false);
});

test(`It should support removing values with value two inserted.`, async (assert) => {
	let lhm = new LinkedHashMap<number>();
	lhm.insert(2, 2);
	assert.true(lhm.remove(1) === false);
	assert.true(lhm.remove(2) === true);
});

test(`It should support removing values with both values inserted.`, async (assert) => {
	let lhm = new LinkedHashMap<number>();
	lhm.insert(1, 1);
	lhm.insert(2, 2);
	assert.true(lhm.remove(1) === true);
	assert.true(lhm.remove(2) === true);
});

test(`It should support vacating.`, async (assert) => {
	let lhm = new LinkedHashMap<number>();
	lhm.insert(1, 1);
	lhm.insert(2, 2);
	lhm.vacate();
	let observed = Array.from(lhm).map((entry) => entry.value);
	let expected = [] as Array<number>;
	assert.array.equals(observed, expected);
});
