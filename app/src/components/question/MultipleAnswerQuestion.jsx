import React from "react";
import QuestionAnswerWrapper from "./QuestionAnswerWrapper";
import QuestionTextWrapper from "./QuestionTextWrapper";
import { Button } from "../button";
import MultipleChoiceScrollField from "./MultipleChoiceScrollField";
import { tooltipStore, TooltipHeader, TooltipText } from "../TooltipBar";
import OtherElement from "./OtherElement";
import QuestionContainer from "./QuestionContainer";
import QuestionError from "./QuestionError";

class MultipleAnswerQuestion extends React.Component {
    constructor(props, context) {
        super(props, context);
        let selected = this.props.state ? this.props.state.filter((value) => typeof value) : [];
        this.state = { selected: selected, error: null };
        this.toggleValue = this.toggleValue.bind(this);
        this.setStateWithOnChange = this.setStateWithOnChange.bind(this);
        this.advance = this.advance.bind(this);
    }

    componentDidMount() {
        this.tooltipElement = this.getTooltipElement();
        this.props.question.tooltip && tooltipStore.addTooltip(this.tooltipElement);
    }

    componentWillUnmount() {
        this.props.question.tooltip && tooltipStore.removeTooltip(this.tooltipElement);
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

    // TODO Maybe look at "Please select at least once"

    toggleValue(value) {
        if (this.state.selected.indexOf(value) === -1) {
            // Not selected => select
            this.state.selected.push(value);
            this.setStateWithOnChange({});
        } else {
            // Selected => Deselect
            let selected = this.state.selected.filter((selectedValue) => selectedValue !== value);
            this.setStateWithOnChange({ selected: selected });
        }
    }

    setStateWithOnChange(newState) {
        this.setState(newState, () => this.props.onChange && this.props.onChange(this.state.selected));
    }

    advance() {
        if (this.state.selected.length === 0) {
            this.setState({ error: "Please select at least one option" });
            return;
        }

        this.props.advance();
    }

    render() {
        return (
            <QuestionContainer>
                <QuestionTextWrapper>{this.props.question.text}</QuestionTextWrapper>
                {this.state.error && <QuestionError>{this.state.error}</QuestionError>}

                <MultipleChoiceScrollField>
                    {this.props.question.answers.map((answer) => {
                        return (
                            <QuestionAnswerWrapper
                                onClick={() => this.toggleValue(answer.value)}
                                selected={this.state.selected.indexOf(answer.value) !== -1}
                                tooltip={answer.tooltip}
                                answer={answer}
                            ></QuestionAnswerWrapper>
                        );
                    })}
                    {this.props.other && <OtherElement onAnswerAdded={this.addAnswer}>Select Other</OtherElement>}
                </MultipleChoiceScrollField>
                <div className="my-8 float-right">
                    <Button onClick={this.advance}>Continue</Button>
                </div>
            </QuestionContainer>
        );
    }
}

export default MultipleAnswerQuestion;
