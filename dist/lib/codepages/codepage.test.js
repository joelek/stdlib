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
const codepage_1 = require("./codepage");
wtf.test(`Codepage should decode buffers using a codepage containing characters defined using surrogate pairs.`, (assert) => {
    var _a;
    let codepage = new codepage_1.Codepage([(_a = "🚀".codePointAt(0)) !== null && _a !== void 0 ? _a : 0]);
    let observed = codepage.decode(Uint8Array.of(0));
    assert.equals(observed, "🚀");
});
wtf.test(`Codepage should encode strings using a codepage containing characters defined using surrogate pairs.`, (assert) => {
    var _a;
    let codepage = new codepage_1.Codepage([(_a = "🚀".codePointAt(0)) !== null && _a !== void 0 ? _a : 0]);
    let observed = codepage.encode("🚀");
    assert.equals(observed, Uint8Array.of(0));
});
wtf.test(`Codepage should throw an error when attempting to decode a buffer containing bytes not defined in the codepage.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let codepage = new codepage_1.Codepage([(_a = "a".codePointAt(0)) !== null && _a !== void 0 ? _a : 0]);
    yield assert.throws(() => {
        codepage.decode(Uint8Array.of(1));
    });
}));
wtf.test(`Codepage should throw an error when attempting to encode a string containing characters not defined in the codepage.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    let codepage = new codepage_1.Codepage([(_b = "a".codePointAt(0)) !== null && _b !== void 0 ? _b : 0]);
    yield assert.throws(() => {
        codepage.encode("b");
    });
}));
