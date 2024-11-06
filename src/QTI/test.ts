import XmlElement from "./xml";

// To run this code, on the server side, you need to install xmldom package
// In this case its a dev dependency, so it should be imported only to test the function
// In production, you can use the native DOMParser API from the browser
if (typeof DOMParser === 'undefined') {
  global.DOMParser = require('xmldom').DOMParser;
}

export { };

const xml = await Bun.file("./ex/xml/imsmanifest.xml").text()

const element = XmlElement.parse(xml);

const json = element.json(2);
const xmlString = element.toXml(true, 2);

Bun.write("./out/imsmanifest.json", json);
Bun.write("./out/imsmanifest.xml", xmlString);