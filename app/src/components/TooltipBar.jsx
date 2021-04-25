import React from "react";
import marked from "marked";

class TooltipBarStore {
    tooltips = [];
    listeners = [];

    addTooltip(tooltip) {
        this.tooltips.push(tooltip);
        console.log("tooltip", this.tooltips);
        this.notifyTooltipChanged();
    }

    removeTooltip(tooltip) {
        this.tooltips = this.tooltips.filter(
            (oldTooltip) => oldTooltip !== tooltip
        );
        this.notifyTooltipChanged();
    }

    notifyTooltipChanged() {
        let currentTooltip = null;
        if (this.tooltips.length !== 0) {
            currentTooltip = this.tooltips[this.tooltips.length - 1];
        }
        this.listeners.forEach((listener) => listener(currentTooltip));
    }

    addListener(tooltipChangedListener) {
        this.listeners.push(tooltipChangedListener);
    }

    removeListener(tooltipChangedListener) {
        this.listeners = this.listeners.filter(
            (listener) => listener !== tooltipChangedListener
        );
    }
}

const tooltipStore = new TooltipBarStore();

class TooltipHeader extends React.Component {
    render() {
        return <div class="text-lg font-bold">{this.props.children}</div>;
    }
}

class TooltipText extends React.Component {
    render() {
        return <div class="text-md">{this.props.children}</div>;
    }
}

class TooltipBar extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { currentTooltip: null };
            this.mapToElement = this.mapToElement.bind(this);
    }

    componentDidMount() {
        tooltipStore.addListener((currentTooltip) => {
            console.log(currentTooltip);
            this.setState({ currentTooltip: currentTooltip });
        });
    }

    parseMarkdown(markdownText) {
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
                    <h3 className="font-bold xl:text-xl text-lg">{this.parseMarkdownTree(node.tokens)}</h3>
                    <br />
                </>
            );
        } else if (node.type === "text") {
            return node.text;
        } else if (node.type === "paragraph") {
            return <p>{this.parseMarkdownTree(node.tokens)}</p>;
        } else if (node.type === "space") {
            return "";
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
            <div
                className={`bg-gray-50 shadow-lg border-gray-100 border fixed w-screen h-auto xl:h-screen xl:w-80 xl:top-0 xl:bottom-0 transition-all duration-300 items-center flex  ${
                    this.state.currentTooltip
                        ? "xl:right-0 bottom-0"
                        : "xl:-right-80 -bottom-20"
                }`}
            >
                <div className="p-6">{this.state.currentTooltip && this.parseMarkdown(this.state.currentTooltip)}</div>
            </div>
        );
    }
}

export default TooltipBar;
export { tooltipStore, TooltipHeader, TooltipText };
