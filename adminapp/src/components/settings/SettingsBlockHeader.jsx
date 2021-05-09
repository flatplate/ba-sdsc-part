import React from "react";

class SettingsBlockHeader extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div className="space-y-2">
                <h1 className="px-4 py-2 text-2xl font-bold">{this.props.children}</h1>
                <hr />
            </div>
        );
    }
}

export default SettingsBlockHeader;
