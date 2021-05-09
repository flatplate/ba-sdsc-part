import React from "react";
import { alertService } from "../../services/AlertService";
import SettingsUser from "./SettingsUser";

class Users extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { users: [] };
        this.updateUsers = this.updateUsers.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
    }

    componentDidMount() {
        this.updateUsers();
    }

    updateUsers() {
        this.props.api.getAllUsers().then((users) => {
            this.setState({ users: users });
        });
    }

    deleteUser(id) {
        this.props.api.deleteUser(id).then(() => this.updateUsers()).catch(error => alertService.error(error.message))
    }

    render() {
        return this.state.users.map(user => <SettingsUser user={user} deleteUser={(id) => this.deleteUser(id)}/>);
    }
}

export default Users;
