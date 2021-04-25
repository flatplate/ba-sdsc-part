import { faEdit, faTrash, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import Card from "../Card";

class EvaluationCard extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <Card>
                <div className="flex flex-row space-x-2">
                    <div className="text-xl font-bold flex-grow">{this.props.evaluation.name}</div>
                    <div>
                        <Link to={`/evaluation/${this.props.evaluation._id}`}>
                            <FontAwesomeIcon
                                icon={faEdit}
                                className="text-primary-600 text-xl hover:text-primary-500 cursor-pointer transition-all duration-300"
                                title="Edit evaluation"
                            />
                        </Link>
                    </div>
                    <div>
                        <FontAwesomeIcon
                            icon={faTrashAlt}
                            className="text-red-600 text-xl hover:text-red-500 cursor-pointer transition-all duration-300"
                            title="Delete evaluation"
                            onClick={this.props.deleteEvaluation}
                        />
                    </div>
                    <div></div>
                </div>
                <hr />
                <div className="text-lg">{this.props.evaluation.description}</div>
            </Card>
        );
    }
}

export default EvaluationCard;
