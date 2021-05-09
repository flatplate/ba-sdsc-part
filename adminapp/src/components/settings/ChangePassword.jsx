import { faCheck, faCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { alertService } from "../../services/AlertService";
import Button from "../Button";
import TextInput from "../TextInput";

class ChangePassword extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { oldPassword: "", newPass: "", confirmPass: "", buttonText: "Change Password" };
        this.setOldPassword = this.setOldPassword.bind(this);
        this.setNewPass = this.setNewPass.bind(this);
        this.setConfirmPass = this.setConfirmPass.bind(this);
        this.changePassword = this.changePassword.bind(this);
    }

    setOldPassword(e) {
        this.setState({ oldPassword: e.target.value });
    }

    setNewPass(e) {
        this.setState({ newPass: e.target.value });
    }

    setConfirmPass(e) {
        this.setState({ confirmPass: e.target.value });
    }

    changePassword() {
        if (this.state.newPass !== this.state.confirmPass) {
            alertService.error("Passwords don't match");
            return;
        }
        this.setState({ buttonText: <FontAwesomeIcon icon={faCog} className="animate-spin text-2xl" /> });
        this.props.api
            .changePassword(this.state.oldPassword, this.state.newPass, this.state.confirmPass)
            .then(() => {
                this.setState({ buttonText: <FontAwesomeIcon icon={faCheck} /> }, () =>
                    setTimeout(() => {
                        this.setState({ buttonText: "Change Password" });
                    }, 2000)
                );
            })
            .catch((error) => {
                alertService.error(error.message);
                this.setState({ buttonText: "Change Password" });
            });
    }

    render() {
        return (
            <>
                <TextInput type="password" label="Old password" onChange={this.setOldPassword}></TextInput>
                <TextInput type="password" label="New password" onChange={this.setNewPass}></TextInput>
                <TextInput type="password" label="Confirm new password" onChange={this.setConfirmPass}></TextInput>
                <div className="w-1/3">
                    <Button onClick={this.changePassword}>{this.state.buttonText}</Button>
                </div>
            </>
        );
    }
}

export default ChangePassword;
