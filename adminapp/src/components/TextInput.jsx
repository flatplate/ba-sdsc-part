import React from "react";

class TextInput extends React.Component {
    render() {
        let classNames = ["w-full", "rounded", "border-gray-300"];
        this.props.textSize && classNames.push("text-" + this.props.textSize);
        this.props.bold && classNames.push("font-bold");
        this.props.rounded && classNames.push("rounded-" + this.props.rounded);
        this.props.className && classNames.push(this.props.className);

        return (
            <div>
                {this.props.label && (
                    <label className="text-sm font-bold block mb-2">
                        {this.props.label}
                    </label>
                )}
                <input
                    {...this.props}
                    type={this.props.type || "text"}
                    placeholder={this.props.label || this.props.placeholder}
                    className={classNames.join(" ")}
                />
            </div>
        );
    }
}

export default TextInput;
