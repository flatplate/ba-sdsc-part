import React from "react";
import { Route, Switch, withRouter } from "react-router";
import PrivateRoute from "../PrivateRoute";
import AccountSettings from "./AccountSettings";
import SettingsMenu from "./SettingsMenu";
import UserSettings from "./UserSettings";

class Settings extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { auth: null };
    }

    componentDidMount() {
        this.setState({ auth: this.props.api.authenticationToken });
    }

    render() {
        return (
            <div className="grid grid-cols-4 gap-4">
                <div>
                    <SettingsMenu roles={this.state.auth && this.state.auth.context.roles} />
                </div>
                <div className="col-span-3">

                    <PrivateRoute path="/settings/account" api={this.props.api}>
                        <AccountSettings userData={this.state.auth}/>
                    </PrivateRoute>
                    <PrivateRoute path="/settings/users" api={this.props.api}>
                        <UserSettings></UserSettings>  
                    </PrivateRoute>
                </div>
            </div>
        );
    }
}

export default withRouter(Settings);
