import React from "react";
import { Redirect, Route, withRouter } from "react-router-dom";

class PrivateRoute extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.api = this.props.api;
        this.state = {authenticated: this.api.authenticated, authenticationData: this.api.authenticationToken};
        this.api.addListener("authenticated", (val) => {
            this.setState({authenticated: val, authenticationData: this.api.authenticationToken});
            console.log("Authentication update", val);
        });
    }

    componentDidMount() {
        this.setState({authenticated: this.api.authenticated});
    }

    hasRights() {
        if (!this.props.rolesNeeded || this.props.rolesNeeded.length === 0) {
            return true;
        }
        return this.props.rolesNeeded.every(role => this.state.authenticationData.context.roles.indexOf(role) >= 0);
    }

    getElement() {
        if (!this.state.authenticated) {
            return <Redirect to="/login" />;
        }
        if (!this.hasRights()) {
            this.props.history.goBack();
            return null;
        }
        return this.props.children;
    }

    render() {
        if (this.state.authenticated === null) {
            return null;
        }
        return (
            <Route {...this.props}>
                {this.getElement()}
            </Route>
        );
    }
}

export default withRouter(PrivateRoute);