import React from "react";
import { Redirect, Route, withRouter } from "react-router-dom";

class PrivateRoute extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.api = this.props.api;
        this.state = {authenticated: this.api.authenticated};
        this.api.addListener("authenticated", (val) => this.setState({authenticated: val}));
    }

    componentDidMount() {
        this.setState({authenticated: this.api.authenticated});
    }

    render() {
        if (this.state.authenticated === null) {
            return null;
        }
        return (
            <Route {...this.props}>
                {this.state.authenticated ? this.props.children : (<Redirect to="/login" />)}
            </Route>
        );
    }
}

export default withRouter(PrivateRoute);