import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Button from "../Button";

class SurveyQuestionCondition extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div className="w-full flex items-center">
                <div className="h-full justify-center items-center">
                    <FontAwesomeIcon icon={faTimes} className="text-red-400 hover:text-red-600 cursor-pointer" onClick={this.props.onDelete}/>

                </div>
                <div className="m-2 h-full w-1/6 justify-center items-center">
                    <p>
                    {this.props.conditionText}
                    </p>
                </div>
                <div className="flex flex-grow inline-block p-1">
                    <select
                        name="question"
                        id=""
                        onChange={this.props.onQuestionChange}
                        className="w-full border-gray-300 bg-green-50"
                        value={this.props.condition.question._id}
                    >
                        {this.props.questions.map((question) => (
                            <option value={question.question._id}>
                                {question.question._name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-grow inline-block p-1">
                    <select
                        name="operator"
                        onChange={this.props.onOperatorChange}
                        className="w-full border-gray-300 bg-green-50"
                        value={this.props.condition.operator}
                    >
                        <option value="==">is</option>
                        <option value="!=">is not</option>
                    </select>
                </div>
                <div className="flex flex-grow p-1">
                    <select
                        name="answer"
                        id=""
                        onChange={this.props.onAnswerChange}
                        className="w-full border-gray-300 bg-green-50"
                        value={this.props.condition.answer}
                    >
                        {this.props.condition.question.answers.map((answer) => (
                            <option value={answer.value}>{answer.value}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-initial m-1">
                    <Button textSize="text-sm" onClick={this.props.onAddInternalCondition}>And</Button>
                </div>
            </div>
        );
    }
}

export default SurveyQuestionCondition;
