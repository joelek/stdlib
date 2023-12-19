export declare class Chunk {
    private constructor();
    static fromString(string: string, encoding: "base64" | "base64url" | "binary" | "hex" | "utf16be" | "utf-8"): Uint8Array;
    static toString(chunk: Uint8Array, encoding: "base64" | "base64url" | "binary" | "hex" | "utf16be" | "utf-8"): string;
    static equals(one: Uint8Array, two: Uint8Array): boolean;
    static comparePrefixes(one: Uint8Array, two: Uint8Array): number;
    static concat(buffers: Array<Uint8Array>): Uint8Array;
}
