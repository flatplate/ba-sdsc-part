import { faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import Button from "../Button";
import SurveyQuestionCondition from "./SurveyQuestionCondition";

class SurveyQuestionConditions extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            conditions: this.props.currentConditions || [],
            canHaveConditions: false,
        };
        const indexOfCurrentQuestion = this.props.allQuestions.indexOf(this.props.currentQuestion);
        this.possibleConditionQuestions = this.props.allQuestions
            .slice(0, indexOfCurrentQuestion)
            .filter((question) => question.question.answers && question.question.answers.length > 0);
        console.log(this.possibleConditionQuestions);

        console.log("current question");
        console.log(this.props.currentQuestion);

        console.log("index of current question: " + indexOfCurrentQuestion);
        this.canHaveConditions = true;
        if (this.possibleConditionQuestions.length === 0) {
            this.canHaveConditions = false;
            return;
        }

        this.defaultInternalCondition = {
            question: this.possibleConditionQuestions[0].question,
            operator: "is",
            answer: this.possibleConditionQuestions[0].question.answers[0].value,
        };
        this.defaultCondition = {
            action: "hide",
            conditions: [{ ...this.defaultInternalCondition }],
        };
    }

    componentDidUpdate(oldProps) {
        const indexOfCurrentQuestion = this.props.allQuestions.indexOf(this.props.currentQuestion);
        this.possibleConditionQuestions = this.props.allQuestions
            .slice(0, indexOfCurrentQuestion)
            .filter((question) => question.question.answers && question.question.answers.length > 0);
        if (this.possibleConditionQuestions.length > 0) {
            this.canHaveConditions = true;
        } else {
            this.canHaveConditions = false;
            return;
        }

        this.defaultInternalCondition = {
            question: this.possibleConditionQuestions[0].question,
            operator: "is",
            answer: this.possibleConditionQuestions[0].question.answers[0].value,
        };
        this.defaultCondition = {
            action: "hide",
            conditions: [{ ...this.defaultInternalCondition }],
        };
    }

    addCondition(condition) {
        let newConditions = Array.from(this.state.conditions);
        newConditions.push(condition);
        this.setConditions(newConditions);
    }

    removeCondition(index) {
        let newConditions = Array.from(this.state.conditions);
        newConditions.splice(index, 1);
        this.setConditions(newConditions);
    }

    onQuestionChange(event, externalConditionIndex, internalConditionIndex) {
        let newConditions = Array.from(this.state.conditions);
        let condition = newConditions[externalConditionIndex].conditions[internalConditionIndex];
        condition.question = this.possibleConditionQuestions.find(
            (question) => question.question._id === event.target.value
        ).question;
        condition.answer = condition.question.answers[0].value;
        console.log(newConditions);
        this.setConditions(newConditions);
    }

    onOperatorChange(event, externalConditionIndex, internalConditionIndex) {
        let newConditions = Array.from(this.state.conditions);
        this.getCondition(externalConditionIndex, internalConditionIndex, newConditions).operator = event.target.value;
        this.setConditions(newConditions);
    }

    onAnswerChange(event, externalConditionIndex, internalConditionIndex) {
        let newConditions = Array.from(this.state.conditions);
        console.log("On answer change", event.target.value);
        this.getCondition(externalConditionIndex, internalConditionIndex, newConditions).answer = event.target.value;
        this.setConditions(newConditions);
    }

    getCondition(externalConditionIndex, internalConditionIndex, conditions) {
        return conditions[externalConditionIndex].conditions[internalConditionIndex];
    }

    onAddInternalCondition(externalConditionIndex, internalConditionIndex) {
        this.state.conditions[externalConditionIndex].conditions.splice(internalConditionIndex, 0, {
            ...this.defaultInternalCondition,
        });
        this.setState({});
    }

    setConditions(conditions) {
        this.setState(
            { conditions: conditions },
            () => this.props.onConditionsChanged && this.props.onConditionsChanged(conditions)
        );
    }

    deleteCondition(externalConditionIndex, internalConditionIndex) {
        this.state.conditions[externalConditionIndex].conditions.splice(internalConditionIndex, 1);
        if (this.state.conditions[externalConditionIndex].conditions.length === 0) {
            let newConditions = Array.from(this.state.conditions).filter(
                (condition) => condition !== this.state.conditions[externalConditionIndex]
            );
            this.setState({ conditions: newConditions });
            return;
        }
        this.setState({});
    }

    onActionChange(event, externalIndex) {
        let newConditions = Array.from(this.state.conditions);
        let newCondition = {...newConditions[externalIndex], action: event.target.value};
        newConditions[externalIndex] = newCondition;
        this.setConditions(newConditions);
    }

    render() {
        console.log(this.state.conditions);

        return (
            <div className="space-y-2">
                {this.state.conditions.map((externalCondition, externalIndex) => {
                    console.log(externalCondition);
                    return externalCondition.conditions.map((condition, internalIndex) => (
                        <SurveyQuestionCondition
                            key={"condition_" + externalIndex + internalIndex}
                            questions={this.possibleConditionQuestions}
                            condition={condition}
                            action={externalCondition.action}
                            secondaryCondition={internalIndex !== 0}
                            onActionChange={(e) => this.onActionChange(e, externalIndex)}
                            onQuestionChange={(e) => this.onQuestionChange(e, externalIndex, internalIndex)}
                            onOperatorChange={(e) => this.onOperatorChange(e, externalIndex, internalIndex)}
                            onAnswerChange={(e) => this.onAnswerChange(e, externalIndex, internalIndex)}
                            onAddInternalCondition={() => this.onAddInternalCondition(externalIndex, internalIndex)}
                            onDelete={() => {
                                this.deleteCondition(externalIndex, internalIndex);
                            }}
                        />
                    ));
                })}
                {this.canHaveConditions ? (
                    <Button textSize="sm" onClick={() => this.addCondition({ ...this.defaultCondition })}>
                        Add Condition
                    </Button>
                ) : (
                    <div className="w-full text-center">This question cannot have conditions</div>
                )}
            </div>
        );
    }
}

export default SurveyQuestionConditions;
