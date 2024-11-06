export class XmlElement {
  constructor(
    public tag = "",
    public content = "",
    public attributes: { [key: string]: string } = {},
    public children: XmlElement[] = [],
    public parent: XmlElement | null = null
  ) { }

  // Parses an XML string and converts it to XmlElement instances
  static parse(xmlString: string): XmlElement {
    let parser;
    let xmlDoc;

    parser = new DOMParser();
    xmlDoc = parser.parseFromString(xmlString, "text/xml");

    function parseNode(node: Node, parent: XmlElement | null = null): XmlElement {
      if (node.nodeType === 3) { // Node.TEXT_NODE
        return new XmlElement("", (node.nodeValue || "").trim(), {}, [], parent);
      }

      const elementNode = node as Element;
      const attributes: { [key: string]: string } = {};

      if (elementNode.attributes) {
        for (const attr of Array.from(elementNode.attributes)) {
          attributes[attr.name] = attr.value;
        }
      }

      const element = new XmlElement(elementNode.tagName, "", attributes, [], parent);
      Array.from(node.childNodes).forEach(child => {
        const parsedChild = parseNode(child, element);
        if (parsedChild && (parsedChild.content || parsedChild.children.length > 0)) {
          element.children.push(parsedChild);
        }
      });

      return element;
    }

    return parseNode(xmlDoc.documentElement);
  }

  // Converts the XmlElement instance back to an XML string
  toXml(breakLine = false, indent = 0): string {
    function nodeToXml(element: XmlElement, breakLine: boolean, indentLevel: number): string {
      if (!element.tag) return " ".repeat(indentLevel) + element.content;

      const indentString = " ".repeat(indentLevel); // Indentation for current level
      const attributesString = Object.entries(element.attributes)
        .map(([key, value]) => ` ${key}="${value}"`)
        .join("");

      const openTag = `<${element.tag}${attributesString}>`;
      const closeTag = `</${element.tag}>`;

      // Recursively process children, increasing indentation for child elements
      const childrenXml = element.children
        .map(child => nodeToXml(child, breakLine, indentLevel + indent))  // Increase indent for children
        .join(breakLine ? "\n" : "");

      // Format the output with optional indentation and line breaks
      const formattedXml = `${indentString}${openTag}${breakLine ? "\n" : ""}` +
        `${childrenXml}` +
        (breakLine ? `\n${indentString}` : "") +
        closeTag;

      return formattedXml;
    }

    return nodeToXml(this, breakLine, 0).trim();
  }




  json(space: number = 2): any {
    return JSON.stringify(this, (key, value) => {
      if (key === "parent") return undefined;
      return value;
    }, space);
  }
}