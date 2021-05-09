import React from "react";
import { AppContext } from "../App";
import Button from "../Button";
import TextInput from "../TextInput";
import CreateUser from "./CreateUser";
import SettingsBlock from "./SettingsBlock";
import SettingsBlockBody from "./SettingsBlockBody";
import SettingsBlockHeader from "./SettingsBlockHeader";
import SettingsPage from "./SettingsPage";
import Users from "./Users";

class UserSettings extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <AppContext.Consumer>
                {({ api }) => (
                    <SettingsPage>
                        <SettingsBlock>
                            <SettingsBlockHeader>Create User</SettingsBlockHeader>
                            <SettingsBlockBody>
                                <CreateUser api={api}></CreateUser>
                            </SettingsBlockBody>
                        </SettingsBlock>

                        <SettingsBlock>
                            <SettingsBlockHeader>Users</SettingsBlockHeader>
                            <SettingsBlockBody>
                                <Users api={api}></Users>
                            </SettingsBlockBody>
                        </SettingsBlock>
                    </SettingsPage>
                )}
            </AppContext.Consumer>
        );
    }
}

UserSettings.contextType = AppContext;

export default UserSettings;
