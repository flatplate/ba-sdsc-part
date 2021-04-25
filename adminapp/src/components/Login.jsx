import React from 'react';
import TextInput from './TextInput';
import Card from './Card';
import Button from './Button';
import {alertService} from '../services/AlertService';
import { Redirect } from 'react-router-dom';

class Login extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { username: "", password: "", authenticated: false }
        this.api = this.props.api;
        this.login = this.login.bind(this);
        this.authenticationListener = this.authenticationListener.bind(this);
    }

    componentDidMount() {
        this.api.checkAuthentification();
        this.setState({authenticated: this.api.authenticated})
        this.api.addListener("authenticated", this.authenticationListener);
    }

    componentWillUnmount() {
        this.api.removeListener("authenticated", this.authenticationListener);
    }

    authenticationListener(authenticated) {
        this.setState({authenticated: authenticated});
    }

    checkInputs() {
        if (this.state.username === "" || this.state.password === "") {
            alertService.error("Please fill out your username and password");
            return false;
        }
        return true;
    }

    login() {
        if (!this.checkInputs())
            return;
        this.api.authenticate(this.state.username, this.state.password).catch(error => {
            alertService.error(error.message)
        })
    }

    render() {
        return (
            <div className="w-128">
                {this.state.authenticated && (<Redirect to="/" />)}
                <Card>
                    <div className="p-6 space-y-6">
                        <TextInput label="Username" value={this.state.username} onChange={e => this.setState({username: e.target.value})} />
                        <TextInput label="Password" value={this.state.password} type="password" onChange={e => this.setState({password: e.target.value})} />
                        <Button onClick={this.login} color="primary">Log in</Button>
                    </div>
                </Card>
            </div>
        )
    }
}

export default Login;