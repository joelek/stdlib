export class CodepageDecodingError extends Error {
	protected byte: number;

	constructor(byte: number, message?: string) {
		super(message);
		this.byte = byte;
	}
};

export class CodepageEncodingError extends Error {
	protected string: string;

	constructor(string: string, message?: string) {
		super(message);
		this.string = string;
	}
};

export class Codepage {
	protected string_from_byte: Map<number, string>;
	protected byte_from_string: Map<string, number>;

	constructor(codepoints: Array<number>) {
		this.string_from_byte = new Map();
		this.byte_from_string = new Map();
		for (let [codepoint_index, codepoint] of codepoints.entries()) {
			let byte = codepoint_index;
			let string = String.fromCodePoint(codepoint);
			this.string_from_byte.set(byte, string);
			this.byte_from_string.set(string, byte);
		}
	}

	decode(buffer: Uint8Array): string {
		let strings = [] as Array<string>;
		for (let [byte_index, byte] of buffer.entries()) {
			let string = this.string_from_byte.get(byte);
			if (string == null) {
				throw new CodepageDecodingError(byte);
			}
			strings.push(string);
		}
		return strings.join("");
	}

	encode(string: string): Uint8Array {
		let bytes = [] as Array<number>;
		for (let [part_index, part] of [...string].entries()) {
			let byte = this.byte_from_string.get(part);
			if (byte == null) {
				throw new CodepageEncodingError(part);
			}
			bytes.push(byte);
		}
		return Uint8Array.from(bytes);
	}
};
