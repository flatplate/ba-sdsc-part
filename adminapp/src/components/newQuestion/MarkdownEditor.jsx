import React from "react";
import ReactMde from "react-mde";
import * as Showdown from "showdown";

const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true,
});

class MarkdownEditor extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { selectedTab: "write" };
    }

    render() {
        return (
            <ReactMde
                value={this.props.value}
                onChange={this.props.onChange || (() => {})}
                selectedTab={this.state.selectedTab}
                onTabChange={(tab) => this.setState({ selectedTab: tab })}
                generateMarkdownPreview={(markdown) => Promise.resolve(converter.makeHtml(markdown))}
                {...this.props}
            />
        );
    }
}

export default MarkdownEditor;
