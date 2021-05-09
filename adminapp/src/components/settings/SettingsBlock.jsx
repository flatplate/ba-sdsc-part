import React from "react";

class SettingsBlock extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return <div className="space-y-6">{this.props.children}</div>;
    }
}

export default SettingsBlock;
