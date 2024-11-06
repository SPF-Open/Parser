import { XmlElement } from "./helper"
import { describe, it, expect } from "bun:test"

// To run this code, on the server side, you need to install xmldom package
// In this case its a dev dependency, so it should be imported only to test the function
// In production, you can use the native DOMParser API from the browser
if(typeof DOMParser === "undefined") {
  global.DOMParser = require('xmldom').DOMParser;
}

describe("XmlElement", () => {
  it("should parse XML string", () => {
    const xmlString = `
      <root>
        <child1 attr1="value1">content1</child1>
        <child2>content2</child2>
      </root>
    `;
    const element = XmlElement.parse(xmlString);
    expect(element.tag).toBe("root");
    expect(element.children.length).toBe(2);
    expect(element.children[0].tag).toBe("child1");
    expect(element.children[0].attributes.attr1).toBe("value1");
    expect(element.children[0].children[0].content).toBe("content1");
    expect(element.children[1].tag).toBe("child2");
    expect(element.children[1].children[0].content).toBe("content2");
  });

  it("should convert XmlElement instance to XML string", () => {
    const xmlString = `
<root>
  <child1 attr1="value1">
    content1
  </child1>
  <child2>
    content2
  </child2>
</root>
    `;
    const element = XmlElement.parse(xmlString);
    expect(element.toXml(true, 2)).toBe(xmlString.trim());
  });

  it("should convert XmlElement instance to JSON", () => {
    const xmlString = `
      <root>
        <child1 attr1="value1">content1</child1>
        <child2>content2</child2>
      </root>
    `;
    const element = XmlElement.parse(xmlString);
    console.log(element.json())
    expect(JSON.parse(element.json())).toEqual({
      tag: "root",
      content: "",
      attributes: {},
      children: [
        {
          tag: "child1",
          content: "",
          attributes: { attr1: "value1" },
          children: [{
            tag: "",
            content: "content1",
            attributes: {},
            children: [],
          }],
        },
        {
          tag: "child2",
          content: "",
          attributes: {},
          children: [{
            tag: "",
            content: "content2",
            attributes: {},
            children: [],
          }],
        },
      ],
    });
  });
});