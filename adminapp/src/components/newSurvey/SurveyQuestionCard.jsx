import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import Card from "../Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SurveyQuestionConditions from "./SurveyQuestionConditions";

class SurveyQuestionCard extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { collapsed: true, conditions: this.props.question ? this.props.question.logic : []};
        this.onConditionsChanged = this.onConditionsChanged.bind(this);
    }

    onConditionsChanged(conditions) {
        this.setState(
            { conditions: conditions },
            () => this.props.onConditionsChanged && this.props.onConditionsChanged(conditions)
        );
    }

    renderQuestionConditions() {
        if (this.state.collapsed) return null;

        console.log("alsjkdhf");
        console.log(this.props.allQuestions);
        return (
            <div className="rounded border border-gray-100 p-6">
                <SurveyQuestionConditions
                    currentQuestion={this.props.question}
                    allQuestions={this.props.allQuestions}
                    currentConditions={this.state.conditions}
                    onConditionsChanged={this.onConditionsChanged}
                />
            </div>
        );
    }

    render() {
        return (
            <Card>
                <div className="flex justify-between">
                    <div>
                        <div className="block text-lg font-bold">{this.props.question.question._name}</div>
                        <div className="block text-md text-gray-500">{this.props.question.question.type}</div>
                        <div className="block text-md text-gray-400">{this.props.question.question._createdAt}</div>
                    </div>
                </div>
                <hr className="border-bottom border-solid border-gray-200 w-full" />
                <div>{this.props.question.question.text}</div>
                {this.renderQuestionConditions()}
                <div className="w-full flex justify-end">
                    <FontAwesomeIcon
                        icon={faAngleDown}
                        className={`text-primary-600 hover:text-primary-500 transition-all duration-200 text-2xl cursor-pointer transform ${
                            !this.state.collapsed && "rotate-180"
                        }`}
                        onClick={() => this.setState({ collapsed: !this.state.collapsed })}
                    />
                </div>
            </Card>
        );
    }
}

export default SurveyQuestionCard;
