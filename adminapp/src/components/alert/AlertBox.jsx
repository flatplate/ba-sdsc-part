import React from 'react';

class AlertBox extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        let backgroundColor;
        switch (this.props.type) {
            case "info":
                backgroundColor = "blue";
                break;
            case "error":
                backgroundColor = "red";
                break;
            default:
                backgroundColor = "primary";
        }
        return (
            <div className={`text-center text-md text-${backgroundColor}-900 w-128 p-2 cursor-pointer shadow-lg bg-${backgroundColor}-100 border-l-8 border-${backgroundColor}-700`} onClick={this.props.onClick}>
                {this.props.children}
            </div>
        )
    }
}

export default AlertBox;