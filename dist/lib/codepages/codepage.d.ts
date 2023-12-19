export declare class CodepageDecodingError extends Error {
    protected byte: number;
    constructor(byte: number, message?: string);
}
export declare class CodepageEncodingError extends Error {
    protected string: string;
    constructor(string: string, message?: string);
}
export declare class Codepage {
    protected string_from_byte: Map<number, string>;
    protected byte_from_string: Map<string, number>;
    constructor(codepoints: Array<number>);
    decode(buffer: Uint8Array): string;
    encode(string: string): Uint8Array;
}
