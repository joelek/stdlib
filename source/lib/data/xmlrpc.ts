import { Chunk } from "./chunk";
import { xml, XMLElement, XMLNode } from "./xml";

function getText(element: XMLElement): string {
	return element.nodes.map((node) => {
		if (node.isText()) {
			return node.asText().value;
		}
		if (node.isElement()) {
			return getText(node.asElement());
		}
		return "";
	}).join("");
};

function getChildElements(element: XMLElement): Array<XMLElement> {
	return element.nodes.filter((node) => node.isElement()).map((node) => node.asElement());
};

export function createValue(value: any): XMLNode {
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
};

export function parseValue(element: XMLElement): any {
	try {
		return parseBoolean(element);
	} catch {}
	try {
		return parseString(element);
	} catch {}
	try {
		return parseNumber(element);
	} catch {}
	try {
		return parseNull(element);
	} catch {}
	try {
		return parseArray(element);
	} catch {}
	try {
		return parseRecord(element);
	} catch {}
	try {
		return parseBinary(element);
	} catch {}
	try {
		return parseDate(element);
	} catch {}
	console.log("unparsable", element.serialize());
	throw new Error("Expected value to be decodable to an XML-RPC type!");
};

export function createDate(value: Date) {
	return (
		xml.element("dateTime.iso8601", [], [
			xml.text(value.toISOString())
		])
	);
};

export function parseDate(element: XMLElement): Date {
	if (element.name.name !== "dateTime.iso8601") {
		throw new Error();
	}
	return new Date(getText(element));
};

export function createArray(values: Array<any>) {
	return (
		xml.element("array", [], [
			xml.element("data", [], values.map((value) => (
				xml.element("value", [], [
					createValue(value)
				])
			)))
		])
	);
};

export function parseArray(element: XMLElement): Array<any> {
	if (element.name.name !== "array") {
		throw new Error();
	}
	let dataElements = getChildElements(element).filter((element) => element.name.name === "data");
	if (dataElements.length !== 1) {
		throw new Error();
	}
	let dataElement = dataElements[0];
	let valueElements = getChildElements(dataElement).filter((element) => element.name.name === "value");
	let array: Array<any> = [];
	for (let valueElement of valueElements) {
		let valueChildElements = getChildElements(valueElement);
		if (valueChildElements.length !== 1) {
			throw new Error();
		}
		let valueChildElement = valueChildElements[0];
		array.push(parseValue(valueChildElement));
	}
	return array;
};

export function createRecord(values: Record<string, any>) {
	return (
		xml.element("struct", [], Object.entries(values).map(([key, value]) => (
			xml.element("member", [], [
				xml.element("name", [], [
					xml.text(key)
				]),
				xml.element("value", [], [
					createValue(value)
				])
			])
		)))
	);
};

export function parseRecord(element: XMLElement): Record<string, any> {
	if (element.name.name !== "struct") {
		throw new Error();
	}
	let memberElements = getChildElements(element).filter((element) => element.name.name === "member");
	let record: Record<string, any> = {};
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
};

export function createBinary(value: Uint8Array) {
	return (
		xml.element("base64", [], [
			xml.text(Chunk.toString(value, "base64"))
		])
	);
};

export function parseBinary(element: XMLElement): Uint8Array {
	if (element.name.name !== "base64") {
		throw new Error();
	}
	return Chunk.fromString(getText(element), "base64");
};

export function createBoolean(value: boolean) {
	return (
		xml.element("boolean", [], [
			xml.text(value ? "1" : "0")
		])
	);
};

export function parseBoolean(element: XMLElement): boolean {
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
	throw new Error()
};

export function createString(value: string) {
	return (
		xml.element("string", [], [
			xml.text(value)
		])
	);
};

export function parseString(element: XMLElement): string {
	if (element.name.name !== "string") {
		throw new Error();
	}
	let text = getText(element);
	return text;
};

export function createNumber(value: number) {
	if (Number.isInteger(value)) {
		if (-2147483648 <= value && value <= 2147483647) {
			return createInt(value);
		} else {
			return createLong(value);
		}
	} else {
		return createDouble(value);
	}
};

export function parseNumber(element: XMLElement): number {
	try {
		return parseInt(element);
	} catch {}
	try {
		return parseDouble(element);
	} catch {}
	try {
		return parseLong(element);
	} catch {}
	throw new Error("Expected value to be decodable as an XML-RPC type!");
};

export function createDouble(value: number) {
	return (
		xml.element("double", [], [
			xml.text(value.toString())
		])
	);
};

export function parseDouble(element: XMLElement): number {
	if (element.name.name !== "double") {
		throw new Error();
	}
	let text = getText(element);
	return Number.parseFloat(text);
};

export function createInt(value: number) {
	return (
		xml.element("int", [], [
			xml.text(value.toString())
		])
	);
};

export function parseInt(element: XMLElement): number {
	if (element.name.name !== "int" && element.name.name !== "i4") {
		throw new Error();
	}
	let text = getText(element);
	return Number.parseInt(text);
};

export function createLong(value: number) {
	return (
		xml.element("long", [], [
			xml.text(value.toString())
		])
	);
};

export function parseLong(element: XMLElement): number {
	if (element.name.name !== "long" && element.name.name !== "i8") {
		throw new Error();
	}
	let text = getText(element);
	return Number.parseInt(text);
};

export function createNull(value: null) {
	return (
		xml.element("nil", [], [])
	);
};

export function parseNull(element: XMLElement): null {
	if (element.name.name !== "nil") {
		throw new Error();
	}
	return null;
};

export type MethodCall = {
	methodName: string;
	parameters: Array<any>;
};

export function createMethodCall({ methodName, parameters }: MethodCall) {
	return (
		xml.element("methodCall", [], [
			xml.element("methodName", [], [
				xml.text(methodName)
			]),
			xml.element("params", [], parameters.map((parameter) => (
				xml.element("param", [], [
					xml.element("value", [], [
						createValue(parameter)
					])
				])
			)))
		])
	);
};

export function parseMethodCall(element: XMLElement): MethodCall {
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
	let parameters: Array<any> = [];
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
};

export type MethodResponse = {
	parameters: Array<any>;
};

export function createMethodResponse({ parameters }: MethodResponse) {
	return (
		xml.element("methodResponse", [], [
			xml.element("params", [], parameters.map((parameter) => (
				xml.element("param", [], [
					createValue(parameter)
				])
			)))
		])
	);
};

export function parseMethodResponse(element: XMLElement): MethodResponse {
	if (element.name.name !== "methodResponse") {
		throw new Error();
	}
	let paramsElements = getChildElements(element).filter((element) => element.name.name === "params");
	if (paramsElements.length !== 1) {
		throw new Error();
	}
	let paramsElement = paramsElements[0];
	let paramElements = getChildElements(paramsElement).filter((element) => element.name.name === "param");
	let parameters: Array<any> = [];
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
};
