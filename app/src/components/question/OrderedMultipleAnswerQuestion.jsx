import React from "react";
import QuestionAnswer from "./QuestionAnswer";
import QuestionAnswerWrapper from "./QuestionAnswerWrapper";
import QuestionTextWrapper from "./QuestionTextWrapper";
import OtherElement from "./OtherElement";
import { Button } from "../button";
import MultipleChoiceScrollField from "./MultipleChoiceScrollField";
import QuestionContainer from "./QuestionContainer";
import QuestionError from "./QuestionError";

class OrderedMultipleAnswerQuestion extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            selected: [],
            answers: this.props.question.answers,
            error: null
        };
        this.toggleValue = this.toggleValue.bind(this);
        this.setStateWithOnChange = this.setStateWithOnChange.bind(this);
        this.addAnswer = this.addAnswer.bind(this);
        this.advance = this.advance.bind(this);
    }

    // TODO Implement "Please select at least once"

    toggleValue(value) {
        if (this.state.selected.indexOf(value) === -1) {
            // Not selected => select
            // TODO if number of selected values is going to exceed maximum possible values show error & deny selection
            if (this.state.selected.length === 3) {
                this.setState({error: "Bitte wählen Sie maximal 3 Optionen aus"});
                return;
            }
            this.state.selected.push(value);
            this.setStateWithOnChange({});
        } else {
            // Selected => Deselect
            let selected = this.state.selected.filter(
                (selectedValue) => selectedValue !== value
            );
            this.setStateWithOnChange({ selected: selected });
        }
    }

    setStateWithOnChange(newState) {
        this.setState(
            newState,
            () =>
                this.props.onChange && this.props.onChange(this.state.selected)
        );
    }

    calculateColor(index) {
        switch (index) {
            case 0:
                return "primary";
            case 1:
                return "secondary";
            default:
                return "ternary";
        }
    }

    addAnswer(answerText) {
        const newAnswers = Array.from(this.state.answers);
        newAnswers.push({ text: answerText, value: answerText });
        this.setState({ answers: newAnswers });
    }


    advance() {
        if (this.state.selected.length === 0) {
            this.setState({ error: "Bitte mindestens eine Option auswählen" });
            return;
        }

        this.props.advance();
    }


    render() {
        return (
            <QuestionContainer>
                {this.props.question.text && (
                    <QuestionTextWrapper>
                        {this.props.question.text}
                    </QuestionTextWrapper>
                )}
                {this.state.error && <QuestionError>{this.state.error}</QuestionError>}
                <div>
                    <MultipleChoiceScrollField>
                        {this.state.answers.map((answer, index) => {
                            const selectedIndex = this.state.selected.indexOf(
                                answer.value
                            );
                            const selected = selectedIndex !== -1;
                            return (
                                <QuestionAnswerWrapper
                                    onClick={() =>
                                        this.toggleValue(answer.value)
                                    }
                                    selected={selected}
                                    key={
                                        this.props.question._id +
                                        "_answer_" +
                                        index
                                    }
                                    color={
                                        selected &&
                                        this.calculateColor(selectedIndex)
                                    }
                                    leftLabel={selected && selectedIndex + 1}
                                    answer={answer}
                                ></QuestionAnswerWrapper>
                            );
                        })}
                        {this.props.other && (
                            <OtherElement onAnswerAdded={this.addAnswer}>
                                Anderes
                            </OtherElement>
                        )}
                    </MultipleChoiceScrollField>
                </div>
                <div className="my-8 float-right">
                    <Button onClick={this.advance}>Weiter</Button>
                </div>
            </QuestionContainer>
        );
    }
}

export default OrderedMultipleAnswerQuestion;
