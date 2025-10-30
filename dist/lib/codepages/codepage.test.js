"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wtf = require("@joelek/wtf");
const codepage_1 = require("./codepage");
wtf.test(`Codepage should decode buffers using a codepage containing characters defined using surrogate pairs.`, (assert) => {
    let codepage = new codepage_1.Codepage(["🚀".codePointAt(0) ?? 0]);
    let observed = codepage.decode(Uint8Array.of(0));
    assert.equals(observed, "🚀");
});
wtf.test(`Codepage should encode strings using a codepage containing characters defined using surrogate pairs.`, (assert) => {
    let codepage = new codepage_1.Codepage(["🚀".codePointAt(0) ?? 0]);
    let observed = codepage.encode("🚀");
    assert.equals(observed, Uint8Array.of(0));
});
wtf.test(`Codepage should throw an error when attempting to decode a buffer containing bytes not defined in the codepage.`, async (assert) => {
    let codepage = new codepage_1.Codepage(["a".codePointAt(0) ?? 0]);
    await assert.throws(() => {
        codepage.decode(Uint8Array.of(1));
    });
});
wtf.test(`Codepage should throw an error when attempting to encode a string containing characters not defined in the codepage.`, async (assert) => {
    let codepage = new codepage_1.Codepage(["a".codePointAt(0) ?? 0]);
    await assert.throws(() => {
        codepage.encode("b");
    });
});
