"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const wtf = require("@joelek/wtf");
const parser_1 = require("./parser");
wtf.test(`It should parse unsigned 1-byte big endian properly.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let parser = new parser_1.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
    let observed = parser.unsigned(1, "big");
    let expected = 0x01;
    assert.equals(observed, expected);
}));
wtf.test(`It should parse unsigned 2-byte big endian properly.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let parser = new parser_1.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
    let observed = parser.unsigned(2, "big");
    let expected = 0x0102;
    assert.equals(observed, expected);
}));
wtf.test(`It should parse unsigned 3-byte big endian properly.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let parser = new parser_1.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
    let observed = parser.unsigned(3, "big");
    let expected = 0x010203;
    assert.equals(observed, expected);
}));
wtf.test(`It should parse unsigned 4-byte big endian properly.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let parser = new parser_1.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
    let observed = parser.unsigned(4, "big");
    let expected = 0x01020304;
    assert.equals(observed, expected);
}));
wtf.test(`It should parse unsigned 5-byte big endian properly.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let parser = new parser_1.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
    let observed = parser.unsigned(5, "big");
    let expected = 0x0102030405;
    assert.equals(observed, expected);
}));
wtf.test(`It should parse unsigned 6-byte big endian properly.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let parser = new parser_1.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
    let observed = parser.unsigned(6, "big");
    let expected = 0x010203040506;
    assert.equals(observed, expected);
}));
wtf.test(`It should parse unsigned 1-byte little endian properly.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let parser = new parser_1.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
    let observed = parser.unsigned(1, "little");
    let expected = 0x01;
    assert.equals(observed, expected);
}));
wtf.test(`It should parse unsigned 2-byte little endian properly.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let parser = new parser_1.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
    let observed = parser.unsigned(2, "little");
    let expected = 0x0201;
    assert.equals(observed, expected);
}));
wtf.test(`It should parse unsigned 3-byte little endian properly.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let parser = new parser_1.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
    let observed = parser.unsigned(3, "little");
    let expected = 0x030201;
    assert.equals(observed, expected);
}));
wtf.test(`It should parse unsigned 4-byte little endian properly.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let parser = new parser_1.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
    let observed = parser.unsigned(4, "little");
    let expected = 0x04030201;
    assert.equals(observed, expected);
}));
wtf.test(`It should parse unsigned 5-byte little endian properly.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let parser = new parser_1.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
    let observed = parser.unsigned(5, "little");
    let expected = 0x0504030201;
    assert.equals(observed, expected);
}));
wtf.test(`It should parse unsigned 6-byte little endian properly.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let parser = new parser_1.Parser(Uint8Array.of(1, 2, 3, 4, 5, 6));
    let observed = parser.unsigned(6, "little");
    let expected = 0x060504030201;
    assert.equals(observed, expected);
}));
