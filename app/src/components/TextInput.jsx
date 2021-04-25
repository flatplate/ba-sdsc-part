import React from 'react';


class TextInput extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { active: false };
        this.onValueChange = this.onValueChange.bind(this);
    }

    onValueChange(e) {
        this.setState({ active: !!e.target.value });
        if (this.props.onChange) {
            this.props.onChange(e);
        }
    }

    focus() { }

    render() {
        return (
            <div
                className={`relative ${!this.props.noBorder ? "border-b" : ""} mb-2 outline-none border-opacity-25 focus-within:border-primary-400 ${this.props.className}`}
            >
                <input
                    className={[
                        "outline-none w-full border-none rounded bg-transparent transition-all duration-200 ease-in-out p-2 focus:ring-transparent",
                        this.state.active &&
                            this.props.children &&
                            this.props.children.length > 1
                            ? "pt-6"
                            : "",
                        this.props.fontsize !== undefined
                            ? "text-" + this.props.fontsize
                            : "text-lg",
                        this.props.bold ? "font-bold" : "",
                        this.props.inputProps && this.props.inputProps.className,
                    ].join(" ")}
                    id={this.id}
                    name={this.id}
                    type="text"
                    onChange={this.onValueChange}
                    onFocus={this.props.onFocus}
                    onBlur={this.props.onBlur}
                />
                <label
                    className={[
                        "absolute top-0 left-0 flex items-center text-gray-700 text-opacity-50 p-2 transition-all duration-200 ease-in-out group-focus:text-primary-500 pointer-events-none",
                        this.state.active &&
                            this.props.children &&
                            this.props.children.length > 1
                            ? "text-xs"
                            : this.props.fontsize !== undefined
                                ? "text-" + this.props.fontsize
                                : "text-lg",
                        this.props.bold ? "font-bold" : "",
                    ].join(" ")}
                    htmlFor={this.id}
                >
                    {this.props.children}
                </label>
            </div>
        );
    }
}

export default TextInput;