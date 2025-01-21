import JSZip from "jszip";
import XmlElement from "./xml";

// To run this code, on the server side, you need to install xmldom package
// In this case its a dev dependency, so it should be imported only to test the function
// In production, you can use the native DOMParser API from the browser
if (typeof DOMParser === 'undefined') {
  global.DOMParser = require('xmldom').DOMParser;
}

export { };

// const xml = await Bun.file("./ex/xml/imsmanifest.xml").text()

// const element = XmlElement.parse(xml);

// const json = element.json(2);
// const xmlString = element.toXml(true, 2);

// Bun.write("./out/imsmanifest.json", json);
// Bun.write("./out/imsmanifest.xml", xmlString);

const jsAttrPath = {
  "title": ""
};

export default class Assessment {
  constructor(
    public title: string,
    public identifier: string,
    public questions: string[],
  ) {}

  static async fromZip(array: ArrayBuffer) {
    const z = new JSZip();
    const zip = await z.loadAsync(array)
    const manifestFile = zip.filter((path, file) => path.endsWith("imsmanifest.xml"))[0]
    const testFile = zip.filter((path, file) => path.endsWith("test.xml"))[0]

    if (!manifestFile || !testFile) {
      throw new Error("imsmanifest.xml not found in the zip file")
    }

    const manifestText = await manifestFile.async("text")
    const testText = await testFile.async("text")

    const manifest = XmlElement.parse(manifestText)
    const test = XmlElement.parse(testText)

    console.log(manifest.json(2))
    Bun.write("./out/test.json", test.json(2));
  }
}

const blob = await Bun.file("../ex/bff24079__-_qo_1737382536.zip").arrayBuffer()

const ass = Assessment.fromZip(blob)