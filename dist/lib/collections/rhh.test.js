"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wtf = require("@joelek/wtf");
const rhh_1 = require("./rhh");
wtf.test(`It should support iteration with no values inserted.`, async (assert) => {
    let rhh = new rhh_1.RobinHoodHash();
    let observed = Array.from(rhh).map((entry) => entry.value).sort();
    let expected = [];
    assert.equals(observed, expected);
});
wtf.test(`It should support iteration with value one inserted.`, async (assert) => {
    let rhh = new rhh_1.RobinHoodHash();
    rhh.insert(1, 1);
    let observed = Array.from(rhh).map((entry) => entry.value).sort();
    let expected = [1];
    assert.equals(observed, expected);
});
wtf.test(`It should support iteration with value two inserted.`, async (assert) => {
    let rhh = new rhh_1.RobinHoodHash();
    rhh.insert(2, 2);
    let observed = Array.from(rhh).map((entry) => entry.value).sort();
    let expected = [2];
    assert.equals(observed, expected);
});
wtf.test(`It should support iteration with both values inserted.`, async (assert) => {
    let rhh = new rhh_1.RobinHoodHash();
    rhh.insert(1, 1);
    rhh.insert(2, 2);
    let observed = Array.from(rhh).map((entry) => entry.value).sort();
    let expected = [1, 2];
    assert.equals(observed, expected);
});
wtf.test(`It should support inserting value one.`, async (assert) => {
    let rhh = new rhh_1.RobinHoodHash();
    assert.equals(rhh.insert(1, 1), true);
    assert.equals(rhh.insert(1, 1), false);
});
wtf.test(`It should support inserting value two.`, async (assert) => {
    let rhh = new rhh_1.RobinHoodHash();
    assert.equals(rhh.insert(2, 2), true);
    assert.equals(rhh.insert(2, 2), false);
});
wtf.test(`It should support inserting both values.`, async (assert) => {
    let rhh = new rhh_1.RobinHoodHash();
    assert.equals(rhh.insert(1, 1), true);
    assert.equals(rhh.insert(2, 2), true);
    assert.equals(rhh.insert(1, 1), false);
    assert.equals(rhh.insert(2, 2), false);
});
wtf.test(`It should support keeping track of the total number of values.`, async (assert) => {
    let rhh = new rhh_1.RobinHoodHash();
    assert.equals(rhh.length(), 0);
    rhh.insert(1, 1);
    assert.equals(rhh.length(), 1);
    rhh.insert(2, 2);
    assert.equals(rhh.length(), 2);
    rhh.remove(1);
    assert.equals(rhh.length(), 1);
    rhh.remove(2);
    assert.equals(rhh.length(), 0);
});
wtf.test(`It should support looking up values with no values inserted.`, async (assert) => {
    let rhh = new rhh_1.RobinHoodHash();
    assert.equals(rhh.lookup(1), undefined);
    assert.equals(rhh.lookup(2), undefined);
});
wtf.test(`It should support looking up values with value one inserted.`, async (assert) => {
    let rhh = new rhh_1.RobinHoodHash();
    rhh.insert(1, 1);
    assert.equals(rhh.lookup(1), 1);
    assert.equals(rhh.lookup(2), undefined);
});
wtf.test(`It should support looking up values with value two inserted.`, async (assert) => {
    let rhh = new rhh_1.RobinHoodHash();
    rhh.insert(2, 2);
    assert.equals(rhh.lookup(1), undefined);
    assert.equals(rhh.lookup(2), 2);
});
wtf.test(`It should support looking up values with both values inserted.`, async (assert) => {
    let rhh = new rhh_1.RobinHoodHash();
    rhh.insert(1, 1);
    rhh.insert(2, 2);
    assert.equals(rhh.lookup(1), 1);
    assert.equals(rhh.lookup(2), 2);
});
wtf.test(`It should support removing values with no values inserted.`, async (assert) => {
    let rhh = new rhh_1.RobinHoodHash();
    assert.equals(rhh.remove(1), false);
    assert.equals(rhh.remove(2), false);
});
wtf.test(`It should support removing values with value one inserted.`, async (assert) => {
    let rhh = new rhh_1.RobinHoodHash();
    rhh.insert(1, 1);
    assert.equals(rhh.remove(1), true);
    assert.equals(rhh.remove(2), false);
});
wtf.test(`It should support removing values with value two inserted.`, async (assert) => {
    let rhh = new rhh_1.RobinHoodHash();
    rhh.insert(2, 2);
    assert.equals(rhh.remove(1), false);
    assert.equals(rhh.remove(2), true);
});
wtf.test(`It should support removing values with both values inserted.`, async (assert) => {
    let rhh = new rhh_1.RobinHoodHash();
    rhh.insert(1, 1);
    rhh.insert(2, 2);
    assert.equals(rhh.remove(1), true);
    assert.equals(rhh.remove(2), true);
});
wtf.test(`It should support vacating.`, async (assert) => {
    let rhh = new rhh_1.RobinHoodHash();
    rhh.insert(1, 1);
    rhh.insert(2, 2);
    rhh.vacate();
    let observed = Array.from(rhh).map((entry) => entry.value).sort();
    let expected = [];
    assert.equals(observed, expected);
});
