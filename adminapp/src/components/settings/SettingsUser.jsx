import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const possibleBackgroundStrings = [
    "bg-primary-700",
    "bg-secondary-700",
    "bg-ternary-700",
    "bg-red-700",
    "bg-indigo-700",
    "bg-purple-700",
    "bg-pink-700",
    "bg-yellow-700",
];

class SettingsUser extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        const { id, username } = this.props.user;
        console.log("id", id, id.slice(-1));
        const colorString = possibleBackgroundStrings[parseInt(id.slice(-1)) >> 1];
        return (
            <div className="flex flex-row justify-between space-x-6 items-center my-2">
                <div className={`rounded-full h-16 w-16 ${colorString} flex justify-center items-center text-center text-3xl text-white`}>{username.slice(0, 1).toUpperCase()}</div>
                <div className="flex-grow">
                    <div className="text-lg font-medium">{this.props.user.username}</div>
                    <div className="text-gray-400">{this.props.user.emailAddress}</div>
                    <div className="text-gray-400">{this.props.user.roles && this.props.user.roles.join(", ")}</div>
                </div>
                <div className="rounded border border-gray-200 h-8 w-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100">
                    <FontAwesomeIcon icon={faTrashAlt} className="text-xl text-red-600 hover:text-red-500 cursor-pointer transition-all duration-300"  onClick={() => this.props.deleteUser(id)}/>
                </div>
            </div>
        );
    }
}

export default SettingsUser;
