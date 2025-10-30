import * as wtf from "@joelek/wtf";
import * as xml from "./xml";

wtf.test(`XMLName should parse names with name.`, async (assert) => {
	let name = xml.XMLName.parse("name");
	assert.equals(name.name, "name");
});

wtf.test(`XMLName should parse names with name and namespace.`, async (assert) => {
	let name = xml.XMLName.parse("namespace:name");
	assert.equals(name.namespace, "namespace");
	assert.equals(name.name, "name");
});

wtf.test(`XMLName should serialize names with name.`, async (assert) => {
	let name = new xml.XMLName(undefined, "name");
	assert.equals(name.serialize(), "name");
});

wtf.test(`XMLName should serialize names with name and namespace.`, async (assert) => {
	let name = new xml.XMLName("namespace", "name");
	assert.equals(name.serialize(), "namespace:name");
});

wtf.test(`XMLAttribute should parse attributes with double quoted values.`, async (assert) => {
	let attribute = xml.XMLAttribute.parse("key=\"value\"");
	assert.equals(attribute.key.name, "key");
	assert.equals(attribute.value, "value");
});

wtf.test(`XMLAttribute should parse attributes with single quoted values.`, async (assert) => {
	let attribute = xml.XMLAttribute.parse("key=\'value\'");
	assert.equals(attribute.key.name, "key");
	assert.equals(attribute.value, "value");
});

wtf.test(`XMLAttribute should parse attributes with space before the equals sign.`, async (assert) => {
	let attribute = xml.XMLAttribute.parse("key =\"value\"");
	assert.equals(attribute.key.name, "key");
	assert.equals(attribute.value, "value");
});

wtf.test(`XMLAttribute should parse attributes with space after the equals sign.`, async (assert) => {
	let attribute = xml.XMLAttribute.parse("key= \"value\"");
	assert.equals(attribute.key.name, "key");
	assert.equals(attribute.value, "value");
});

wtf.test(`XMLAttribute should serialize attributes with double quotes.`, async (assert) => {
	let attribute = new xml.XMLAttribute("key", "value");
	assert.equals(attribute.serialize(), "key=\"value\"");
});

wtf.test(`XMLOpeningTag should parse open tags without extra whitespace.`, async (assert) => {
	let tag = xml.XMLOpeningTag.parse("<tag>");
	assert.equals(tag.name.name, "tag");
	assert.equals(tag.attributes.length, 0);
	assert.equals(tag.open, true);
});

wtf.test(`XMLOpeningTag should parse open tags with extra whitespace.`, async (assert) => {
	let tag = xml.XMLOpeningTag.parse("<tag >");
	assert.equals(tag.name.name, "tag");
	assert.equals(tag.attributes.length, 0);
	assert.equals(tag.open, true);
});

wtf.test(`XMLOpeningTag should parse open tags with one attribute.`, async (assert) => {
	let tag = xml.XMLOpeningTag.parse("<tag one=\"value1\">");
	assert.equals(tag.name.name, "tag");
	assert.equals(tag.attributes.length, 1);
	assert.equals(tag.attributes[0].key.name, "one");
	assert.equals(tag.attributes[0].value, "value1");
	assert.equals(tag.open, true);
});

wtf.test(`XMLOpeningTag should parse open tags with two attributes.`, async (assert) => {
	let tag = xml.XMLOpeningTag.parse("<tag one=\"value1\" two=\"value2\">");
	assert.equals(tag.name.name, "tag");
	assert.equals(tag.attributes.length, 2);
	assert.equals(tag.attributes[0].key.name, "one");
	assert.equals(tag.attributes[0].value, "value1");
	assert.equals(tag.attributes[1].key.name, "two");
	assert.equals(tag.attributes[1].value, "value2");
	assert.equals(tag.open, true);
});

wtf.test(`XMLOpeningTag should parse closed tags without extra whitespace.`, async (assert) => {
	let tag = xml.XMLOpeningTag.parse("<tag/>");
	assert.equals(tag.name.name, "tag");
	assert.equals(tag.attributes.length, 0);
	assert.equals(tag.open, false);
});

wtf.test(`XMLOpeningTag should parse closed tags with extra whitespace.`, async (assert) => {
	let tag = xml.XMLOpeningTag.parse("<tag />");
	assert.equals(tag.name.name, "tag");
	assert.equals(tag.attributes.length, 0);
	assert.equals(tag.open, false);
});

wtf.test(`XMLOpeningTag should parse closed tags with one attribute.`, async (assert) => {
	let tag = xml.XMLOpeningTag.parse("<tag one=\"value1\"/>");
	assert.equals(tag.name.name, "tag");
	assert.equals(tag.attributes.length, 1);
	assert.equals(tag.attributes[0].key.name, "one");
	assert.equals(tag.attributes[0].value, "value1");
	assert.equals(tag.open, false);
});

wtf.test(`XMLOpeningTag should parse closed tags with two attributes.`, async (assert) => {
	let tag = xml.XMLOpeningTag.parse("<tag one=\"value1\" two=\"value2\"/>");
	assert.equals(tag.name.name, "tag");
	assert.equals(tag.attributes.length, 2);
	assert.equals(tag.attributes[0].key.name, "one");
	assert.equals(tag.attributes[0].value, "value1");
	assert.equals(tag.attributes[1].key.name, "two");
	assert.equals(tag.attributes[1].value, "value2");
	assert.equals(tag.open, false);
});

wtf.test(`XMLOpeningTag should serialize open tags.`, async (assert) => {
	let tag = new xml.XMLOpeningTag("key", true, []);
	assert.equals(tag.serialize(), "<key>");
});

wtf.test(`XMLOpeningTag should serialize open tags with one attribute.`, async (assert) => {
	let tag = new xml.XMLOpeningTag("key", true, [
		new xml.XMLAttribute("one", "value1")
	]);
	assert.equals(tag.serialize(), "<key one=\"value1\">");
});

wtf.test(`XMLOpeningTag should serialize open tags with two attributes.`, async (assert) => {
	let tag = new xml.XMLOpeningTag("key", true, [
		new xml.XMLAttribute("one", "value1"),
		new xml.XMLAttribute("two", "value2")
	]);
	assert.equals(tag.serialize(), "<key one=\"value1\" two=\"value2\">");
});

wtf.test(`XMLOpeningTag should serialize closed tags.`, async (assert) => {
	let tag = new xml.XMLOpeningTag("key", false, []);
	assert.equals(tag.serialize(), "<key/>");
});

wtf.test(`XMLOpeningTag should serialize closed tags with one attribute.`, async (assert) => {
	let tag = new xml.XMLOpeningTag("key", false, [
		new xml.XMLAttribute("one", "value1")
	]);
	assert.equals(tag.serialize(), "<key one=\"value1\"/>");
});

wtf.test(`XMLOpeningTag should serialize closed tags with two attributes.`, async (assert) => {
	let tag = new xml.XMLOpeningTag("key", false, [
		new xml.XMLAttribute("one", "value1"),
		new xml.XMLAttribute("two", "value2")
	]);
	assert.equals(tag.serialize(), "<key one=\"value1\" two=\"value2\"/>");
});

wtf.test(`XMLClosingTag should parse tags without extra whitespace.`, async (assert) => {
	let tag = xml.XMLClosingTag.parse("</tag>");
	assert.equals(tag.name.name, "tag");
});

wtf.test(`XMLClosingTag should parse tags with extra whitespace.`, async (assert) => {
	let tag = xml.XMLClosingTag.parse("</tag >");
	assert.equals(tag.name.name, "tag");
});

wtf.test(`XMLClosingTag should serialize tags.`, async (assert) => {
	let tag = new xml.XMLClosingTag("key");
	assert.equals(tag.serialize(), "</key>");
});

wtf.test(`XMLText should parse nodes containing " ".`, async (assert) => {
	let text = xml.XMLText.parse(" <");
	assert.equals(text.value, " ");
});

wtf.test(`XMLText should parse nodes containing "content".`, async (assert) => {
	let text = xml.XMLText.parse("content<");
	assert.equals(text.value, "content");
});

wtf.test(`XMLText should parse nodes containing "content with spaces".`, async (assert) => {
	let text = xml.XMLText.parse("content with spaces<");
	assert.equals(text.value, "content with spaces");
});

wtf.test(`XMLText should serialize nodes containing " ".`, async (assert) => {
	let text = new xml.XMLText(" ");
	assert.equals(text.serialize(), " ");
});

wtf.test(`XMLText should serialize nodes containing "content".`, async (assert) => {
	let text = new xml.XMLText("content");
	assert.equals(text.serialize(), "content");
});

wtf.test(`XMLText should serialize nodes containing "content with spaces".`, async (assert) => {
	let text = new xml.XMLText("content with spaces");
	assert.equals(text.serialize(), "content with spaces");
});

wtf.test(`XMLElement should parse open nodes without children.`, async (assert) => {
	let element = xml.XMLElement.parse("<parent></parent>");
	assert.equals(element.name.name, "parent");
	assert.equals(element.nodes.length, 0);
});

wtf.test(`XMLElement should parse open nodes with one child element.`, async (assert) => {
	let element = xml.XMLElement.parse("<parent><one/></parent>");
	assert.equals(element.nodes.length, 1);
	assert.equals(element.nodes[0].asElement().name.name, "one");
});

wtf.test(`XMLElement should parse open nodes with two child elements.`, async (assert) => {
	let element = xml.XMLElement.parse("<parent><one/><two/></parent>");
	assert.equals(element.nodes.length, 2);
	assert.equals(element.nodes[0].asElement().name.name, "one");
	assert.equals(element.nodes[1].asElement().name.name, "two");
});

wtf.test(`XMLElement should parse open nodes with one child node.`, async (assert) => {
	let element = xml.XMLElement.parse("<parent> </parent>");
	assert.equals(element.nodes.length, 1);
	assert.equals(element.nodes[0].asText().value, " ");
});

wtf.test(`XMLElement should parse open nodes with two child nodes.`, async (assert) => {
	let element = xml.XMLElement.parse("<parent> <two/></parent>");
	assert.equals(element.nodes.length, 2);
	assert.equals(element.nodes[0].asText().value, " ");
	assert.equals(element.nodes[1].asElement().name.name, "two");
});

wtf.test(`XMLElement should parse open nodes with three child nodes.`, async (assert) => {
	let element = xml.XMLElement.parse("<parent> <two/> </parent>");
	assert.equals(element.nodes.length, 3);
	assert.equals(element.nodes[0].asText().value, " ");
	assert.equals(element.nodes[1].asElement().name.name, "two");
	assert.equals(element.nodes[2].asText().value, " ");
});

wtf.test(`XMLElement should parse closed nodes.`, async (assert) => {
	let element = xml.XMLElement.parse("<parent/>");
	assert.equals(element.name.name, "parent");
	assert.equals(element.nodes.length, 0);
});

wtf.test(`XMLElement should serialize open nodes without children.`, async (assert) => {
	let element = new xml.XMLElement("parent", [], []);
	assert.equals(element.serialize(), "<parent/>");
});

wtf.test(`XMLElement should serialize open nodes with one child element.`, async (assert) => {
	let element = new xml.XMLElement("parent", [], [
		new xml.XMLElement("one", [], [])
	]);
	assert.equals(element.serialize(), "<parent><one/></parent>");
});

wtf.test(`XMLElement should serialize open nodes with two child elements.`, async (assert) => {
	let element = new xml.XMLElement("parent", [], [
		new xml.XMLElement("one", [], []),
		new xml.XMLElement("two", [], [])
	]);
	assert.equals(element.serialize(), "<parent><one/><two/></parent>");
});

wtf.test(`XMLElement should serialize open nodes with one child node.`, async (assert) => {
	let element = new xml.XMLElement("parent", [], [
		new xml.XMLText(" ")
	]);
	assert.equals(element.serialize(), "<parent> </parent>");
});

wtf.test(`XMLElement should serialize open nodes with two child nodes.`, async (assert) => {
	let element = new xml.XMLElement("parent", [], [
		new xml.XMLText(" "),
		new xml.XMLElement("two", [], [])
	]);
	assert.equals(element.serialize(), "<parent> <two/></parent>");
});

wtf.test(`XMLElement should serialize open nodes with three child nodes.`, async (assert) => {
	let element = new xml.XMLElement("parent", [], [
		new xml.XMLText(" "),
		new xml.XMLElement("two", [], []),
		new xml.XMLText(" ")
	]);
	assert.equals(element.serialize(), "<parent> <two/> </parent>");
});

wtf.test(`XMLElement should serialize closed nodes.`, async (assert) => {
	let element = new xml.XMLElement("parent", [], []);
	assert.equals(element.serialize(), "<parent/>");
});

wtf.test(`XMLDeclaration should parse declarations containing version.`, async (assert) => {
	let declaration = xml.XMLDeclaration.parse("<?xml version=\"1.0\"?>");
	assert.equals(declaration.version, "1.0");
	assert.equals(declaration.encoding, undefined);
	assert.equals(declaration.standalone, undefined);
});

wtf.test(`XMLDeclaration should parse declarations containing version and encoding.`, async (assert) => {
	let declaration = xml.XMLDeclaration.parse("<?xml version=\"1.0\" encoding=\"utf-8\"?>");
	assert.equals(declaration.version, "1.0");
	assert.equals(declaration.encoding, "utf-8");
	assert.equals(declaration.standalone, undefined);
});

wtf.test(`XMLDeclaration should parse declarations containing version, encoding and standalone.`, async (assert) => {
	let declaration = xml.XMLDeclaration.parse("<?xml version=\"1.0\" encoding=\"utf-8\" standalone=\"yes\"?>");
	assert.equals(declaration.version, "1.0");
	assert.equals(declaration.encoding, "utf-8");
	assert.equals(declaration.standalone, "yes");
});

wtf.test(`XMLDeclaration should serialize declarations containing version.`, async (assert) => {
	let declaration = new xml.XMLDeclaration("1.0", undefined, undefined);
	assert.equals(declaration.serialize(), "<?xml version=\"1.0\"?>");
});

wtf.test(`XMLDeclaration should serialize declarations containing version and encoding.`, async (assert) => {
	let declaration = new xml.XMLDeclaration("1.0", "utf-8", undefined);
	assert.equals(declaration.serialize(), "<?xml version=\"1.0\" encoding=\"utf-8\"?>");
});

wtf.test(`XMLDeclaration should serialize declarations containing version, encoding and standalone.`, async (assert) => {
	let declaration = new xml.XMLDeclaration("1.0", "utf-8", "yes");
	assert.equals(declaration.serialize(), "<?xml version=\"1.0\" encoding=\"utf-8\" standalone=\"yes\"?>");
});

wtf.test(`XMLDoctype should parse doctypes containing name.`, async (assert) => {
	let doctype = xml.XMLDoctype.parse("<!DOCTYPE thing>");
	assert.equals(doctype.name, "thing");
	assert.equals(doctype.type, undefined);
	assert.equals(doctype.uri, undefined);
});

wtf.test(`XMLDoctype should parse doctypes containing name and uri.`, async (assert) => {
	let doctype = xml.XMLDoctype.parse("<!DOCTYPE thing SYSTEM \"thing.dtd\">");
	assert.equals(doctype.name, "thing");
	assert.equals(doctype.type, undefined);
	assert.equals(doctype.uri, "thing.dtd");
});

wtf.test(`XMLDoctype should parse doctypes containing name, type and uri.`, async (assert) => {
	let doctype = xml.XMLDoctype.parse("<!DOCTYPE thing PUBLIC \"Thing\" \"thing.dtd\">");
	assert.equals(doctype.name, "thing");
	assert.equals(doctype.type, "Thing");
	assert.equals(doctype.uri, "thing.dtd");
});

wtf.test(`XMLDoctype should serialize doctypes containing name.`, async (assert) => {
	let doctype = new xml.XMLDoctype("thing", undefined, undefined);
	assert.equals(doctype.serialize(), "<!DOCTYPE thing>");
});

wtf.test(`XMLDoctype should serialize doctypes containing name and uri.`, async (assert) => {
	let doctype = new xml.XMLDoctype("thing", undefined, "thing.dtd");
	assert.equals(doctype.serialize(), "<!DOCTYPE thing SYSTEM \"thing.dtd\">");
});

wtf.test(`XMLDoctype should serialize doctypes containing name, type and uri.`, async (assert) => {
	let doctype = new xml.XMLDoctype("thing", "Thing", "thing.dtd");
	assert.equals(doctype.serialize(), "<!DOCTYPE thing PUBLIC \"Thing\" \"thing.dtd\">");
});

wtf.test(`XMLDocument should parse documents containing root.`, async (assert) => {
	let document = xml.XMLDocument.parse("<root/>");
	assert.equals(document.declaration === undefined, true);
	assert.equals(document.doctype === undefined, true);
	assert.equals(document.root.name.name === undefined, false);
});

wtf.test(`XMLDocument should parse documents containing declaration and root.`, async (assert) => {
	let document = xml.XMLDocument.parse("<?xml version=\"1.0\"?><root/>");
	assert.equals(document.declaration === undefined, false);
	assert.equals(document.doctype === undefined, true);
	assert.equals(document.root.name.name === undefined, false);
});

wtf.test(`XMLDocument should parse documents containing doctype and root.`, async (assert) => {
	let document = xml.XMLDocument.parse("<!DOCTYPE thing><root/>");
	assert.equals(document.declaration === undefined, true);
	assert.equals(document.doctype === undefined, false);
	assert.equals(document.root.name.name === undefined, false);
});

wtf.test(`XMLDocument should parse documents containing declaration, doctype and root.`, async (assert) => {
	let document = xml.XMLDocument.parse("<?xml version=\"1.0\"?><!DOCTYPE thing><root/>");
	assert.equals(document.declaration === undefined, false);
	assert.equals(document.doctype === undefined, false);
	assert.equals(document.root.name.name === undefined, false);
});

wtf.test(`XMLDocument should serialize documents containing root.`, async (assert) => {
	let document = new xml.XMLDocument(undefined, undefined, new xml.XMLElement("root"));
	assert.equals(document.serialize(), "<root/>");
});

wtf.test(`XMLDocument should serialize documents containing declaration and root.`, async (assert) => {
	let document = new xml.XMLDocument(new xml.XMLDeclaration("1.0", undefined, undefined), undefined, new xml.XMLElement("root"));
	assert.equals(document.serialize(), "<?xml version=\"1.0\"?><root/>");
});

wtf.test(`XMLDocument should serialize documents containing doctype and root.`, async (assert) => {
	let document = new xml.XMLDocument(undefined, new xml.XMLDoctype("thing", undefined, undefined), new xml.XMLElement("root"));
	assert.equals(document.serialize(), "<!DOCTYPE thing><root/>");
});

wtf.test(`XMLDocument should serialize documents containing declaration, doctype and root.`, async (assert) => {
	let document = new xml.XMLDocument(new xml.XMLDeclaration("1.0", undefined, undefined), new xml.XMLDoctype("thing", undefined, undefined), new xml.XMLElement("root"));
	assert.equals(document.serialize(), "<?xml version=\"1.0\"?><!DOCTYPE thing><root/>");
});
