import * as wtf from "@joelek/wtf";
import { Parser, Tokenizer } from "./tokenization";

wtf.test(`Tokenizer should produce tokens until it fails to recognize a token.`, async (assert) => {
	let tokenizer = new Tokenizer({
		"a": /a/
	});
	let generator = tokenizer.tokens("ab");
	assert.equals(generator.next().value, {
		row: 1,
		col: 1,
		type: "a",
		value: "a"
	});
	await assert.throws(() => {
		generator.next();
	});
});

wtf.test(`Tokenizer should produce the longest possible tokens.`, (assert) => {
	let tokenizer = new Tokenizer({
		"a": /a/,
		"aa": /aa/
	});
	let tokens = Array.from(tokenizer.tokens("aa"));
	assert.equals(tokens, [
		{
			row: 1,
			col: 1,
			type: "aa",
			value: "aa"
		}
	]);
});

wtf.test(`Tokenizer should produce tokens with correct row and col values.`, (assert) => {
	let tokenizer = new Tokenizer({
		"a": /a/,
		"WS": /\s/
	});
	let tokens = Array.from(tokenizer.tokens("aa\naa"));
	assert.equals(tokens, [
		{
			row: 1,
			col: 1,
			type: "a",
			value: "a"
		},
		{
			row: 1,
			col: 2,
			type: "a",
			value: "a"
		},
		{
			row: 1,
			col: 3,
			type: "WS",
			value: "\n"
		},
		{
			row: 2,
			col: 1,
			type: "a",
			value: "a"
		},
		{
			row: 2,
			col: 2,
			type: "a",
			value: "a"
		}
	]);
});

wtf.test(`Tokenizer should not accept expressions anchored to the start.`, async (assert) => {
	await assert.throws(() => {
		let tokenizer = new Tokenizer({
			"a": /^a/
		});
	});
});

wtf.test(`Tokenizer should not accept expressions anchored to the end.`, async (assert) => {
	await assert.throws(() => {
		let tokenizer = new Tokenizer({
			"a": /a$/
		});
	});
});

wtf.test(`Parser should not consume tokens when producers throw errors.`, (assert) => {
	function * generator() {
		yield {
			row: 1,
			col: 1,
			type: "a",
			value: "a"
		} as const;
		yield {
			row: 1,
			col: 2,
			type: "a",
			value: "a"
		} as const;
	}
	let parser = new Parser({
		"a": /a/
	}, generator());
	try {
		parser.parse([], (read, peek, skip) => {
			assert.equals(read(), {
				row: 1,
				col: 1,
				type: "a",
				value: "a"
			});
			try {
				parser.parse([], (read, peek, skip) => {
					assert.equals(read(), {
						row: 1,
						col: 2,
						type: "a",
						value: "a"
					});
					throw new Error();
				});
			} catch (error) {}
			assert.equals(read(), {
				row: 1,
				col: 2,
				type: "a",
				value: "a"
			});
			throw new Error();
		});
	} catch (error) {}
	parser.parse([], (read, peek, skip) => {
		assert.equals(read(), {
			row: 1,
			col: 1,
			type: "a",
			value: "a"
		});
	});
});

wtf.test(`Parser should update the token type when the requested type is compatible with the parsed type.`, (assert) => {
	function * generator() {
		yield {
			row: 1,
			col: 1,
			type: "a",
			value: "a"
		} as const;
	}
	let parser = new Parser({
		"a": /a/,
		"b": /b/,
		"a_or_b": /a|b/
	}, generator());
	parser.parse([], (read, peek, skip) => {
		assert.equals(read("a_or_b"), {
			row: 1,
			col: 1,
			type: "a_or_b",
			value: "a"
		});
	});
});

wtf.test(`Parser should support filtering out irrelevant tokens.`, async (assert) => {
	function * generator() {
		yield {
			row: 1,
			col: 1,
			type: "a",
			value: "a"
		} as const;
		yield {
			row: 1,
			col: 1,
			type: "a",
			value: "a"
		} as const;
		yield {
			row: 1,
			col: 2,
			type: "b",
			value: "b"
		} as const;
	}
	let parser = new Parser({
		"a": /a/,
		"b": /b/
	}, generator());
	parser.parse(["a"], (read, peek, skip) => {
		assert.equals(read(), {
			row: 1,
			col: 2,
			type: "b",
			value: "b"
		});
	});
});

wtf.test(`Parser should throw an error when attempting to read a token at the end of the token stream.`, async (assert) => {
	function * generator() {}
	let parser = new Parser({
		"a": /a/
	}, generator());
	await assert.throws(() => {
		parser.parse([], (read, peek, skip) => {
			read();
		});
	});
});

wtf.test(`Parser should not throw an error when attempting to read a token before the end of the token stream.`, async (assert) => {
	function * generator() {
		yield {
			row: 1,
			col: 1,
			type: "a",
			value: "a"
		} as const;
	}
	let parser = new Parser({
		"a": /a/,
		"b": /b/
	}, generator());
	parser.parse([], (read, peek, skip) => {
		assert.equals(read(), {
			row: 1,
			col: 1,
			type: "a",
			value: "a"
		});
	});
});

wtf.test(`Parser should not throw an error when attempting to read a token with a compatible type before the end of the token stream.`, async (assert) => {
	function * generator() {
		yield {
			row: 1,
			col: 1,
			type: "a",
			value: "a"
		} as const;
	}
	let parser = new Parser({
		"a": /a/,
		"b": /b/
	}, generator());
	parser.parse([], (read, peek, skip) => {
		assert.equals(read("a"), {
			row: 1,
			col: 1,
			type: "a",
			value: "a"
		});
	});
});

wtf.test(`Parser should throw an error when attempting to read a token with an incompatible type before the end of the token stream.`, async (assert) => {
	function * generator() {
		yield {
			row: 1,
			col: 1,
			type: "a",
			value: "a"
		} as const;
	}
	let parser = new Parser({
		"a": /a/,
		"b": /b/
	}, generator());
	await assert.throws(() => {
		parser.parse([], (read, peek, skip) => {
			read("b");
		});
	});
});

wtf.test(`Parser should not throw an error when attempting to peek a token at the end of the token stream.`, async (assert) => {
	function * generator() {}
	let parser = new Parser({
		"a": /a/
	}, generator());
	parser.parse([], (read, peek, skip) => {
		assert.equals(peek(), undefined);
	});
});

wtf.test(`Parser should not throw an error when attempting to peek a token before the end of the token stream.`, async (assert) => {
	function * generator() {
		yield {
			row: 1,
			col: 1,
			type: "a",
			value: "a"
		} as const;
	}
	let parser = new Parser({
		"a": /a/,
		"b": /b/
	}, generator());
	parser.parse([], (read, peek, skip) => {
		assert.equals(peek(), {
			row: 1,
			col: 1,
			type: "a",
			value: "a"
		});
	});
});

wtf.test(`Parser should not throw an error when attempting to peek a token with a compatible type before the end of the token stream.`, async (assert) => {
	function * generator() {
		yield {
			row: 1,
			col: 1,
			type: "a",
			value: "a"
		} as const;
	}
	let parser = new Parser({
		"a": /a/,
		"b": /b/
	}, generator());
	parser.parse([], (read, peek, skip) => {
		assert.equals(peek("a"), {
			row: 1,
			col: 1,
			type: "a",
			value: "a"
		});
	});
});

wtf.test(`Parser should not throw an error when attempting to peek a token with an incompatible type before the end of the token stream.`, async (assert) => {
	function * generator() {
		yield {
			row: 1,
			col: 1,
			type: "a",
			value: "a"
		} as const;
	}
	let parser = new Parser({
		"a": /a/,
		"b": /b/
	}, generator());
	parser.parse([], (read, peek, skip) => {
		assert.equals(peek("b"), undefined);
	});
});

wtf.test(`Parser should not throw an error when attempting to skip a token at the end of the token stream.`, async (assert) => {
	function * generator() {}
	let parser = new Parser({
		"a": /a/
	}, generator());
	parser.parse([], (read, peek, skip) => {
		assert.equals(skip(), undefined);
	});
});

wtf.test(`Parser should not throw an error when attempting to skip a token before the end of the token stream.`, async (assert) => {
	function * generator() {
		yield {
			row: 1,
			col: 1,
			type: "a",
			value: "a"
		} as const;
	}
	let parser = new Parser({
		"a": /a/,
		"b": /b/
	}, generator());
	parser.parse([], (read, peek, skip) => {
		assert.equals(skip(), {
			row: 1,
			col: 1,
			type: "a",
			value: "a"
		});
	});
});

wtf.test(`Parser should not throw an error when attempting to skip a token with a compatible type before the end of the token stream.`, async (assert) => {
	function * generator() {
		yield {
			row: 1,
			col: 1,
			type: "a",
			value: "a"
		} as const;
	}
	let parser = new Parser({
		"a": /a/,
		"b": /b/
	}, generator());
	parser.parse([], (read, peek, skip) => {
		assert.equals(skip("a"), undefined);
	});
});

wtf.test(`Parser should not throw an error when attempting to skip a token with an incompatible type before the end of the token stream.`, async (assert) => {
	function * generator() {
		yield {
			row: 1,
			col: 1,
			type: "a",
			value: "a"
		} as const;
	}
	let parser = new Parser({
		"a": /a/,
		"b": /b/
	}, generator());
	parser.parse([], (read, peek, skip) => {
		assert.equals(skip("b"), {
			row: 1,
			col: 1,
			type: "a",
			value: "a"
		});
	});
});
