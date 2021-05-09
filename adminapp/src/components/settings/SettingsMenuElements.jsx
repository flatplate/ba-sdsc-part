import React from "react";
import { Link, withRouter } from "react-router-dom";

class SettingsMenuElement extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        const activeClass = "border-l-2 bg-gray-50";
        const active = this.props.link && this.props.location.pathname === this.props.link;
        if (this.props.rolesNeeded && !this.props.roles) {
            return null;
        }
        if (!this.props.rolesNeeded || this.props.rolesNeeded.every((elem) => this.props.roles.indexOf(elem) >= 0)) {
            const element = (
                <div
                    className={`w-full cursor-pointer p-2 px-6 hover:bg-gray-100 transition-all duration-100 hover:border-l-4  border-primary-700 ${
                        active && activeClass
                    }`}
                >
                    {this.props.children}
                </div>
            );
            if (this.props.link) {
                return <Link to={this.props.link}>{element}</Link>;
            } else {
                return element;
            }
        }
        return null;
    }
}

export default withRouter(SettingsMenuElement);
