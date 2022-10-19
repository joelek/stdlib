import * as wtf from "@joelek/wtf";
import { LinkedHashMap } from "./lhm";

wtf.test(`It should support iteration with no values inserted.`, async (assert) => {
	let lhm = new LinkedHashMap<number>();
	let observed = Array.from(lhm).map((entry) => entry.value);
	let expected = [] as Array<number>;
	assert.equals(observed, expected);
});

wtf.test(`It should support iteration with value one inserted.`, async (assert) => {
	let lhm = new LinkedHashMap<number>();
	lhm.insert(1, 1);
	let observed = Array.from(lhm).map((entry) => entry.value);
	let expected = [1] as Array<number>;
	assert.equals(observed, expected);
});

wtf.test(`It should support iteration with value two inserted.`, async (assert) => {
	let lhm = new LinkedHashMap<number>();
	lhm.insert(2, 2);
	let observed = Array.from(lhm).map((entry) => entry.value);
	let expected = [2] as Array<number>;
	assert.equals(observed, expected);
});

wtf.test(`It should support iteration with both values inserted.`, async (assert) => {
	let lhm = new LinkedHashMap<number>();
	lhm.insert(1, 1);
	lhm.insert(2, 2);
	let observed = Array.from(lhm).map((entry) => entry.value);
	let expected = [1, 2] as Array<number>;
	assert.equals(observed, expected);
});

wtf.test(`It should support inserting value one.`, async (assert) => {
	let lhm = new LinkedHashMap<number>();
	assert.equals(lhm.insert(1, 1), true);
	assert.equals(lhm.insert(1, 1), false);
});

wtf.test(`It should support inserting value two.`, async (assert) => {
	let lhm = new LinkedHashMap<number>();
	assert.equals(lhm.insert(2, 2), true);
	assert.equals(lhm.insert(2, 2), false);
});

wtf.test(`It should support inserting both values.`, async (assert) => {
	let lhm = new LinkedHashMap<number>();
	assert.equals(lhm.insert(1, 1), true);
	assert.equals(lhm.insert(2, 2), true);
	assert.equals(lhm.insert(1, 1), false);
	assert.equals(lhm.insert(2, 2), false);
});

wtf.test(`It should support keeping track of the total number of values.`, async (assert) => {
	let lhm = new LinkedHashMap<number>();
	assert.equals(lhm.length(), 0);
	lhm.insert(1, 1);
	assert.equals(lhm.length(), 1);
	lhm.insert(2, 2);
	assert.equals(lhm.length(), 2);
	lhm.remove(1);
	assert.equals(lhm.length(), 1);
	lhm.remove(2);
	assert.equals(lhm.length(), 0);
});

wtf.test(`It should support looking up values with no values inserted.`, async (assert) => {
	let lhm = new LinkedHashMap<number>();
	assert.equals(lhm.lookup(1), undefined);
	assert.equals(lhm.lookup(2), undefined);
});

wtf.test(`It should support looking up values with value one inserted.`, async (assert) => {
	let lhm = new LinkedHashMap<number>();
	lhm.insert(1, 1);
	assert.equals(lhm.lookup(1), 1);
	assert.equals(lhm.lookup(2), undefined);
});

wtf.test(`It should support looking up values with value two inserted.`, async (assert) => {
	let lhm = new LinkedHashMap<number>();
	lhm.insert(2, 2);
	assert.equals(lhm.lookup(1), undefined);
	assert.equals(lhm.lookup(2), 2);
});

wtf.test(`It should support looking up values with both values inserted.`, async (assert) => {
	let lhm = new LinkedHashMap<number>();
	lhm.insert(1, 1);
	lhm.insert(2, 2);
	assert.equals(lhm.lookup(1), 1);
	assert.equals(lhm.lookup(2), 2);
});

wtf.test(`It should support removing values with no values inserted.`, async (assert) => {
	let lhm = new LinkedHashMap<number>();
	assert.equals(lhm.remove(1), false);
	assert.equals(lhm.remove(2), false);
});

wtf.test(`It should support removing values with value one inserted.`, async (assert) => {
	let lhm = new LinkedHashMap<number>();
	lhm.insert(1, 1);
	assert.equals(lhm.remove(1), true);
	assert.equals(lhm.remove(2), false);
});

wtf.test(`It should support removing values with value two inserted.`, async (assert) => {
	let lhm = new LinkedHashMap<number>();
	lhm.insert(2, 2);
	assert.equals(lhm.remove(1), false);
	assert.equals(lhm.remove(2), true);
});

wtf.test(`It should support removing values with both values inserted.`, async (assert) => {
	let lhm = new LinkedHashMap<number>();
	lhm.insert(1, 1);
	lhm.insert(2, 2);
	assert.equals(lhm.remove(1), true);
	assert.equals(lhm.remove(2), true);
});

wtf.test(`It should support vacating.`, async (assert) => {
	let lhm = new LinkedHashMap<number>();
	lhm.insert(1, 1);
	lhm.insert(2, 2);
	lhm.vacate();
	let observed = Array.from(lhm).map((entry) => entry.value);
	let expected = [] as Array<number>;
	assert.equals(observed, expected);
});
