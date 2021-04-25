import React from 'react';

class AlertBox extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        let backgroundColorString;
        let textColorString;
        let borderColorString;
        switch (this.props.type) {
            case "info":
                backgroundColorString = "bg-blue-100";
                textColorString = "text-blue-900";
                borderColorString = "border-blue-700"
                break;
            case "error":
                backgroundColorString = "bg-red-100";
                textColorString = "text-red-900";
                borderColorString = "border-red-700"
                break;
            default:
                backgroundColorString = "bg-primary-100";
                textColorString = "text-primary-900";
                borderColorString = "border-primary-700"
        }
        return (
            <div className={`text-center text-md ${backgroundColorString} w-128 p-2 cursor-pointer shadow-lg ${textColorString} border-l-8 ${borderColorString}`} onClick={this.props.onClick}>
                {this.props.children}
            </div>
        )
    }
}

export default AlertBox;