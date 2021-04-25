import React from "react";
import { Button } from "../button";
import QuestionAnswer from "./QuestionAnswer";
import QuestionAnswerWrapper from "./QuestionAnswerWrapper";
import QuestionText from "./QuestionText";
import QuestionTextWrapper from "./QuestionTextWrapper";
import { TooltipHeader, tooltipStore, TooltipText } from "../TooltipBar";
import OtherElement from "./OtherElement";
import QuestionContainer from "./QuestionContainer";

class SingleAnswerMultipleChoiceQuestion extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.tooltipElement = this.getTooltipElement();
        this.state = { answers: this.props.question.answers };
        this.addAnswer = this.addAnswer.bind(this);
    }

    componentDidMount() {
        this.props.question.tooltip &&
            tooltipStore.addTooltip(this.props.question.tooltip);
    }

    componentWillUnmount() {
        this.props.question.tooltip &&
            tooltipStore.removeTooltip(this.props.question.tooltip);
    }

    onAnswerClick(answerValue) {
        this.props.onChange(answerValue, this.props.advance);
    }

    getTooltipElement() {
        if (!this.props.question.tooltip) {
            return null;
        }
        return (
            <>
                <TooltipHeader>What does this mean?</TooltipHeader>
                <TooltipText>{this.props.question.tooltip}</TooltipText>
            </>
        );
    }

    addAnswer(answerText) {
        console.log(answerText);
        const newAnswers = Array.from(this.state.answers);
        newAnswers.push({ text: answerText, value: answerText });
        this.setState({ answers: newAnswers });
    }

    render() {
        return (
            <QuestionContainer>
                {this.props.question.text && (
                    <QuestionTextWrapper>
                        {this.props.question.text}
                    </QuestionTextWrapper>
                )}
                <div>
                    {this.state.answers.map((answer, index) => (
                        <QuestionAnswerWrapper
                            key={this.props.question._id + "_answer_" + index}
                            answer={answer}
                            onClick={() => this.onAnswerClick(answer.value)}
                        />
                    ))}
                    {this.props.other && (
                        <OtherElement onAnswerAdded={this.addAnswer}>
                            Select Other
                        </OtherElement>
                    )}
                </div>
                {this.props.children}
            </QuestionContainer>
        );
    }
}

export default SingleAnswerMultipleChoiceQuestion;
