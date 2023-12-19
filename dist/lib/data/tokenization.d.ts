export type Expression = RegExp;
export type Expressions<A extends Expressions<A>> = {
    [B in Extract<keyof A, string>]: Expression;
};
export type Token<A extends string> = {
    row: number;
    col: number;
    type: A;
    value: string;
};
export declare class UnexpectedEndError extends Error {
    constructor();
    toString(): string;
}
export declare class UnexpectedExecutionError extends Error {
    constructor();
    toString(): string;
}
export declare class UnexpectedTokenError extends Error {
    readonly token: Token<string>;
    constructor(token: Token<string>);
    toString(): string;
}
export declare class UnrecognizedTokenError extends Error {
    readonly row: number;
    readonly col: number;
    constructor(row: number, col: number);
    toString(): string;
}
export declare class UnexpectedAnchor extends Error {
    constructor();
    toString(): string;
}
export type Producer<A extends Expressions<A>, B> = (read: Parser<A>["read"], peek: Parser<A>["peek"], skip: Parser<A>["skip"]) => B;
export type Producers<A extends Expressions<A>, B extends any[]> = {
    [C in keyof B]: (parser: Parser<A>) => B[C];
};
export declare class Parser<A extends Expressions<A>> {
    protected expressions: Expressions<A>;
    protected generator: Generator<Token<Extract<keyof A, string>>>;
    protected tokens: Array<Token<Extract<keyof A, string>>>;
    protected token_index: number;
    protected filter: Array<Extract<keyof A, string>>;
    protected bound_read: {
        (): Token<Extract<keyof A, string>>;
        <B extends Extract<keyof A, string>[]>(...types: B): Readonly<Token<[...B][number]>>;
    };
    protected bound_peek: {
        (): Token<Extract<keyof A, string>>;
        <B extends Extract<keyof A, string>[]>(...types: B): Readonly<Token<[...B][number]>> | undefined;
    };
    protected bound_skip: {
        (): Token<Extract<keyof A, string>>;
        <B extends Extract<keyof A, string>[]>(...types: B): Readonly<Token<[...B][number]>> | undefined;
    };
    protected getNextToken(): Token<Extract<keyof A, string>> | undefined;
    protected peek(): Token<Extract<keyof A, string>>;
    protected peek<B extends Extract<keyof A, string>[]>(...types: B): Readonly<Token<[...B][number]>> | undefined;
    protected read(): Token<Extract<keyof A, string>>;
    protected read<B extends Extract<keyof A, string>[]>(...types: B): Readonly<Token<[...B][number]>>;
    protected skip(): Token<Extract<keyof A, string>>;
    protected skip<B extends Extract<keyof A, string>[]>(...types: B): Readonly<Token<[...B][number]>> | undefined;
    constructor(expressions: A, generator: Generator<Token<Extract<keyof A, string>>>);
    parse<B>(filter: Array<Extract<keyof A, string>>, producer: Producer<A, B>): B;
    parseFirst<B extends any[]>(...producers: Producers<A, B>): B[number];
    parseLongest<B extends any[]>(...producers: Producers<A, B>): B[number];
}
export declare class Tokenizer<A extends Expressions<A>> {
    protected expressions: A;
    constructor(expressions: A);
    tokens(string: string): Generator<Token<Extract<keyof A, string>>>;
    tokenize(string: string): Parser<A>;
}
