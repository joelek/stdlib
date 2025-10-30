import { Tokenizer } from "./tokenization";
export declare class UnexpectedValueError extends Error {
    readonly value: string;
    readonly type: Type;
    constructor(value: string, type: Type);
    get message(): string;
}
declare const MATCHERS: {
    TEXT_NODE: RegExp;
    WS: RegExp;
    "<": RegExp;
    ">": RegExp;
    ":": RegExp;
    "=": RegExp;
    "<?": RegExp;
    "?>": RegExp;
    "<!": RegExp;
    "!>": RegExp;
    "</": RegExp;
    "/>": RegExp;
    IDENTIFIER: RegExp;
    STRING_LITERAL: RegExp;
};
type Type = keyof typeof MATCHERS;
declare const TOKENIZER: Tokenizer<{
    TEXT_NODE: RegExp;
    WS: RegExp;
    "<": RegExp;
    ">": RegExp;
    ":": RegExp;
    "=": RegExp;
    "<?": RegExp;
    "?>": RegExp;
    "<!": RegExp;
    "!>": RegExp;
    "</": RegExp;
    "/>": RegExp;
    IDENTIFIER: RegExp;
    STRING_LITERAL: RegExp;
}>;
type XMLTokenizer = typeof TOKENIZER;
type XMLParser = ReturnType<XMLTokenizer["tokenize"]>;
export declare abstract class XMLEntity {
    constructor();
    abstract serialize(): string;
}
export declare class XMLName extends XMLEntity {
    readonly namespace: string | undefined;
    readonly name: string;
    constructor(namespace: string | undefined, name: string);
    serialize(): string;
    static parse(parsable: XMLParser | string): XMLName;
}
export declare class XMLAttribute extends XMLEntity {
    readonly key: XMLName;
    readonly value: string;
    constructor(key: XMLName | string, value: string);
    serialize(): string;
    static parse(parsable: XMLParser | string): XMLAttribute;
}
export declare class XMLOpeningTag extends XMLEntity {
    readonly name: XMLName;
    readonly open: boolean;
    readonly attributes: ReadonlyArray<XMLAttribute>;
    constructor(name: XMLName | string, open: boolean, attributes?: ReadonlyArray<XMLAttribute>);
    serialize(): string;
    static parse(parsable: XMLParser | string): XMLOpeningTag;
}
export declare class XMLClosingTag extends XMLEntity {
    readonly name: XMLName;
    constructor(name: XMLName | string);
    serialize(): string;
    static parse(parsable: XMLParser | string): XMLClosingTag;
}
export declare abstract class XMLNode extends XMLEntity {
    constructor();
    asElement(): XMLElement;
    isElement(): this is XMLElement;
    asText(): XMLText;
    isText(): this is XMLText;
    static parse(parser: XMLParser): XMLNode;
}
export declare class XMLText extends XMLNode {
    readonly value: string;
    constructor(value: string);
    asText(): XMLText;
    serialize(): string;
    static parse(parsable: XMLParser | string): XMLText;
}
export declare class XMLElement extends XMLNode {
    readonly name: XMLName;
    readonly attributes: ReadonlyArray<XMLAttribute>;
    readonly nodes: ReadonlyArray<XMLNode>;
    constructor(name: XMLName | string, attributes?: ReadonlyArray<XMLAttribute>, nodes?: ReadonlyArray<XMLNode>);
    asElement(): this;
    serialize(): string;
    static parse(parsable: XMLParser | string): XMLElement;
}
export declare class XMLDeclaration extends XMLEntity {
    readonly version: string;
    readonly encoding: string | undefined;
    readonly standalone: string | undefined;
    constructor(version: string, encoding: string | undefined, standalone: string | undefined);
    serialize(): string;
    static parse(parsable: XMLParser | string): XMLDeclaration;
}
export declare class XMLDoctype extends XMLEntity {
    readonly name: string;
    readonly type: string | undefined;
    readonly uri: string | undefined;
    constructor(name: string, type: string | undefined, uri: string | undefined);
    serialize(): string;
    static parse(parsable: XMLParser | string): XMLDoctype;
}
export declare class XMLDocument extends XMLEntity {
    readonly declaration: XMLDeclaration | undefined;
    readonly doctype: XMLDoctype | undefined;
    readonly root: XMLElement;
    constructor(declaration: XMLDeclaration | undefined, doctype: XMLDoctype | undefined, root: XMLElement);
    serialize(): string;
    static parse(parsable: XMLParser | string): XMLDocument;
}
export declare const xml: {
    attribute(key: string | XMLName, value: string): XMLAttribute;
    declaration(version: string, encoding: string | undefined, standalone: string | undefined): XMLDeclaration;
    doctype(name: string, type: string | undefined, uri: string | undefined): XMLDoctype;
    document(declaration: XMLDeclaration | undefined, doctype: XMLDoctype | undefined, root: XMLElement): XMLDocument;
    element(name: string | XMLName, attributes?: readonly XMLAttribute[] | undefined, nodes?: readonly XMLNode[] | undefined): XMLElement;
    name(namespace: string | undefined, name: string): XMLName;
    text(value: string): XMLText;
};
export {};
