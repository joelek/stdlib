export declare class Parser {
    private buffer;
    private offset;
    constructor(buffer: Uint8Array, offset?: number);
    chunk(length?: number): Uint8Array;
    eof(): boolean;
    signed(length: number, endian?: "big" | "little"): number;
    try<A>(supplier: (parser: Parser) => A): A;
    tryArray<A>(suppliers: Array<(parser: Parser) => A>): A;
    unsigned(length: number, endian?: "big" | "little"): number;
}
