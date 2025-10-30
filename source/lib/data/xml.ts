import { Tokenizer } from "./tokenization";

export class UnexpectedValueError extends Error {
	readonly value: string;
	readonly type: Type;

	constructor(value: string, type: Type) {
		super();
		this.value = value;
		this.type = type;
	}

	get message(): string {
		return `Expected value "${this.value}" to have type ${this.type}!`;
	}
};

const MATCHERS = {
	"TEXT_NODE": /([^<>]+)(?=[<])/isu, // Text node needs to be placed first since it uses lookahead.
	"WS": /([\t\r\n ]+)/isu,
	"<": /([<])/isu,
	">": /([>])/isu,
	":": /([:])/isu,
	"=": /([=])/isu,
	"<?": /([<][?])/isu,
	"?>": /([?][>])/isu,
	"<!": /([<][!])/isu,
	"!>": /([!][>])/isu,
	"</": /([<][/])/isu,
	"/>": /([/][>])/isu,
	"IDENTIFIER": /([a-z][a-z0-9_-]*)/isu,
	"STRING_LITERAL": /(["][^"]*["])|(['][^']*['])/isu
};

type Type = keyof typeof MATCHERS;

function assertTokenWithType(value: string, type: Type): string {
	let tokens = Array.from(TOKENIZER.tokens(value));
	if (tokens.length !== 1 || tokens[0].type !== type) {
		throw new UnexpectedValueError(value, type);
	}
	return value;
};

const TOKENIZER = new Tokenizer(MATCHERS);

type XMLTokenizer = typeof TOKENIZER;

type XMLParser = ReturnType<XMLTokenizer["tokenize"]>;

export abstract class XMLEntity {
	constructor() {}

	abstract serialize(): string;
};

export class XMLName extends XMLEntity {
	readonly namespace: string | undefined;
	readonly name: string;

	constructor(namespace: string | undefined, name: string) {
		super();
		this.namespace = namespace != null ? assertTokenWithType(namespace, "IDENTIFIER") : undefined;
		this.name = assertTokenWithType(name, "IDENTIFIER");
	}

	serialize(): string {
		if (this.namespace == null) {
			return `${this.name}`;
		} else {
			return `${this.namespace}:${this.name}`;
		}
	}

	static parse(parsable: XMLParser | string): XMLName {
		let parser = typeof parsable === "string" ? TOKENIZER.tokenize(parsable) : parsable;
		return parser.parse([], (read, peek, skip) => {
			let prefix = read("IDENTIFIER").value;
			let suffix: string | undefined = undefined;
			if (peek(":") != null) {
				read(":");
				suffix = read("IDENTIFIER").value;
			}
			if (suffix == null) {
				let namespace = undefined;
				let name = prefix;
				return new XMLName(
					namespace,
					name
				);
			} else {
				let namespace = prefix;
				let name = suffix;
				return new XMLName(
					namespace,
					name
				);
			}
		});
	}
};

export class XMLAttribute extends XMLEntity {
	readonly key: XMLName;
	readonly value: string;

	constructor(key: XMLName | string, value: string) {
		super();
		this.key = typeof key === "string" ? XMLName.parse(key) : key;
		this.value = assertTokenWithType(`"${value}"`, "STRING_LITERAL").slice(1, -1);
	}

	serialize(): string {
		return `${this.key.serialize()}="${this.value}"`;
	}

	static parse(parsable: XMLParser | string): XMLAttribute {
		let parser = typeof parsable === "string" ? TOKENIZER.tokenize(parsable) : parsable;
		return parser.parse([], (read, peek, skip) => {
			let key = XMLName.parse(parser);
			skip("WS");
			read("=");
			skip("WS");
			let value = read("STRING_LITERAL").value.slice(1, -1);
			return new XMLAttribute(key, value);
		});
	}
};

export class XMLOpeningTag extends XMLEntity {
	readonly name: XMLName;
	readonly open: boolean;
	readonly attributes: ReadonlyArray<XMLAttribute>;

	constructor(name: XMLName | string, open: boolean, attributes?: ReadonlyArray<XMLAttribute>) {
		super();
		this.name = typeof name === "string" ? XMLName.parse(name) : name;
		this.open = open;
		this.attributes = attributes ?? [];
	}

	serialize(): string {
		return `<${this.name.serialize()}${this.attributes.length === 0 ? "" : " " + this.attributes.map((attribute) => attribute.serialize()).join(" ")}${this.open ? "" : "/"}>`;
	}

	static parse(parsable: XMLParser | string): XMLOpeningTag {
		let parser = typeof parsable === "string" ? TOKENIZER.tokenize(parsable) : parsable;
		return parser.parse([], (read, peek, skip) => {
			read("<");
			let tag = XMLName.parse(parser);
			skip("WS");
			let attributes: Array<XMLAttribute> = [];
			while (peek(">", "/>") == null) {
				let attribute = XMLAttribute.parse(parser);
				attributes.push(attribute);
				skip("WS");
			}
			let open = read(">", "/>").type === ">";
			return new XMLOpeningTag(tag, open, attributes);
		});
	}
};

export class XMLClosingTag extends XMLEntity {
	readonly name: XMLName;

	constructor(name: XMLName | string) {
		super();
		this.name = typeof name === "string" ? XMLName.parse(name) : name;
	}

	serialize(): string {
		return `</${this.name.serialize()}>`;
	}

	static parse(parsable: XMLParser | string): XMLClosingTag {
		let parser = typeof parsable === "string" ? TOKENIZER.tokenize(parsable) : parsable;
		return parser.parse([], (read, peek, skip) => {
			read("</");
			let tag = XMLName.parse(parser);
			skip("WS");
			read(">");
			return new XMLClosingTag(tag);
		});
	}
};

export abstract class XMLNode extends XMLEntity {
	constructor() {
		super();
	}

	asElement(): XMLElement {
		throw new Error(`Expected an XMLElement instance!`);
	}

	isElement(): this is XMLElement {
		try {
			this.asElement();
			return true;
		} catch (error) {}
		return false;
	}

	asText(): XMLText {
		throw new Error(`Expected an XMLText instance!`);
	}

	isText(): this is XMLText {
		try {
			this.asText();
			return true;
		} catch (error) {}
		return false;
	}

	static parse(parser: XMLParser): XMLNode {
		return parser.parseFirst(
			XMLText.parse,
			XMLElement.parse
		);
	}
};

export class XMLText extends XMLNode {
	readonly value: string;

	constructor(value: string) {
		super();
		this.value = value;
	}

	asText(): XMLText {
		return this;
	}

	serialize(): string {
		return `${this.value}`;
	}

	static parse(parsable: XMLParser | string): XMLText {
		let parser = typeof parsable === "string" ? TOKENIZER.tokenize(parsable) : parsable;
		return parser.parse([], (read, peek, skip) => {
			let value = read("TEXT_NODE").value;
			return new XMLText(value);
		});
	}
};

export class XMLElement extends XMLNode {
	readonly name: XMLName;
	readonly attributes: ReadonlyArray<XMLAttribute>;
	readonly nodes: ReadonlyArray<XMLNode>;

	constructor(name: XMLName | string, attributes?: ReadonlyArray<XMLAttribute>, nodes?: ReadonlyArray<XMLNode>) {
		super();
		this.name = typeof name === "string" ? XMLName.parse(name) : name;
		this.attributes = attributes ?? [];
		this.nodes = nodes ?? [];
	}

	asElement() {
		return this;
	}

	serialize(): string {
		if (this.nodes.length === 0) {
			return new XMLOpeningTag(this.name, false, this.attributes).serialize();
		}
		return [
			new XMLOpeningTag(this.name, true, this.attributes).serialize(),
			this.nodes.map((node) => node.serialize()).join(""),
			new XMLClosingTag(this.name).serialize()
		].join("");
	}

	static parse(parsable: XMLParser | string): XMLElement {
		let parser = typeof parsable === "string" ? TOKENIZER.tokenize(parsable) : parsable;
		return parser.parse([], (read, peek, skip) => {
			let { name, attributes, open } = XMLOpeningTag.parse(parser);
			let nodes: Array<XMLNode> = [];
			if (open) {
				while (peek("</") == null) {
					let node = XMLNode.parse(parser);
					nodes.push(node);
				}
				let tag = XMLClosingTag.parse(parser);
				if (tag.name.namespace !== name.namespace || tag.name.name !== name.name) {
					throw new Error(`Expected to read closing tag for "${name.serialize()}"!`);
				}
			}
			return new XMLElement(name, attributes, nodes);
		});
	}
};

export class XMLDeclaration extends XMLEntity {
	readonly version: string;
	readonly encoding: string | undefined;
	readonly standalone: string | undefined;

	constructor(version: string, encoding: string | undefined, standalone: string | undefined) {
		super();
		this.version = assertTokenWithType(`"${version}"`, "STRING_LITERAL").slice(1, -1);
		this.encoding = encoding != null ? assertTokenWithType(`"${encoding}"`, "STRING_LITERAL").slice(1, -1) : undefined;
		this.standalone = standalone != null ? assertTokenWithType(`"${standalone}"`, "STRING_LITERAL").slice(1, -1) : undefined;
	}

	serialize(): string {
		if (this.encoding != null) {
			if (this.standalone != null) {
				return `<?xml version="${this.version}" encoding="${this.encoding}" standalone="${this.standalone}"?>`;
			} else {
				return `<?xml version="${this.version}" encoding="${this.encoding}"?>`;
			}
		} else {
			return `<?xml version="${this.version}"?>`;
		}
	}

	static parse(parsable: XMLParser | string): XMLDeclaration {
		let parser = typeof parsable === "string" ? TOKENIZER.tokenize(parsable) : parsable;
		return parser.parse([], (read, peek, skip) => {
			read("<?");
			if (read("IDENTIFIER").value !== "xml") {
				throw new Error(`Expected to parse an identifier with the value "xml"!`);
			}
			read("WS");
			if (read("IDENTIFIER").value !== "version") {
				throw new Error(`Expected to parse an identifier with the value "version"!`);
			}
			skip("WS");
			read("=")
			skip("WS");
			let version = read("STRING_LITERAL").value.slice(1, -1);
			let encoding: string | undefined;
			let standalone: string | undefined;
			if (peek("WS") != null) {
				read("WS");
				if (read("IDENTIFIER").value !== "encoding") {
					throw new Error(`Expected to parse an identifier with the value "encoding"!`);
				}
				skip("WS");
				read("=")
				skip("WS");
				encoding = read("STRING_LITERAL").value.slice(1, -1);
				if (peek("WS") != null) {
					read("WS");
					if (read("IDENTIFIER").value !== "standalone") {
						throw new Error(`Expected to parse an identifier with the value "standalone"!`);
					}
					skip("WS");
					read("=")
					skip("WS");
					standalone = read("STRING_LITERAL").value.slice(1, -1);
				}
			}
			skip("WS");
			read("?>");
			return new XMLDeclaration(version, encoding, standalone);
		});
	}
};

export class XMLDoctype extends XMLEntity {
	readonly name: string;
	readonly type: string | undefined;
	readonly uri: string | undefined;

	constructor(name: string, type: string | undefined, uri: string | undefined) {
		super();
		this.name = assertTokenWithType(name, "IDENTIFIER");
		this.type = type != null ? assertTokenWithType(`"${type}"`, "STRING_LITERAL").slice(1, -1) : undefined;
		this.uri = uri != null ? assertTokenWithType(`"${uri}"`, "STRING_LITERAL").slice(1, -1) : undefined;
	}

	serialize(): string {
		if (this.uri != null) {
			if (this.type != null) {
				return `<!DOCTYPE ${this.name} PUBLIC "${this.type}" "${this.uri}">`;
			} else {
				return `<!DOCTYPE ${this.name} SYSTEM "${this.uri}">`;
			}
		} else {
			return `<!DOCTYPE ${this.name}>`;
		}
	}

	static parse(parsable: XMLParser | string): XMLDoctype {
		let parser = typeof parsable === "string" ? TOKENIZER.tokenize(parsable) : parsable;
		return parser.parse([], (read, peek, skip) => {
			read("<!");
			if (read("IDENTIFIER").value !== "DOCTYPE") {
				throw new Error(`Expected to parse an identifier with the value "DOCTYPE"!`);
			}
			read("WS");
			let name = read("IDENTIFIER").value;
			if (peek("WS") != null) {
				read("WS");
				let access = read("IDENTIFIER").value;
				if (!/^SYSTEM|PUBLIC$/su.test(access)) {
					throw new Error(`Expected to parse an identifier with the value "SYSTEM" or "PUBLIC"!`);
				}
				read("WS");
				if (access === "SYSTEM") {
					let uri = read("STRING_LITERAL").value.slice(1, -1);
					read(">");
					return new XMLDoctype(name, undefined, uri);
				} else {
					let type = read("STRING_LITERAL").value.slice(1, -1);
					read("WS");
					let uri = read("STRING_LITERAL").value.slice(1, -1);
					read(">");
					return new XMLDoctype(name, type, uri);
				}
			}
			read(">");
			return new XMLDoctype(name, undefined, undefined);
		});
	}
};

export class XMLDocument extends XMLEntity {
	readonly declaration: XMLDeclaration | undefined;
	readonly doctype: XMLDoctype | undefined;
	readonly root: XMLElement;

	constructor(declaration: XMLDeclaration | undefined, doctype: XMLDoctype | undefined, root: XMLElement) {
		super();
		this.declaration = declaration;
		this.doctype = doctype;
		this.root = root;
	}

	serialize(): string {
		let parts: Array<string> = [];
		if (this.declaration != null) {
			parts.push(this.declaration.serialize());
		}
		if (this.doctype != null) {
			parts.push(this.doctype.serialize());
		}
		parts.push(this.root.serialize());
		return parts.join("");
	}

	static parse(parsable: XMLParser | string): XMLDocument {
		let parser = typeof parsable === "string" ? TOKENIZER.tokenize(parsable) : parsable;
		return parser.parse([], (read, peek, skip) => {
			let declaration: XMLDeclaration | undefined = undefined;
			if (peek("<?") != null) {
				declaration = XMLDeclaration.parse(parser);
				skip("WS");
			}
			let doctype: XMLDoctype | undefined = undefined;
			if (peek("<!") != null) {
				doctype = XMLDoctype.parse(parser);
				skip("WS");
			}
			let root = XMLElement.parse(parser);
			skip("WS");
			return new XMLDocument(declaration, doctype, root);
		});
	}
};

export const xml = {
	attribute(...parameters: ConstructorParameters<typeof XMLAttribute>) {
		return new XMLAttribute(...parameters);
	},
	declaration(...parameters: ConstructorParameters<typeof XMLDeclaration>) {
		return new XMLDeclaration(...parameters);
	},
	doctype(...parameters: ConstructorParameters<typeof XMLDoctype>) {
		return new XMLDoctype(...parameters);
	},
	element(...parameters: ConstructorParameters<typeof XMLElement>) {
		return new XMLElement(...parameters);
	},
	name(...parameters: ConstructorParameters<typeof XMLName>) {
		return new XMLName(...parameters);
	},
	text(...parameters: ConstructorParameters<typeof XMLText>) {
		return new XMLText(...parameters);
	}
};

export function parseDocument(string: string): XMLDocument {
	let parser = TOKENIZER.tokenize(string);
	let document = XMLDocument.parse(parser);
	return document;
};
