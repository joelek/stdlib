"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xml = exports.XMLDocument = exports.XMLDoctype = exports.XMLDeclaration = exports.XMLElement = exports.XMLText = exports.XMLNode = exports.XMLClosingTag = exports.XMLOpeningTag = exports.XMLAttribute = exports.XMLName = exports.XMLEntity = exports.UnexpectedValueError = void 0;
const tokenization_1 = require("./tokenization");
class UnexpectedValueError extends Error {
    value;
    type;
    constructor(value, type) {
        super();
        this.value = value;
        this.type = type;
    }
    get message() {
        return `Expected value "${this.value}" to have type ${this.type}!`;
    }
}
exports.UnexpectedValueError = UnexpectedValueError;
;
const MATCHERS = {
    "TEXT_NODE": /([^<>]+)(?=[<])/isu,
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
function assertTokenWithType(value, type) {
    let tokens = Array.from(TOKENIZER.tokens(value));
    if (tokens.length !== 1 || tokens[0].type !== type) {
        throw new UnexpectedValueError(value, type);
    }
    return value;
}
;
const TOKENIZER = new tokenization_1.Tokenizer(MATCHERS);
class XMLEntity {
    constructor() { }
}
exports.XMLEntity = XMLEntity;
;
class XMLName extends XMLEntity {
    namespace;
    name;
    constructor(namespace, name) {
        super();
        this.namespace = namespace != null ? assertTokenWithType(namespace, "IDENTIFIER") : undefined;
        this.name = assertTokenWithType(name, "IDENTIFIER");
    }
    serialize() {
        if (this.namespace == null) {
            return `${this.name}`;
        }
        else {
            return `${this.namespace}:${this.name}`;
        }
    }
    static parse(parsable) {
        let parser = typeof parsable === "string" ? TOKENIZER.tokenize(parsable) : parsable;
        return parser.parse([], (read, peek, skip) => {
            let prefix = read("IDENTIFIER").value;
            let suffix = undefined;
            if (peek(":") != null) {
                read(":");
                suffix = read("IDENTIFIER").value;
            }
            if (suffix == null) {
                let namespace = undefined;
                let name = prefix;
                return new XMLName(namespace, name);
            }
            else {
                let namespace = prefix;
                let name = suffix;
                return new XMLName(namespace, name);
            }
        });
    }
}
exports.XMLName = XMLName;
;
class XMLAttribute extends XMLEntity {
    key;
    value;
    constructor(key, value) {
        super();
        this.key = typeof key === "string" ? XMLName.parse(key) : key;
        this.value = assertTokenWithType(`"${value}"`, "STRING_LITERAL").slice(1, -1);
    }
    serialize() {
        return `${this.key.serialize()}="${this.value}"`;
    }
    static parse(parsable) {
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
}
exports.XMLAttribute = XMLAttribute;
;
class XMLOpeningTag extends XMLEntity {
    name;
    open;
    attributes;
    constructor(name, open, attributes) {
        super();
        this.name = typeof name === "string" ? XMLName.parse(name) : name;
        this.open = open;
        this.attributes = attributes ?? [];
    }
    serialize() {
        return `<${this.name.serialize()}${this.attributes.length === 0 ? "" : " " + this.attributes.map((attribute) => attribute.serialize()).join(" ")}${this.open ? "" : "/"}>`;
    }
    static parse(parsable) {
        let parser = typeof parsable === "string" ? TOKENIZER.tokenize(parsable) : parsable;
        return parser.parse([], (read, peek, skip) => {
            read("<");
            let tag = XMLName.parse(parser);
            skip("WS");
            let attributes = [];
            while (peek(">", "/>") == null) {
                let attribute = XMLAttribute.parse(parser);
                attributes.push(attribute);
                skip("WS");
            }
            let open = read(">", "/>").type === ">";
            return new XMLOpeningTag(tag, open, attributes);
        });
    }
}
exports.XMLOpeningTag = XMLOpeningTag;
;
class XMLClosingTag extends XMLEntity {
    name;
    constructor(name) {
        super();
        this.name = typeof name === "string" ? XMLName.parse(name) : name;
    }
    serialize() {
        return `</${this.name.serialize()}>`;
    }
    static parse(parsable) {
        let parser = typeof parsable === "string" ? TOKENIZER.tokenize(parsable) : parsable;
        return parser.parse([], (read, peek, skip) => {
            read("</");
            let tag = XMLName.parse(parser);
            skip("WS");
            read(">");
            return new XMLClosingTag(tag);
        });
    }
}
exports.XMLClosingTag = XMLClosingTag;
;
class XMLNode extends XMLEntity {
    constructor() {
        super();
    }
    asElement() {
        throw new Error(`Expected an XMLElement instance!`);
    }
    isElement() {
        try {
            this.asElement();
            return true;
        }
        catch (error) { }
        return false;
    }
    asText() {
        throw new Error(`Expected an XMLText instance!`);
    }
    isText() {
        try {
            this.asText();
            return true;
        }
        catch (error) { }
        return false;
    }
    static parse(parser) {
        return parser.parseFirst(XMLText.parse, XMLElement.parse);
    }
}
exports.XMLNode = XMLNode;
;
class XMLText extends XMLNode {
    value;
    constructor(value) {
        super();
        this.value = value;
    }
    asText() {
        return this;
    }
    serialize() {
        return `${this.value}`;
    }
    static parse(parsable) {
        let parser = typeof parsable === "string" ? TOKENIZER.tokenize(parsable) : parsable;
        return parser.parse([], (read, peek, skip) => {
            let value = read("TEXT_NODE").value;
            return new XMLText(value);
        });
    }
}
exports.XMLText = XMLText;
;
class XMLElement extends XMLNode {
    name;
    attributes;
    nodes;
    constructor(name, attributes, nodes) {
        super();
        this.name = typeof name === "string" ? XMLName.parse(name) : name;
        this.attributes = attributes ?? [];
        this.nodes = nodes ?? [];
    }
    asElement() {
        return this;
    }
    serialize() {
        if (this.nodes.length === 0) {
            return new XMLOpeningTag(this.name, false, this.attributes).serialize();
        }
        return [
            new XMLOpeningTag(this.name, true, this.attributes).serialize(),
            this.nodes.map((node) => node.serialize()).join(""),
            new XMLClosingTag(this.name).serialize()
        ].join("");
    }
    static parse(parsable) {
        let parser = typeof parsable === "string" ? TOKENIZER.tokenize(parsable) : parsable;
        return parser.parse([], (read, peek, skip) => {
            let { name, attributes, open } = XMLOpeningTag.parse(parser);
            let nodes = [];
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
}
exports.XMLElement = XMLElement;
;
class XMLDeclaration extends XMLEntity {
    version;
    encoding;
    standalone;
    constructor(version, encoding, standalone) {
        super();
        this.version = assertTokenWithType(`"${version}"`, "STRING_LITERAL").slice(1, -1);
        this.encoding = encoding != null ? assertTokenWithType(`"${encoding}"`, "STRING_LITERAL").slice(1, -1) : undefined;
        this.standalone = standalone != null ? assertTokenWithType(`"${standalone}"`, "STRING_LITERAL").slice(1, -1) : undefined;
    }
    serialize() {
        if (this.encoding != null) {
            if (this.standalone != null) {
                return `<?xml version="${this.version}" encoding="${this.encoding}" standalone="${this.standalone}"?>`;
            }
            else {
                return `<?xml version="${this.version}" encoding="${this.encoding}"?>`;
            }
        }
        else {
            return `<?xml version="${this.version}"?>`;
        }
    }
    static parse(parsable) {
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
            read("=");
            skip("WS");
            let version = read("STRING_LITERAL").value.slice(1, -1);
            let encoding;
            let standalone;
            if (peek("WS") != null) {
                read("WS");
                if (read("IDENTIFIER").value !== "encoding") {
                    throw new Error(`Expected to parse an identifier with the value "encoding"!`);
                }
                skip("WS");
                read("=");
                skip("WS");
                encoding = read("STRING_LITERAL").value.slice(1, -1);
                if (peek("WS") != null) {
                    read("WS");
                    if (read("IDENTIFIER").value !== "standalone") {
                        throw new Error(`Expected to parse an identifier with the value "standalone"!`);
                    }
                    skip("WS");
                    read("=");
                    skip("WS");
                    standalone = read("STRING_LITERAL").value.slice(1, -1);
                }
            }
            skip("WS");
            read("?>");
            return new XMLDeclaration(version, encoding, standalone);
        });
    }
}
exports.XMLDeclaration = XMLDeclaration;
;
class XMLDoctype extends XMLEntity {
    name;
    type;
    uri;
    constructor(name, type, uri) {
        super();
        this.name = assertTokenWithType(name, "IDENTIFIER");
        this.type = type != null ? assertTokenWithType(`"${type}"`, "STRING_LITERAL").slice(1, -1) : undefined;
        this.uri = uri != null ? assertTokenWithType(`"${uri}"`, "STRING_LITERAL").slice(1, -1) : undefined;
    }
    serialize() {
        if (this.uri != null) {
            if (this.type != null) {
                return `<!DOCTYPE ${this.name} PUBLIC "${this.type}" "${this.uri}">`;
            }
            else {
                return `<!DOCTYPE ${this.name} SYSTEM "${this.uri}">`;
            }
        }
        else {
            return `<!DOCTYPE ${this.name}>`;
        }
    }
    static parse(parsable) {
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
                }
                else {
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
}
exports.XMLDoctype = XMLDoctype;
;
class XMLDocument extends XMLEntity {
    declaration;
    doctype;
    root;
    constructor(declaration, doctype, root) {
        super();
        this.declaration = declaration;
        this.doctype = doctype;
        this.root = root;
    }
    serialize() {
        let parts = [];
        if (this.declaration != null) {
            parts.push(this.declaration.serialize());
        }
        if (this.doctype != null) {
            parts.push(this.doctype.serialize());
        }
        parts.push(this.root.serialize());
        return parts.join("");
    }
    static parse(parsable) {
        let parser = typeof parsable === "string" ? TOKENIZER.tokenize(parsable) : parsable;
        return parser.parse([], (read, peek, skip) => {
            let declaration = undefined;
            if (peek("<?") != null) {
                declaration = XMLDeclaration.parse(parser);
                skip("WS");
            }
            let doctype = undefined;
            if (peek("<!") != null) {
                doctype = XMLDoctype.parse(parser);
                skip("WS");
            }
            let root = XMLElement.parse(parser);
            skip("WS");
            return new XMLDocument(declaration, doctype, root);
        });
    }
}
exports.XMLDocument = XMLDocument;
;
exports.xml = {
    attribute(...parameters) {
        return new XMLAttribute(...parameters);
    },
    declaration(...parameters) {
        return new XMLDeclaration(...parameters);
    },
    doctype(...parameters) {
        return new XMLDoctype(...parameters);
    },
    document(...parameters) {
        return new XMLDocument(...parameters);
    },
    element(...parameters) {
        return new XMLElement(...parameters);
    },
    name(...parameters) {
        return new XMLName(...parameters);
    },
    text(...parameters) {
        return new XMLText(...parameters);
    }
};
