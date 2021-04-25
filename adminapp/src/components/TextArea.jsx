import React from "react";

class TextArea extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div className="w-full flex-col flex">
                {this.props.label && <label className="text-sm font-bold block mb-2">{this.props.label}</label>}
                <textarea
                    type="textarea"
                    placeholder={this.props.label || this.props.placeholder}
                    className={`flex-grow w-full rounded border-gray-300 ${this.props.className}`}
                    defaultValue={this.props.value || ""}
                    onChange={this.props.onChange}
                />
            </div>
        );
    }
}

export default TextArea;
