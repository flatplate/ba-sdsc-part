import React from "react";

class SettingsBlockBody extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return <div className="px-6 space-y-6">{this.props.children}</div>;
    }
}

export default SettingsBlockBody;
