export declare class Parser {
    private buffer;
    private offset;
    constructor(buffer: Uint8Array, offset?: number);
    chunk(length?: number): Uint8Array;
    eof(): boolean;
    seek(offset: number): void;
    signed(length: number, endian?: "big" | "little"): number;
    string(encoding: "base64" | "base64url" | "binary" | "hex" | "utf-8", length?: number): string;
    try<A>(supplier: (parser: Parser) => A): A;
    tryArray<A>(suppliers: Array<(parser: Parser) => A>): A;
    unsigned(length: number, endian?: "big" | "little"): number;
}
