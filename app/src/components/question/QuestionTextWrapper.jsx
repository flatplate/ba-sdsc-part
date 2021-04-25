import React from "react";
import marked from "marked";

class QuestionTextWrapper extends React.Component {
    constructor() {
        super();
        this.mapToElement = this.mapToElement.bind(this);
    }

    parseMarkdown(markdownText) {
        console.log("MarkdownText", markdownText)
        const tree = marked.lexer(markdownText);
        console.log("tree", tree);
        return this.parseMarkdownTree(tree);
    }

    parseMarkdownTree(markdownTree) {
        return markdownTree.map(this.mapToElement);
    }

    mapToElement(node) {
        if (node.type === "heading") {
            return (
                <>
                    <h3 className="font-bold xl:text-3xl text-xl">{this.parseMarkdownTree(node.tokens)}</h3>
                    <br />
                </>
            );
        } else if (node.type === "text") {
            return node.text;
        } else if (node.type === "paragraph") {
            return <p>{this.parseMarkdownTree(node.tokens)}</p>;
        } else if (node.type === "space") {
            return <br />;
        } else if (node.type === "strong") {
            return <span className="font-bold">{this.parseMarkdownTree(node.tokens)}</span>;
        } else if (node.type === "em") {
            return <span className="italic">{this.parseMarkdownTree(node.tokens)}</span>;
        } else if (node.type === "list") {
            return <ul className="list-disc">{node.items.map(this.mapToElement)}</ul>;
        } else if (node.type === "list_item") {
            return <li>{this.parseMarkdownTree(node.tokens)}</li>;
        } else {
            return this.parseMarkdownTree(node.tokens);
        }
    }

    render() {
        return (
            <div className="xl:text-2xl text-lg m-6 my-12 whitespace-pre-wrap">
                {this.parseMarkdown(this.props.children)}
            </div>
        );
    }
}

export default QuestionTextWrapper;
