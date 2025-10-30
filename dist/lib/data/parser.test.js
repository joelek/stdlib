"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wtf = require("@joelek/wtf");
const parser_1 = require("./parser");
wtf.test(`It should parse unsigned 1-byte big endian properly.`, async (assert) => {
    let parser = new parser_1.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
    let observed = parser.unsigned(1, "big");
    let expected = 0x01;
    assert.equals(observed, expected);
});
wtf.test(`It should parse unsigned 2-byte big endian properly.`, async (assert) => {
    let parser = new parser_1.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
    let observed = parser.unsigned(2, "big");
    let expected = 0x0102;
    assert.equals(observed, expected);
});
wtf.test(`It should parse unsigned 3-byte big endian properly.`, async (assert) => {
    let parser = new parser_1.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
    let observed = parser.unsigned(3, "big");
    let expected = 0x010203;
    assert.equals(observed, expected);
});
wtf.test(`It should parse unsigned 4-byte big endian properly.`, async (assert) => {
    let parser = new parser_1.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
    let observed = parser.unsigned(4, "big");
    let expected = 0x01020304;
    assert.equals(observed, expected);
});
wtf.test(`It should parse unsigned 5-byte big endian properly.`, async (assert) => {
    let parser = new parser_1.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
    let observed = parser.unsigned(5, "big");
    let expected = 0x0102030405;
    assert.equals(observed, expected);
});
wtf.test(`It should parse unsigned 6-byte big endian properly.`, async (assert) => {
    let parser = new parser_1.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
    let observed = parser.unsigned(6, "big");
    let expected = 0x010203040506;
    assert.equals(observed, expected);
});
wtf.test(`It should parse unsigned 1-byte little endian properly.`, async (assert) => {
    let parser = new parser_1.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
    let observed = parser.unsigned(1, "little");
    let expected = 0x01;
    assert.equals(observed, expected);
});
wtf.test(`It should parse unsigned 2-byte little endian properly.`, async (assert) => {
    let parser = new parser_1.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
    let observed = parser.unsigned(2, "little");
    let expected = 0x0201;
    assert.equals(observed, expected);
});
wtf.test(`It should parse unsigned 3-byte little endian properly.`, async (assert) => {
    let parser = new parser_1.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
    let observed = parser.unsigned(3, "little");
    let expected = 0x030201;
    assert.equals(observed, expected);
});
wtf.test(`It should parse unsigned 4-byte little endian properly.`, async (assert) => {
    let parser = new parser_1.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
    let observed = parser.unsigned(4, "little");
    let expected = 0x04030201;
    assert.equals(observed, expected);
});
wtf.test(`It should parse unsigned 5-byte little endian properly.`, async (assert) => {
    let parser = new parser_1.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
    let observed = parser.unsigned(5, "little");
    let expected = 0x0504030201;
    assert.equals(observed, expected);
});
wtf.test(`It should parse unsigned 6-byte little endian properly.`, async (assert) => {
    let parser = new parser_1.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
    let observed = parser.unsigned(6, "little");
    let expected = 0x060504030201;
    assert.equals(observed, expected);
});
wtf.test(`It should parse fixed-width strings properly.`, async (assert) => {
    let parser = new parser_1.Parser(Uint8Array.of(0x30, 0x31, 0x32, 0x33));
    let observed = parser.string("utf-8", 4);
    let expected = "0123";
    assert.equals(observed, expected);
});
wtf.test(`It should parse strings properly.`, async (assert) => {
    let parser = new parser_1.Parser(Uint8Array.of(0x30, 0x31, 0x32, 0x33));
    let observed = parser.string("utf-8");
    let expected = "0123";
    assert.equals(observed, expected);
});
wtf.test(`It should parse zero-terminated strings properly.`, async (assert) => {
    let parser = new parser_1.Parser(Uint8Array.of(0x30, 0x31, 0x32, 0x33, 0x00));
    let observed = parser.string("utf-8");
    let expected = "0123";
    assert.equals(observed, expected);
});
