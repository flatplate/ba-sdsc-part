import React from "react";

class Select extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div>
                {this.props.label && <label className="w-full text-sm font-bold mb-2 block">{this.props.label}</label>}
                <select
                    className="rounded border-gray-300 w-full"
                    onChange={this.props.onChange}
                    value={this.props.defaultValue}
                >
                    {this.props.values.map(({ text, value }) => (
                        <option value={value}>{text}</option>
                    ))}
                </select>
            </div>
        );
    }
}

export default Select;
