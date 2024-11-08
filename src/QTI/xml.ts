export default class XmlElement {
  constructor(
    public tag = '',
    public content = '',
    public attributes: Map<string, string> = new Map(),
    public children: XmlElement[] = [],
    public parent: XmlElement | null = null,
  ) {}

  // Parses an XML string and converts it to XmlElement instances
  static parse(xmlString: string): XmlElement {
    let parser;
    let xmlDoc;

    parser = new DOMParser();
    xmlDoc = parser.parseFromString(xmlString, 'text/xml');

    function parseNode(
      node: Node,
      parent: XmlElement | null = null,
    ): XmlElement {
      // TEXT_NODE === 3
      if (node.nodeType === 3) {
        return new XmlElement(
          '',
          (node.nodeValue || '').trim(),
          new Map(),
          [],
          parent,
        );
      }

      const elementNode = node as Element;
      const attributes = new Map();

      if (elementNode.attributes) {
        for (const attr of Array.from(elementNode.attributes)) {
          attributes.set(attr.name, attr.value);
        }
      }

      const element = new XmlElement(
        elementNode.tagName,
        '',
        attributes,
        [],
        parent,
      );
      Array.from(node.childNodes).forEach((child) => {
        const parsedChild = parseNode(child, element);
        if (
          parsedChild &&
          (parsedChild.content ||
            parsedChild.children.length > 0 ||
            parsedChild.tag)
        ) {
          element.children.push(parsedChild);
        }
      });

      return element;
    }

    return parseNode(xmlDoc.documentElement);
  }

  // Converts the XmlElement instance back to an XML string
  toXml(breakLine = false, indent = 0): string {
    function nodeToXml(
      element: XmlElement,
      breakLine: boolean,
      indentLevel: number,
    ): string {
      if (!element.tag) return ' '.repeat(indentLevel) + element.content;

      const indentString = ' '.repeat(indentLevel); // Indentation for current level
      const attributesString = element.attributes
        .entries()
        .map(([key, value]) => ` ${key}="${value}"`)
        .toArray()
        .join('');

      if (element.children.length === 0 && !element.content) {
        return `${indentString}<${element.tag}${attributesString} />`;
      }

      const openTag = `<${element.tag}${attributesString}>`;
      const closeTag = `</${element.tag}>`;

      // Recursively process children, increasing indentation for child elements
      const childrenXml = element.children
        .map((child) => nodeToXml(child, breakLine, indentLevel + indent)) // Increase indent for children
        .join(breakLine ? '\n' : '');

      // Format the output with optional indentation and line breaks
      const formattedXml =
        `${indentString}${openTag}${breakLine ? '\n' : ''}` +
        `${childrenXml}` +
        (breakLine ? `\n${indentString}` : '') +
        closeTag;

      return formattedXml;
    }

    return nodeToXml(this, breakLine, 0).trim();
  }

  json(space: number = 2): any {
    return JSON.stringify(
      this,
      (key, value) => {
        if (key === 'parent') return undefined;
        if (value instanceof Map) return Object.fromEntries(value);
        return value;
      },
      space,
    );
  }

  findAll(tag: string): XmlElement[] {
    const elements: XmlElement[] = [];
    function findInElement(element: XmlElement) {
      if (element.tag === tag) {
        elements.push(element);
      }
      element.children.forEach(findInElement);
    }
    findInElement(this);
    return elements;
  }
}
