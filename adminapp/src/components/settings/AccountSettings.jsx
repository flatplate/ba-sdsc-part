import React from "react";
import AppContext from "../AppContext";
import Button from "../Button";
import TextInput from "../TextInput";
import ChangePassword from "./ChangePassword";
import SettingsBlock from "./SettingsBlock";
import SettingsBlockBody from "./SettingsBlockBody";
import SettingsBlockHeader from "./SettingsBlockHeader";
import SettingsPage from "./SettingsPage";

class AccountSettings extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        if (this.props.userData === null) {
            return null;
        }

        return (
            <SettingsPage>
                <SettingsBlock>
                    <SettingsBlockHeader>Account</SettingsBlockHeader>
                    <SettingsBlockBody>
                        {/* account info */}
                        <div className="space-y-1">
                            <h5 className="font-bold">Username</h5>
                            <p className="mx-4">{this.props.userData.context.user}</p>
                        </div>
                        <div>
                            <div className="flex flex-row items-end justify-between space-x-6">
                                <div className="flex-grow">
                                    <TextInput label="Email Address" className="inline-block"></TextInput>
                                </div>
                                <Button disabled>Save Email</Button>
                            </div>

                            <div className="text-light text-gray-400 text-sm mt-2 ml-2">
                                Email address can be used by the admin to contact you.
                            </div>
                        </div>
                    </SettingsBlockBody>
                </SettingsBlock>
                <SettingsBlock>
                    <SettingsBlockHeader>Change Password</SettingsBlockHeader>
                    <SettingsBlockBody>
                        <AppContext.Consumer>{(context) => <ChangePassword api={context.api} />}</AppContext.Consumer>
                    </SettingsBlockBody>
                </SettingsBlock>
            </SettingsPage>
        );
    }
}

export default AccountSettings;
