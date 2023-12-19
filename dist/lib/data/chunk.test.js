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
const chunk_1 = require("./chunk");
wtf.test(`It should convert chunks to strings "binary" properly.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.toString(Uint8Array.of(0x00, 0x0F, 0xF0, 0xFF), "binary");
    let expected = "\x00\x0F\xF0\xFF";
    assert.equals(observed, expected);
}));
wtf.test(`It should convert strings to chunks "binary" properly.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.fromString("\x00\x0F\xF0\xFF", "binary");
    let expected = Uint8Array.of(0x00, 0x0F, 0xF0, 0xFF);
    assert.equals(observed, expected);
}));
wtf.test(`It should convert chunks to strings "base64" properly.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.toString(Uint8Array.of(0x00, 0x0F, 0xF0, 0xFF), "base64");
    let expected = "AA/w/w==";
    assert.equals(observed, expected);
}));
wtf.test(`It should convert strings to chunks "base64" properly.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.fromString("AA/w/w==", "base64");
    let expected = Uint8Array.of(0x00, 0x0F, 0xF0, 0xFF);
    assert.equals(observed, expected);
}));
wtf.test(`It should convert chunks to strings "base64url" properly.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.toString(Uint8Array.of(0x00, 0x0F, 0xF0, 0xFF), "base64url");
    let expected = "AA_w_w";
    assert.equals(observed, expected);
}));
wtf.test(`It should convert strings to chunks "base64url" properly.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.fromString("AA_w_w", "base64url");
    let expected = Uint8Array.of(0x00, 0x0F, 0xF0, 0xFF);
    assert.equals(observed, expected);
}));
wtf.test(`It should convert chunks to strings "hex" properly.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.toString(Uint8Array.of(0x00, 0x0F, 0xF0, 0xFF), "hex");
    let expected = "000FF0FF";
    assert.equals(observed, expected);
}));
wtf.test(`It should convert strings to chunks "hex" properly.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.fromString("000FF0FF", "hex");
    let expected = Uint8Array.of(0x00, 0x0F, 0xF0, 0xFF);
    assert.equals(observed, expected);
}));
wtf.test(`It should convert chunks to strings "utf16be" properly ("π").`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.toString(Uint8Array.of(0x03, 0xC0), "utf16be");
    let expected = "\u{3C0}";
    assert.equals(observed, expected);
}));
wtf.test(`It should convert strings to chunks "utf16be" properly ("π").`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.fromString("\u{3C0}", "utf16be");
    let expected = Uint8Array.of(0x03, 0xC0);
    assert.equals(observed, expected);
}));
wtf.test(`It should convert chunks to strings "utf16be" properly ("🚀").`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.toString(Uint8Array.of(0xD8, 0x3D, 0xDE, 0x80), "utf16be");
    let expected = "\u{1F680}";
    assert.equals(observed, expected);
}));
wtf.test(`It should convert strings to chunks "utf16be" properly ("🚀").`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.fromString("\u{1F680}", "utf16be");
    let expected = Uint8Array.of(0xD8, 0x3D, 0xDE, 0x80);
    assert.equals(observed, expected);
}));
wtf.test(`It should convert chunks to strings "utf-8" properly.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.toString(Uint8Array.of(0xF0, 0x9F, 0x9A, 0x80), "utf-8");
    let expected = "\u{1F680}";
    assert.equals(observed, expected);
}));
wtf.test(`It should convert strings to chunks "utf-8" properly.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.fromString("\u{1F680}", "utf-8");
    let expected = Uint8Array.of(0xF0, 0x9F, 0x9A, 0x80);
    assert.equals(observed, expected);
}));
wtf.test(`It should determine equality for chunks [0], [0] properly.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.equals(Uint8Array.of(0), Uint8Array.of(0));
    let expected = true;
    assert.equals(observed, expected);
}));
wtf.test(`It should determine equality for chunks [0], [1] properly.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.equals(Uint8Array.of(0), Uint8Array.of(1));
    let expected = false;
    assert.equals(observed, expected);
}));
wtf.test(`It should compare chunks ([0] < [0,1]).`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.comparePrefixes(Uint8Array.of(0), Uint8Array.of(0, 1));
    let expected = -1;
    assert.equals(observed, expected);
}));
wtf.test(`It should compare chunks ([1] > [0,1]).`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.comparePrefixes(Uint8Array.of(1), Uint8Array.of(0, 1));
    let expected = 1;
    assert.equals(observed, expected);
}));
wtf.test(`It should compare chunks ([2] > [0,1]).`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.comparePrefixes(Uint8Array.of(2), Uint8Array.of(0, 1));
    let expected = 1;
    assert.equals(observed, expected);
}));
wtf.test(`It should compare chunks ([0] < [1,1]).`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.comparePrefixes(Uint8Array.of(0), Uint8Array.of(1, 1));
    let expected = -1;
    assert.equals(observed, expected);
}));
wtf.test(`It should compare chunks ([1] < [1,1]).`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.comparePrefixes(Uint8Array.of(1), Uint8Array.of(1, 1));
    let expected = -1;
    assert.equals(observed, expected);
}));
wtf.test(`It should compare chunks ([2] > [1,1]).`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.comparePrefixes(Uint8Array.of(2), Uint8Array.of(1, 1));
    let expected = 1;
    assert.equals(observed, expected);
}));
wtf.test(`It should compare chunks ([0] < [2,1]).`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.comparePrefixes(Uint8Array.of(0), Uint8Array.of(2, 1));
    let expected = -1;
    assert.equals(observed, expected);
}));
wtf.test(`It should compare chunks ([1] < [2,1]).`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.comparePrefixes(Uint8Array.of(1), Uint8Array.of(2, 1));
    let expected = -1;
    assert.equals(observed, expected);
}));
wtf.test(`It should compare chunks ([2] < [2,1]).`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.comparePrefixes(Uint8Array.of(2), Uint8Array.of(2, 1));
    let expected = -1;
    assert.equals(observed, expected);
}));
wtf.test(`It should compare chunks ([0,0] < [0,1]).`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.comparePrefixes(Uint8Array.of(0, 0), Uint8Array.of(0, 1));
    let expected = -1;
    assert.equals(observed, expected);
}));
wtf.test(`It should compare chunks ([0,1] = [0,1]).`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.comparePrefixes(Uint8Array.of(0, 1), Uint8Array.of(0, 1));
    let expected = 0;
    assert.equals(observed, expected);
}));
wtf.test(`It should compare chunks ([0,2] > [0,1]).`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.comparePrefixes(Uint8Array.of(0, 2), Uint8Array.of(0, 1));
    let expected = 1;
    assert.equals(observed, expected);
}));
wtf.test(`It should compare chunks ([0,0] < [1,1]).`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.comparePrefixes(Uint8Array.of(0, 0), Uint8Array.of(1, 1));
    let expected = -1;
    assert.equals(observed, expected);
}));
wtf.test(`It should compare chunks ([0,1] < [1,1]).`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.comparePrefixes(Uint8Array.of(0, 1), Uint8Array.of(1, 1));
    let expected = -1;
    assert.equals(observed, expected);
}));
wtf.test(`It should compare chunks ([0,2] < [1,1]).`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.comparePrefixes(Uint8Array.of(0, 2), Uint8Array.of(1, 1));
    let expected = -1;
    assert.equals(observed, expected);
}));
wtf.test(`It should compare chunks ([0,0] < [2,1]).`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.comparePrefixes(Uint8Array.of(0, 0), Uint8Array.of(2, 1));
    let expected = -1;
    assert.equals(observed, expected);
}));
wtf.test(`It should compare chunks ([0,1] < [2,1]).`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.comparePrefixes(Uint8Array.of(0, 1), Uint8Array.of(2, 1));
    let expected = -1;
    assert.equals(observed, expected);
}));
wtf.test(`It should compare chunks ([0,2] < [2,1]).`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.comparePrefixes(Uint8Array.of(0, 2), Uint8Array.of(2, 1));
    let expected = -1;
    assert.equals(observed, expected);
}));
wtf.test(`It should compare chunks ([1,0] > [0,1]).`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.comparePrefixes(Uint8Array.of(1, 0), Uint8Array.of(0, 1));
    let expected = 1;
    assert.equals(observed, expected);
}));
wtf.test(`It should compare chunks ([1,1] > [0,1]).`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.comparePrefixes(Uint8Array.of(1, 1), Uint8Array.of(0, 1));
    let expected = 1;
    assert.equals(observed, expected);
}));
wtf.test(`It should compare chunks ([1,2] > [0,1]).`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.comparePrefixes(Uint8Array.of(1, 2), Uint8Array.of(0, 1));
    let expected = 1;
    assert.equals(observed, expected);
}));
wtf.test(`It should compare chunks ([1,0] < [1,1]).`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.comparePrefixes(Uint8Array.of(1, 0), Uint8Array.of(1, 1));
    let expected = -1;
    assert.equals(observed, expected);
}));
wtf.test(`It should compare chunks ([1,1] = [1,1]).`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.comparePrefixes(Uint8Array.of(1, 1), Uint8Array.of(1, 1));
    let expected = 0;
    assert.equals(observed, expected);
}));
wtf.test(`It should compare chunks ([1,2] > [1,1]).`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.comparePrefixes(Uint8Array.of(1, 2), Uint8Array.of(1, 1));
    let expected = 1;
    assert.equals(observed, expected);
}));
wtf.test(`It should compare chunks ([1,0] < [2,1]).`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.comparePrefixes(Uint8Array.of(1, 0), Uint8Array.of(2, 1));
    let expected = -1;
    assert.equals(observed, expected);
}));
wtf.test(`It should compare chunks ([1,1] < [2,1]).`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.comparePrefixes(Uint8Array.of(1, 1), Uint8Array.of(2, 1));
    let expected = -1;
    assert.equals(observed, expected);
}));
wtf.test(`It should compare chunks ([1,2] < [2,1]).`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.comparePrefixes(Uint8Array.of(1, 2), Uint8Array.of(2, 1));
    let expected = -1;
    assert.equals(observed, expected);
}));
wtf.test(`It should compare chunks ([2,0] > [0,1]).`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.comparePrefixes(Uint8Array.of(2, 0), Uint8Array.of(0, 1));
    let expected = 1;
    assert.equals(observed, expected);
}));
wtf.test(`It should compare chunks ([2,1] > [0,1]).`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.comparePrefixes(Uint8Array.of(2, 1), Uint8Array.of(0, 1));
    let expected = 1;
    assert.equals(observed, expected);
}));
wtf.test(`It should compare chunks ([2,2] > [0,1]).`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.comparePrefixes(Uint8Array.of(2, 2), Uint8Array.of(0, 1));
    let expected = 1;
    assert.equals(observed, expected);
}));
wtf.test(`It should compare chunks ([2,0] > [1,1]).`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.comparePrefixes(Uint8Array.of(2, 0), Uint8Array.of(1, 1));
    let expected = 1;
    assert.equals(observed, expected);
}));
wtf.test(`It should compare chunks ([2,1] > [1,1]).`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.comparePrefixes(Uint8Array.of(2, 1), Uint8Array.of(1, 1));
    let expected = 1;
    assert.equals(observed, expected);
}));
wtf.test(`It should compare chunks ([2,2] > [1,1]).`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.comparePrefixes(Uint8Array.of(2, 2), Uint8Array.of(1, 1));
    let expected = 1;
    assert.equals(observed, expected);
}));
wtf.test(`It should compare chunks ([2,0] < [2,1]).`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.comparePrefixes(Uint8Array.of(2, 0), Uint8Array.of(2, 1));
    let expected = -1;
    assert.equals(observed, expected);
}));
wtf.test(`It should compare chunks ([2,1] = [2,1]).`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.comparePrefixes(Uint8Array.of(2, 1), Uint8Array.of(2, 1));
    let expected = 0;
    assert.equals(observed, expected);
}));
wtf.test(`It should compare chunks ([2,2] > [2,1]).`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.comparePrefixes(Uint8Array.of(2, 2), Uint8Array.of(2, 1));
    let expected = 1;
    assert.equals(observed, expected);
}));
wtf.test(`It should compare chunks "bb" > "a" properly.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.comparePrefixes(chunk_1.Chunk.fromString("bb", "binary"), chunk_1.Chunk.fromString("a", "binary"));
    let expected = 1;
    assert.equals(observed, expected);
}));
wtf.test(`It should compare chunks "bb" < "c" properly.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.comparePrefixes(chunk_1.Chunk.fromString("bb", "binary"), chunk_1.Chunk.fromString("c", "binary"));
    let expected = -1;
    assert.equals(observed, expected);
}));
wtf.test(`It should compare chunks "a" < "bb" properly.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.comparePrefixes(chunk_1.Chunk.fromString("a", "binary"), chunk_1.Chunk.fromString("bb", "binary"));
    let expected = -1;
    assert.equals(observed, expected);
}));
wtf.test(`It should compare chunks "c" > "bb" properly.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.comparePrefixes(chunk_1.Chunk.fromString("c", "binary"), chunk_1.Chunk.fromString("bb", "binary"));
    let expected = 1;
    assert.equals(observed, expected);
}));
wtf.test(`It should compare chunks "ba" < "bb" properly.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.comparePrefixes(chunk_1.Chunk.fromString("ba", "binary"), chunk_1.Chunk.fromString("bb", "binary"));
    let expected = -1;
    assert.equals(observed, expected);
}));
wtf.test(`It should compare chunks "bc" > "bb" properly.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.comparePrefixes(chunk_1.Chunk.fromString("bc", "binary"), chunk_1.Chunk.fromString("bb", "binary"));
    let expected = 1;
    assert.equals(observed, expected);
}));
wtf.test(`It should concat chunks properly.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let observed = chunk_1.Chunk.concat([Uint8Array.of(1, 2), Uint8Array.of(3)]);
    let expected = Uint8Array.of(1, 2, 3);
    assert.equals(observed, expected);
}));
