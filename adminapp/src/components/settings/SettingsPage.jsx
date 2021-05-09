import React from "react";

class SettingsPage extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return <div className="px-2 text-gray-600 space-y-12">{this.props.children}</div>;
    }
}

export default SettingsPage;
