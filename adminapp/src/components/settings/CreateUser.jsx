import { faCheck, faCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { alertService } from "../../services/AlertService";
import Button from "../Button";
import TextInput from "../TextInput";

class CreateUser extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {username: "", password: "", email: "", buttonText: "Create"};
        this.setUsername = this.setUsername.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.setEmail = this.setEmail.bind(this);
    }

    setUsername(e) {
        this.setState({username: e.target.value});
    }

    setPassword(e) {
        this.setState({password: e.target.value});
    }

    setEmail(e) {
        this.setState({email: e.target.value});
    }

    createUser() {
        if (!this.checkInputFields()) {
            this.setState({buttonText: (<FontAwesomeIcon icon={faCog} className="text-white animate-spin"/>)})
            this.props.api.createUser(this.state.username, this.state.password, this.state.email).then(
                this.setState({buttonText: (<FontAwesomeIcon icon={faCheck} className="text-white"/>)}, () => {
                    setTimeout(() => this.setState({buttonText: "Create"}), 2000);
                })
            ).catch(error => {
                alertService.error(JSON.stringify(error));
                this.setState({buttonText: "Create"});
            })
        }
    }

    checkInputFields() {
        let error = false;
        if (this.state.username === "") {
            alertService.error("Please fill the username field");
            error = true;
        }
        if (this.state.password.length < 8) {
            alertService.error("Password must be at least 8 characters long");
            error = true;
        }
        if (!this.checkEmail(this.state.email)) {
            alertService.error("Please enter a valid email address");
            error = true;
        }
        return error;
    }

    checkEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    render() {
        return (
            <>
                <TextInput label="Username" onChange={this.setUsername} value={this.state.username}></TextInput>
                <TextInput minlength="8" label="Password" type="password" onChange={this.setPassword} value={this.state.password}></TextInput>
                <TextInput label="Email Address" type="email" onChange={this.setEmail} value={this.state.email}></TextInput>
                <Button onClick={() => this.createUser()}>{this.state.buttonText}</Button>
            </>
        );
    }
}

export default CreateUser;
