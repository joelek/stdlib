"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMethodResponse = exports.createMethodResponse = exports.parseMethodCall = exports.createMethodCall = exports.parseNull = exports.createNull = exports.parseLong = exports.createLong = exports.parseInt = exports.createInt = exports.parseDouble = exports.createDouble = exports.parseNumber = exports.createNumber = exports.parseString = exports.createString = exports.parseBoolean = exports.createBoolean = exports.parseBinary = exports.createBinary = exports.parseRecord = exports.createRecord = exports.parseArray = exports.createArray = exports.parseDate = exports.createDate = exports.parseValue = exports.createValue = void 0;
const chunk_1 = require("./chunk");
const xml_1 = require("./xml");
function getText(element) {
    return element.nodes.map((node) => {
        if (node.isText()) {
            return node.asText().value;
        }
        if (node.isElement()) {
            return getText(node.asElement());
        }
        return "";
    }).join("");
}
;
function getChildElements(element) {
    return element.nodes.filter((node) => node.isElement()).map((node) => node.asElement());
}
;
function createValue(value) {
    if (typeof value === "boolean") {
        return createBoolean(value);
    }
    if (typeof value === "string") {
        return createString(value);
    }
    if (typeof value === "number") {
        return createNumber(value);
    }
    if (value === null) {
        return createNull(value);
    }
    if (Array.isArray(value)) {
        return createArray(value);
    }
    if (typeof value === "object") {
        return createRecord(value);
    }
    if (value instanceof Uint8Array) {
        return createBinary(value);
    }
    if (value instanceof Date) {
        return createDate(value);
    }
    throw new Error("Expected value to be encodable as an XML-RPC type!");
}
exports.createValue = createValue;
;
function parseValue(element) {
    try {
        return parseBoolean(element);
    }
    catch { }
    try {
        return parseString(element);
    }
    catch { }
    try {
        return parseNumber(element);
    }
    catch { }
    try {
        return parseNull(element);
    }
    catch { }
    try {
        return parseArray(element);
    }
    catch { }
    try {
        return parseRecord(element);
    }
    catch { }
    try {
        return parseBinary(element);
    }
    catch { }
    try {
        return parseDate(element);
    }
    catch { }
    console.log("unparsable", element.serialize());
    throw new Error("Expected value to be decodable to an XML-RPC type!");
}
exports.parseValue = parseValue;
;
function createDate(value) {
    return (xml_1.xml.element("dateTime.iso8601", [], [
        xml_1.xml.text(value.toISOString())
    ]));
}
exports.createDate = createDate;
;
function parseDate(element) {
    if (element.name.name !== "dateTime.iso8601") {
        throw new Error();
    }
    return new Date(getText(element));
}
exports.parseDate = parseDate;
;
function createArray(values) {
    return (xml_1.xml.element("array", [], [
        xml_1.xml.element("data", [], values.map((value) => (xml_1.xml.element("value", [], [
            createValue(value)
        ]))))
    ]));
}
exports.createArray = createArray;
;
function parseArray(element) {
    if (element.name.name !== "array") {
        throw new Error();
    }
    let dataElements = getChildElements(element).filter((element) => element.name.name === "data");
    if (dataElements.length !== 1) {
        throw new Error();
    }
    let dataElement = dataElements[0];
    let valueElements = getChildElements(dataElement).filter((element) => element.name.name === "value");
    let array = [];
    for (let valueElement of valueElements) {
        let valueChildElements = getChildElements(valueElement);
        if (valueChildElements.length !== 1) {
            throw new Error();
        }
        let valueChildElement = valueChildElements[0];
        array.push(parseValue(valueChildElement));
    }
    return array;
}
exports.parseArray = parseArray;
;
function createRecord(values) {
    return (xml_1.xml.element("struct", [], Object.entries(values).map(([key, value]) => (xml_1.xml.element("member", [], [
        xml_1.xml.element("name", [], [
            xml_1.xml.text(key)
        ]),
        xml_1.xml.element("value", [], [
            createValue(value)
        ])
    ])))));
}
exports.createRecord = createRecord;
;
function parseRecord(element) {
    if (element.name.name !== "struct") {
        throw new Error();
    }
    let memberElements = getChildElements(element).filter((element) => element.name.name === "member");
    let record = {};
    for (let memberElement of memberElements) {
        let nameElements = getChildElements(memberElement).filter((element) => element.name.name === "name");
        if (nameElements.length !== 1) {
            throw new Error();
        }
        let nameElement = nameElements[0];
        let valueElements = getChildElements(memberElement).filter((element) => element.name.name === "value");
        if (valueElements.length !== 1) {
            throw new Error();
        }
        let valueElement = valueElements[0];
        let valueChildElements = getChildElements(valueElement);
        if (valueChildElements.length !== 1) {
            throw new Error();
        }
        let valueChildElement = valueChildElements[0];
        record[getText(nameElement)] = parseValue(valueChildElement);
    }
    return record;
}
exports.parseRecord = parseRecord;
;
function createBinary(value) {
    return (xml_1.xml.element("base64", [], [
        xml_1.xml.text(chunk_1.Chunk.toString(value, "base64"))
    ]));
}
exports.createBinary = createBinary;
;
function parseBinary(element) {
    if (element.name.name !== "base64") {
        throw new Error();
    }
    return chunk_1.Chunk.fromString(getText(element), "base64");
}
exports.parseBinary = parseBinary;
;
function createBoolean(value) {
    return (xml_1.xml.element("boolean", [], [
        xml_1.xml.text(value ? "1" : "0")
    ]));
}
exports.createBoolean = createBoolean;
;
function parseBoolean(element) {
    if (element.name.name !== "boolean") {
        throw new Error();
    }
    let text = getText(element);
    if (text === "1") {
        return true;
    }
    if (text === "0") {
        return false;
    }
    throw new Error();
}
exports.parseBoolean = parseBoolean;
;
function createString(value) {
    return (xml_1.xml.element("string", [], [
        xml_1.xml.text(value)
    ]));
}
exports.createString = createString;
;
function parseString(element) {
    if (element.name.name !== "string") {
        throw new Error();
    }
    let text = getText(element);
    return text;
}
exports.parseString = parseString;
;
function createNumber(value) {
    if (Number.isInteger(value)) {
        if (-2147483648 <= value && value <= 2147483647) {
            return createInt(value);
        }
        else {
            return createLong(value);
        }
    }
    else {
        return createDouble(value);
    }
}
exports.createNumber = createNumber;
;
function parseNumber(element) {
    try {
        return parseInt(element);
    }
    catch { }
    try {
        return parseDouble(element);
    }
    catch { }
    try {
        return parseLong(element);
    }
    catch { }
    throw new Error("Expected value to be decodable as an XML-RPC type!");
}
exports.parseNumber = parseNumber;
;
function createDouble(value) {
    return (xml_1.xml.element("double", [], [
        xml_1.xml.text(value.toString())
    ]));
}
exports.createDouble = createDouble;
;
function parseDouble(element) {
    if (element.name.name !== "double") {
        throw new Error();
    }
    let text = getText(element);
    return Number.parseFloat(text);
}
exports.parseDouble = parseDouble;
;
function createInt(value) {
    return (xml_1.xml.element("int", [], [
        xml_1.xml.text(value.toString())
    ]));
}
exports.createInt = createInt;
;
function parseInt(element) {
    if (element.name.name !== "int" && element.name.name !== "i4") {
        throw new Error();
    }
    let text = getText(element);
    return Number.parseInt(text);
}
exports.parseInt = parseInt;
;
function createLong(value) {
    return (xml_1.xml.element("long", [], [
        xml_1.xml.text(value.toString())
    ]));
}
exports.createLong = createLong;
;
function parseLong(element) {
    if (element.name.name !== "long" && element.name.name !== "i8") {
        throw new Error();
    }
    let text = getText(element);
    return Number.parseInt(text);
}
exports.parseLong = parseLong;
;
function createNull(value) {
    return (xml_1.xml.element("nil", [], []));
}
exports.createNull = createNull;
;
function parseNull(element) {
    if (element.name.name !== "nil") {
        throw new Error();
    }
    return null;
}
exports.parseNull = parseNull;
;
function createMethodCall({ methodName, parameters }) {
    return (xml_1.xml.element("methodCall", [], [
        xml_1.xml.element("methodName", [], [
            xml_1.xml.text(methodName)
        ]),
        xml_1.xml.element("params", [], parameters.map((parameter) => (xml_1.xml.element("param", [], [
            xml_1.xml.element("value", [], [
                createValue(parameter)
            ])
        ]))))
    ]));
}
exports.createMethodCall = createMethodCall;
;
function parseMethodCall(element) {
    if (element.name.name !== "methodCall") {
        throw new Error();
    }
    let methodNameElements = getChildElements(element).filter((element) => element.name.name === "methodName");
    if (methodNameElements.length !== 1) {
        throw new Error();
    }
    let methodNameElement = methodNameElements[0];
    let paramsElements = getChildElements(element).filter((element) => element.name.name === "params");
    if (paramsElements.length !== 1) {
        throw new Error();
    }
    let paramsElement = paramsElements[0];
    let paramElements = getChildElements(paramsElement).filter((element) => element.name.name === "param");
    let methodName = getText(methodNameElement);
    let parameters = [];
    for (let paramElement of paramElements) {
        let paramChildElements = getChildElements(paramElement);
        if (paramChildElements.length !== 1) {
            throw new Error();
        }
        let paramChildElement = paramChildElements[0];
        let valueChildElements = getChildElements(paramChildElement);
        if (valueChildElements.length !== 1) {
            throw new Error();
        }
        let valueChildElement = valueChildElements[0];
        parameters.push(parseValue(valueChildElement));
    }
    return {
        methodName,
        parameters
    };
}
exports.parseMethodCall = parseMethodCall;
;
function createMethodResponse({ parameters }) {
    return (xml_1.xml.element("methodResponse", [], [
        xml_1.xml.element("params", [], parameters.map((parameter) => (xml_1.xml.element("param", [], [
            createValue(parameter)
        ]))))
    ]));
}
exports.createMethodResponse = createMethodResponse;
;
function parseMethodResponse(element) {
    if (element.name.name !== "methodResponse") {
        throw new Error();
    }
    let paramsElements = getChildElements(element).filter((element) => element.name.name === "params");
    if (paramsElements.length !== 1) {
        throw new Error();
    }
    let paramsElement = paramsElements[0];
    let paramElements = getChildElements(paramsElement).filter((element) => element.name.name === "param");
    let parameters = [];
    for (let paramElement of paramElements) {
        let paramChildElements = getChildElements(paramElement);
        if (paramChildElements.length !== 1) {
            throw new Error();
        }
        let paramChildElement = paramChildElements[0];
        let valueChildElements = getChildElements(paramChildElement);
        if (valueChildElements.length !== 1) {
            throw new Error();
        }
        let valueChildElement = valueChildElements[0];
        parameters.push(parseValue(valueChildElement));
    }
    return {
        parameters
    };
}
exports.parseMethodResponse = parseMethodResponse;
;
