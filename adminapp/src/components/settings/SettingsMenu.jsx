import React from "react";
import { Link, withRouter } from "react-router-dom";
import Card, { NoStyleCard } from "../Card";
import SettingsMenuElement from "./SettingsMenuElements";

class SettingsMenu extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <NoStyleCard className="p-0 text-gray-600">
                <h3 className="text-gray-500 font-bold p-2 px-4">Settings</h3>
                <hr />
                <SettingsMenuElement link="/settings/account">Account</SettingsMenuElement>
                <hr />
                    <SettingsMenuElement rolesNeeded={["admin"]} link="/settings/users" roles={this.props.roles}>
                        Users
                    </SettingsMenuElement>
            </NoStyleCard>
        );
    }
}

export default withRouter(SettingsMenu);
