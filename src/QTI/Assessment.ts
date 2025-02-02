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
  ) { }

  static async fromZip(array: ArrayBuffer) {
    const z = new JSZip();
    const zip = await z.loadAsync(array)
    const manifestFile = zip.filter((path, file) => path.endsWith("imsmanifest.xml"))[0]
    const testFile = zip.filter((path, file) => path.endsWith("test.xml"))[0]

    if (!manifestFile) {
      throw new Error("imsmanifest.xml not found in the zip file")
    }

    if (!testFile) {
      throw new Error("test.xml not found in the zip file")
    }

    const manifestText = await manifestFile.async("text")
    const testText = await testFile.async("text")

    const manifest = XmlElement.parse(manifestText)
    const test = XmlElement.parse(testText)

    Bun.write("./out/test.json", test.json(2));
    Bun.write("./out/manifest.json", manifest.json(2));

    

  }
}

export class Part {

  constructor(
    public title: string,
    public parts: Part[],
    public pages: Page[],
  ) {
  }

  static fromXml(xml: XmlElement) {

  }
}

export class Page {
  
  constructor(
    public identifier: string,
    public title: string,
    public items: Item[],
  ) {
  }

}

export class Item {
  constructor(
    public identifier: string,
    public title: string,
    public tools: Array<string> = [],
    public assets: Record<string, any>[] = [],
    public styles: Record<string, any>[] = [],
  ) { }
}

const blob = await Bun.file("../ex/bff24079__-_qo_1737382536.zip").arrayBuffer()

const ass = Assessment.fromZip(blob)