import {
    faAngleDown,
    faEdit,
    faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Card from "../Card";
import { Link } from "react-router-dom";

class QuestionCard extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { collapsed: true };
    }

    renderQuestionDetails() {
        if (this.state.collapsed) return null;

        return (
            <div>
                {this.renderAnswers()}
                {this.renderRows()}
                {this.renderEvaluationStrategy()}
            </div>
        );
    }

    renderRows() {
        return (
            this.props.question.rows &&
            this.props.question.rows.length > 0 && (
                <div>
                    <table className="table-auto w-full text-md text-gray-700 font-light">
                        <thead>
                            <tr>
                                <th>Row Text</th>
                                <th>Row Value</th>
                                <th>Row Tooltip</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.question.rows.map((row, i) => (
                                <tr className={i % 2 == 1 && "bg-gray-100"}>
                                    <td className="py-2 pl-4">{row.text}</td>
                                    <td className="py-2 pl-4">{row.id}</td>
                                    <td className="py-2 pl-4">{row.tooltip}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )
        );
    }

    renderAnswers() {
        return (
            this.props.question.answers &&
            this.props.question.answers.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="table-auto w-full text-md text-gray-700 font-light">
                        <thead>
                            <th>Answer Text</th>
                            <th>Answer Value</th>
                            <th>Answer Tooltip</th>
                        </thead>
                        <tbody>
                            {this.props.question.answers.map((answer, i) => (
                                <tr
                                    className={
                                        (i % 2 == 0
                                            ? "hover:bg-gray-200"
                                            : "bg-gray-100 hover:bg-gray-200") +
                                        " transition-all duration-100"
                                    }
                                >
                                    <td className="py-2 pl-4">{answer.text}</td>
                                    <td className="py-2 pl-4">
                                        {answer.value}
                                    </td>
                                    <td className="py-2 pl-4">
                                        {answer.tooltip}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )
        );
    }

    renderEvaluationStrategy() {
        return this.props.question.evaluationStrategy && (
            <div className="w-full text-center p-6 bg-gray-50">
                {this.props.question.evaluationStrategy}
            </div>
        )
    }

    render() {
        return (
            <Card>
                <div className="flex justify-between">
                    <div className="w-3/4">
                        <div className="block text-lg font-bold">
                            {this.props.question._name}
                        </div>
                        <div className="block text-md text-gray-500">
                            {this.props.question.type}
                        </div>
                        <div className="block text-md text-gray-400">
                            {this.props.question._createdAt}
                        </div>
                    </div>
                    <div className="flex flex-col justify-around">
                            <Link
                                to={"/questions/" + this.props.question["_id"]}
                            >
                                <FontAwesomeIcon
                                    icon={faEdit}
                                    className="text-primary-600 hover:text-primary-500 transition-all duration-200 text-2xl cursor-pointer"
                                    title="Edit question"
                                />
                            </Link>
                            <FontAwesomeIcon
                                icon={faTrashAlt}
                                className="text-red-600 hover:text-red-500 transition-all duration-200 text-2xl cursor-pointer"
                                onClick={this.props.deleteQuestion}
                                title="Delete question"
                            />
                    </div>
                </div>
                <hr className="border-bottom border-solid border-gray-200 w-full" />
                <div>{this.props.question.text}</div>
                {this.renderQuestionDetails()}
                <div className="w-full flex justify-end">
                    <FontAwesomeIcon
                        icon={faAngleDown}
                        className={`text-primary-600 hover:text-primary-500 transition-all duration-200 text-2xl cursor-pointer transform ${
                            !this.state.collapsed && "rotate-180"
                        }`}
                        onClick={() =>
                            this.setState({ collapsed: !this.state.collapsed })
                        }
                    />
                </div>
            </Card>
        );
    }
}

export default QuestionCard;
