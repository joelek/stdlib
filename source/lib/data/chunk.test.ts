import * as wtf from "@joelek/wtf";
import { Chunk } from "./chunk";

wtf.test(`It should convert chunks to strings "binary" properly.`, async (assert) => {
	let observed = Chunk.toString(Uint8Array.of(0x00, 0x0F, 0xF0, 0xFF), "binary");
	let expected = "\x00\x0F\xF0\xFF";
	assert.equals(observed, expected);
});

wtf.test(`It should convert strings to chunks "binary" properly.`, async (assert) => {
	let observed = Chunk.fromString("\x00\x0F\xF0\xFF", "binary");
	let expected = Uint8Array.of(0x00, 0x0F, 0xF0, 0xFF);
	assert.equals(observed, expected);
});

wtf.test(`It should convert chunks to strings "base64" properly.`, async (assert) => {
	let observed = Chunk.toString(Uint8Array.of(0x00, 0x0F, 0xF0, 0xFF), "base64");
	let expected = "AA/w/w==";
	assert.equals(observed, expected);
});

wtf.test(`It should convert strings to chunks "base64" properly.`, async (assert) => {
	let observed = Chunk.fromString("AA/w/w==", "base64");
	let expected = Uint8Array.of(0x00, 0x0F, 0xF0, 0xFF);
	assert.equals(observed, expected);
});

wtf.test(`It should convert chunks to strings "base64url" properly.`, async (assert) => {
	let observed = Chunk.toString(Uint8Array.of(0x00, 0x0F, 0xF0, 0xFF), "base64url");
	let expected = "AA_w_w";
	assert.equals(observed, expected);
});

wtf.test(`It should convert strings to chunks "base64url" properly.`, async (assert) => {
	let observed = Chunk.fromString("AA_w_w", "base64url");
	let expected = Uint8Array.of(0x00, 0x0F, 0xF0, 0xFF);
	assert.equals(observed, expected);
});

wtf.test(`It should convert chunks to strings "hex" properly.`, async (assert) => {
	let observed = Chunk.toString(Uint8Array.of(0x00, 0x0F, 0xF0, 0xFF), "hex");
	let expected = "000FF0FF";
	assert.equals(observed, expected);
});

wtf.test(`It should convert strings to chunks "hex" properly.`, async (assert) => {
	let observed = Chunk.fromString("000FF0FF", "hex");
	let expected = Uint8Array.of(0x00, 0x0F, 0xF0, 0xFF);
	assert.equals(observed, expected);
});

wtf.test(`It should convert chunks to strings "utf16be" properly ("π").`, async (assert) => {
	let observed = Chunk.toString(Uint8Array.of(0x03, 0xC0), "utf16be");
	let expected = "\u{3C0}";
	assert.equals(observed, expected);
});

wtf.test(`It should convert strings to chunks "utf16be" properly ("π").`, async (assert) => {
	let observed = Chunk.fromString("\u{3C0}", "utf16be");
	let expected = Uint8Array.of(0x03, 0xC0);
	assert.equals(observed, expected);
});

wtf.test(`It should convert chunks to strings "utf16be" properly ("🚀").`, async (assert) => {
	let observed = Chunk.toString(Uint8Array.of(0xD8, 0x3D, 0xDE, 0x80), "utf16be");
	let expected = "\u{1F680}";
	assert.equals(observed, expected);
});

wtf.test(`It should convert strings to chunks "utf16be" properly ("🚀").`, async (assert) => {
	let observed = Chunk.fromString("\u{1F680}", "utf16be");
	let expected = Uint8Array.of(0xD8, 0x3D, 0xDE, 0x80);
	assert.equals(observed, expected);
});

wtf.test(`It should convert chunks to strings "utf-8" properly.`, async (assert) => {
	let observed = Chunk.toString(Uint8Array.of(0xF0, 0x9F, 0x9A, 0x80), "utf-8");
	let expected = "\u{1F680}";
	assert.equals(observed, expected);
});

wtf.test(`It should convert strings to chunks "utf-8" properly.`, async (assert) => {
	let observed = Chunk.fromString("\u{1F680}", "utf-8");
	let expected = Uint8Array.of(0xF0, 0x9F, 0x9A, 0x80);
	assert.equals(observed, expected);
});

wtf.test(`It should determine equality for chunks [0], [0] properly.`, async (assert) => {
	let observed = Chunk.equals(Uint8Array.of(0), Uint8Array.of(0));
	let expected = true;
	assert.equals(observed, expected);
});

wtf.test(`It should determine equality for chunks [0], [1] properly.`, async (assert) => {
	let observed = Chunk.equals(Uint8Array.of(0), Uint8Array.of(1));
	let expected = false;
	assert.equals(observed, expected);
});

wtf.test(`It should compare chunks ([0] < [0,1]).`, async (assert) => {
	let observed = Chunk.comparePrefixes(Uint8Array.of(0), Uint8Array.of(0, 1));
	let expected = -1;
	assert.equals(observed, expected);
});

wtf.test(`It should compare chunks ([1] > [0,1]).`, async (assert) => {
	let observed = Chunk.comparePrefixes(Uint8Array.of(1), Uint8Array.of(0, 1));
	let expected = 1;
	assert.equals(observed, expected);
});

wtf.test(`It should compare chunks ([2] > [0,1]).`, async (assert) => {
	let observed = Chunk.comparePrefixes(Uint8Array.of(2), Uint8Array.of(0, 1));
	let expected = 1;
	assert.equals(observed, expected);
});

wtf.test(`It should compare chunks ([0] < [1,1]).`, async (assert) => {
	let observed = Chunk.comparePrefixes(Uint8Array.of(0), Uint8Array.of(1, 1));
	let expected = -1;
	assert.equals(observed, expected);
});

wtf.test(`It should compare chunks ([1] < [1,1]).`, async (assert) => {
	let observed = Chunk.comparePrefixes(Uint8Array.of(1), Uint8Array.of(1, 1));
	let expected = -1;
	assert.equals(observed, expected);
});

wtf.test(`It should compare chunks ([2] > [1,1]).`, async (assert) => {
	let observed = Chunk.comparePrefixes(Uint8Array.of(2), Uint8Array.of(1, 1));
	let expected = 1;
	assert.equals(observed, expected);
});

wtf.test(`It should compare chunks ([0] < [2,1]).`, async (assert) => {
	let observed = Chunk.comparePrefixes(Uint8Array.of(0), Uint8Array.of(2, 1));
	let expected = -1;
	assert.equals(observed, expected);
});

wtf.test(`It should compare chunks ([1] < [2,1]).`, async (assert) => {
	let observed = Chunk.comparePrefixes(Uint8Array.of(1), Uint8Array.of(2, 1));
	let expected = -1;
	assert.equals(observed, expected);
});

wtf.test(`It should compare chunks ([2] < [2,1]).`, async (assert) => {
	let observed = Chunk.comparePrefixes(Uint8Array.of(2), Uint8Array.of(2, 1));
	let expected = -1;
	assert.equals(observed, expected);
});

wtf.test(`It should compare chunks ([0,0] < [0,1]).`, async (assert) => {
	let observed = Chunk.comparePrefixes(Uint8Array.of(0, 0), Uint8Array.of(0, 1));
	let expected = -1;
	assert.equals(observed, expected);
});

wtf.test(`It should compare chunks ([0,1] = [0,1]).`, async (assert) => {
	let observed = Chunk.comparePrefixes(Uint8Array.of(0, 1), Uint8Array.of(0, 1));
	let expected = 0;
	assert.equals(observed, expected);
});

wtf.test(`It should compare chunks ([0,2] > [0,1]).`, async (assert) => {
	let observed = Chunk.comparePrefixes(Uint8Array.of(0, 2), Uint8Array.of(0, 1));
	let expected = 1;
	assert.equals(observed, expected);
});

wtf.test(`It should compare chunks ([0,0] < [1,1]).`, async (assert) => {
	let observed = Chunk.comparePrefixes(Uint8Array.of(0, 0), Uint8Array.of(1, 1));
	let expected = -1;
	assert.equals(observed, expected);
});

wtf.test(`It should compare chunks ([0,1] < [1,1]).`, async (assert) => {
	let observed = Chunk.comparePrefixes(Uint8Array.of(0, 1), Uint8Array.of(1, 1));
	let expected = -1;
	assert.equals(observed, expected);
});

wtf.test(`It should compare chunks ([0,2] < [1,1]).`, async (assert) => {
	let observed = Chunk.comparePrefixes(Uint8Array.of(0, 2), Uint8Array.of(1, 1));
	let expected = -1;
	assert.equals(observed, expected);
});

wtf.test(`It should compare chunks ([0,0] < [2,1]).`, async (assert) => {
	let observed = Chunk.comparePrefixes(Uint8Array.of(0, 0), Uint8Array.of(2, 1));
	let expected = -1;
	assert.equals(observed, expected);
});

wtf.test(`It should compare chunks ([0,1] < [2,1]).`, async (assert) => {
	let observed = Chunk.comparePrefixes(Uint8Array.of(0, 1), Uint8Array.of(2, 1));
	let expected = -1;
	assert.equals(observed, expected);
});

wtf.test(`It should compare chunks ([0,2] < [2,1]).`, async (assert) => {
	let observed = Chunk.comparePrefixes(Uint8Array.of(0, 2), Uint8Array.of(2, 1));
	let expected = -1;
	assert.equals(observed, expected);
});

wtf.test(`It should compare chunks ([1,0] > [0,1]).`, async (assert) => {
	let observed = Chunk.comparePrefixes(Uint8Array.of(1, 0), Uint8Array.of(0, 1));
	let expected = 1;
	assert.equals(observed, expected);
});

wtf.test(`It should compare chunks ([1,1] > [0,1]).`, async (assert) => {
	let observed = Chunk.comparePrefixes(Uint8Array.of(1, 1), Uint8Array.of(0, 1));
	let expected = 1;
	assert.equals(observed, expected);
});

wtf.test(`It should compare chunks ([1,2] > [0,1]).`, async (assert) => {
	let observed = Chunk.comparePrefixes(Uint8Array.of(1, 2), Uint8Array.of(0, 1));
	let expected = 1;
	assert.equals(observed, expected);
});

wtf.test(`It should compare chunks ([1,0] < [1,1]).`, async (assert) => {
	let observed = Chunk.comparePrefixes(Uint8Array.of(1, 0), Uint8Array.of(1, 1));
	let expected = -1;
	assert.equals(observed, expected);
});

wtf.test(`It should compare chunks ([1,1] = [1,1]).`, async (assert) => {
	let observed = Chunk.comparePrefixes(Uint8Array.of(1, 1), Uint8Array.of(1, 1));
	let expected = 0;
	assert.equals(observed, expected);
});

wtf.test(`It should compare chunks ([1,2] > [1,1]).`, async (assert) => {
	let observed = Chunk.comparePrefixes(Uint8Array.of(1, 2), Uint8Array.of(1, 1));
	let expected = 1;
	assert.equals(observed, expected);
});

wtf.test(`It should compare chunks ([1,0] < [2,1]).`, async (assert) => {
	let observed = Chunk.comparePrefixes(Uint8Array.of(1, 0), Uint8Array.of(2, 1));
	let expected = -1;
	assert.equals(observed, expected);
});

wtf.test(`It should compare chunks ([1,1] < [2,1]).`, async (assert) => {
	let observed = Chunk.comparePrefixes(Uint8Array.of(1, 1), Uint8Array.of(2, 1));
	let expected = -1;
	assert.equals(observed, expected);
});

wtf.test(`It should compare chunks ([1,2] < [2,1]).`, async (assert) => {
	let observed = Chunk.comparePrefixes(Uint8Array.of(1, 2), Uint8Array.of(2, 1));
	let expected = -1;
	assert.equals(observed, expected);
});

wtf.test(`It should compare chunks ([2,0] > [0,1]).`, async (assert) => {
	let observed = Chunk.comparePrefixes(Uint8Array.of(2, 0), Uint8Array.of(0, 1));
	let expected = 1;
	assert.equals(observed, expected);
});

wtf.test(`It should compare chunks ([2,1] > [0,1]).`, async (assert) => {
	let observed = Chunk.comparePrefixes(Uint8Array.of(2, 1), Uint8Array.of(0, 1));
	let expected = 1;
	assert.equals(observed, expected);
});

wtf.test(`It should compare chunks ([2,2] > [0,1]).`, async (assert) => {
	let observed = Chunk.comparePrefixes(Uint8Array.of(2, 2), Uint8Array.of(0, 1));
	let expected = 1;
	assert.equals(observed, expected);
});

wtf.test(`It should compare chunks ([2,0] > [1,1]).`, async (assert) => {
	let observed = Chunk.comparePrefixes(Uint8Array.of(2, 0), Uint8Array.of(1, 1));
	let expected = 1;
	assert.equals(observed, expected);
});

wtf.test(`It should compare chunks ([2,1] > [1,1]).`, async (assert) => {
	let observed = Chunk.comparePrefixes(Uint8Array.of(2, 1), Uint8Array.of(1, 1));
	let expected = 1;
	assert.equals(observed, expected);
});

wtf.test(`It should compare chunks ([2,2] > [1,1]).`, async (assert) => {
	let observed = Chunk.comparePrefixes(Uint8Array.of(2, 2), Uint8Array.of(1, 1));
	let expected = 1;
	assert.equals(observed, expected);
});

wtf.test(`It should compare chunks ([2,0] < [2,1]).`, async (assert) => {
	let observed = Chunk.comparePrefixes(Uint8Array.of(2, 0), Uint8Array.of(2, 1));
	let expected = -1;
	assert.equals(observed, expected);
});

wtf.test(`It should compare chunks ([2,1] = [2,1]).`, async (assert) => {
	let observed = Chunk.comparePrefixes(Uint8Array.of(2, 1), Uint8Array.of(2, 1));
	let expected = 0;
	assert.equals(observed, expected);
});

wtf.test(`It should compare chunks ([2,2] > [2,1]).`, async (assert) => {
	let observed = Chunk.comparePrefixes(Uint8Array.of(2, 2), Uint8Array.of(2, 1));
	let expected = 1;
	assert.equals(observed, expected);
});

wtf.test(`It should compare chunks "bb" > "a" properly.`, async (assert) => {
	let observed = Chunk.comparePrefixes(Chunk.fromString("bb", "binary"), Chunk.fromString("a", "binary"));
	let expected = 1;
	assert.equals(observed, expected);
});

wtf.test(`It should compare chunks "bb" < "c" properly.`, async (assert) => {
	let observed = Chunk.comparePrefixes(Chunk.fromString("bb", "binary"), Chunk.fromString("c", "binary"));
	let expected = -1;
	assert.equals(observed, expected);
});

wtf.test(`It should compare chunks "a" < "bb" properly.`, async (assert) => {
	let observed = Chunk.comparePrefixes(Chunk.fromString("a", "binary"), Chunk.fromString("bb", "binary"));
	let expected = -1;
	assert.equals(observed, expected);
});

wtf.test(`It should compare chunks "c" > "bb" properly.`, async (assert) => {
	let observed = Chunk.comparePrefixes(Chunk.fromString("c", "binary"), Chunk.fromString("bb", "binary"));
	let expected = 1;
	assert.equals(observed, expected);
});

wtf.test(`It should compare chunks "ba" < "bb" properly.`, async (assert) => {
	let observed = Chunk.comparePrefixes(Chunk.fromString("ba", "binary"), Chunk.fromString("bb", "binary"));
	let expected = -1;
	assert.equals(observed, expected);
});

wtf.test(`It should compare chunks "bc" > "bb" properly.`, async (assert) => {
	let observed = Chunk.comparePrefixes(Chunk.fromString("bc", "binary"), Chunk.fromString("bb", "binary"));
	let expected = 1;
	assert.equals(observed, expected);
});

wtf.test(`It should concat chunks properly.`, async (assert) => {
	let observed = Chunk.concat([Uint8Array.of(1, 2), Uint8Array.of(3)]);
	let expected = Uint8Array.of(1, 2, 3);
	assert.equals(observed, expected);
});
