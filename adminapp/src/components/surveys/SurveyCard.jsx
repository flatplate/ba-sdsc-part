import React from "react";
import Card from "../Card";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faEdit, faTimes, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

class SurveyCard extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    renderActiveButton() {
        if (this.props.survey.active) {
            return (
                <FontAwesomeIcon
                    icon={faCheck}
                    className="text-primary-600 hover:text-primary-500 transition-all duration-200 text-2xl cursor-pointer"
                    title="This survey is currently active"
                    onClick={() => this.props.setInactive && this.props.setInactive(this.props.survey._id)}
                />
            );
        } else {
            return (
                <FontAwesomeIcon
                    icon={faTimes}
                    className="text-red-600 hover:text-red-500 transition-all duration-200 text-2xl cursor-pointer"
                    title="This survey is currently inactive"
                    onClick={() => this.props.setActive && this.props.setActive(this.props.survey._id)}
                />
            );
        }
    }

    render() {
        return (
            <Card>
                <div className="flex justify-between">
                    <div>
                        <div className="block text-lg font-bold">{this.props.survey._name}</div>
                        <div className="block text-md text-gray-500">
                            {this.props.survey.questions ? this.props.survey.questions.length : 0} Questions
                        </div>
                        <div className="block text-md text-gray-400">Created at {this.props.survey._createdAt}</div>
                    </div>
                    <div className="flex flex-col justify-between space-y-2">
                        <div>{this.renderActiveButton()}</div>
                        <Link to={"/surveys/" + this.props.survey["_id"]}>
                            <FontAwesomeIcon
                                icon={faEdit}
                                className="text-primary-600 hover:text-primary-500 transition-all duration-200 text-2xl cursor-pointer"
                                title="Edit survey"
                            />
                        </Link>
                        <div>
                            <FontAwesomeIcon
                                icon={faTrashAlt}
                                className="text-red-600 hover:text-red-500 transition-all duration-200 text-2xl cursor-pointer"
                                title="Delete Survey"
                                onClick={() => this.props.onDelete && this.props.onDelete(this.props.survey._id)}
                            />
                        </div>
                    </div>
                </div>
            </Card>
        );
    }
}

export default SurveyCard;
