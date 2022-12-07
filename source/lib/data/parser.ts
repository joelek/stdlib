import { IntegerAssert } from "../asserts/integer";
import { Chunk } from "./chunk";

export class Parser {
	private buffer: Uint8Array;
	private offset: number;

	constructor(buffer: Uint8Array, offset?: number) {
		this.buffer = buffer;
		this.offset = offset ?? 0;
	}

	chunk(length?: number): Uint8Array {
		length = length ?? this.buffer.length - this.offset;
		if (this.offset + length > this.buffer.length) {
			throw new Error(`Expected to read at least ${length} bytes!`);
		}
		let buffer = this.buffer.slice(this.offset, this.offset + length);
		this.offset += length;
		return buffer;
	}

	eof(): boolean {
		return this.offset >= this.buffer.length;
	}

	signed(length: number, endian?: "big" | "little"): number {
		let value = this.unsigned(length, endian);
		let bias = 2 ** (length * 8 - 1);
		if (value >= bias) {
			value -= bias + bias;
		}
		return value;
	}

	string(encoding: "base64" | "base64url" | "binary" | "hex" | "utf-8", length?: number): string {
		if (length != null) {
			let chunk = this.chunk(length);
			return Chunk.toString(chunk, encoding);
		}
		let bytes = [] as Array<number>;
		while (!this.eof()) {
			if (this.offset > this.buffer.length) {
				throw new Error(`Expected to read at least 1 byte!`);
			}
			let byte = this.buffer[this.offset];
			this.offset += 1;
			if (byte === 0) {
				break;
			}
			bytes.push(byte);
		}
		let chunk = Uint8Array.from(bytes);
		return Chunk.toString(chunk, encoding);
	}

	try<A>(supplier: (parser: Parser) => A): A {
		let offset = this.offset;
		try {
			return supplier(this);
		} catch (error) {
			this.offset = offset;
			throw error;
		}
	}

	tryArray<A>(suppliers: Array<(parser: Parser) => A>): A {
		let offset = this.offset;
		for (let supplier of suppliers) {
			try {
				return supplier(this);
			} catch (error) {
				this.offset = offset;
			}
		}
		throw new Error(`Expected one supplier to succeed!`);
	}

	unsigned(length: number, endian?: "big" | "little"): number {
		IntegerAssert.between(1, length, 6);
		if (this.offset + length > this.buffer.length) {
			throw new Error(`Expected to read at least ${length} bytes!`);
		}
		if (endian === "little") {
			let value = 0;
			for (let i = length - 1; i >= 0; i--) {
				value *= 256;
				value += this.buffer[this.offset + i];
			}
			this.offset += length;
			return value;
		} else {
			let value = 0;
			for (let i = 0; i < length; i++) {
				value *= 256;
				value += this.buffer[this.offset + i];
			}
			this.offset += length;
			return value;
		}
	}
};
