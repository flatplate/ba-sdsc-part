import React from "react";
import MatrixAnswerQuestionRow from "./MatrixAnswerQuestionRow";
import QuestionTextWrapper from "./QuestionTextWrapper";
import { Button } from "../button";
import MatrixQuestionRowText from "./MatrixQuestionRowText";
import QuestionContainer from "./QuestionContainer";
import QuestionError from "./QuestionError";

class MatrixAnswerQuestion extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { selected: {} };
        this.setSelectedAnswerForRow = this.setSelectedAnswerForRow.bind(this);
        this.setStateWithOnChange = this.setStateWithOnChange.bind(this);
        this.advance = this.advance.bind(this);
    }

    // TODO Implement "Please select at least one"
    // TODO Implement parent giving selected beforehand

    setSelectedAnswerForRow(rowId, answerValue) {
        this.state.selected[rowId] = answerValue;
        this.setStateWithOnChange({});
    }

    setStateWithOnChange(newState) {
        this.setState(
            newState,
            () =>
                this.props.onChange && this.props.onChange(this.state.selected)
        );
    }

    advance() {
        if (Object.keys(this.state.selected).length !== this.props.question.rows.length) {
            this.setState({error: "Please select all possible answers."});
            return;
        }

        this.props.advance();
    }

    render() {
        return (
            <QuestionContainer>
                <QuestionTextWrapper>
                    {this.props.question.text}
                </QuestionTextWrapper>
                {this.state.error && <QuestionError>{this.state.error}</QuestionError>}
                <div className="space-y-6">
                    {this.props.question.rows.map((row) => (
                        <MatrixAnswerQuestionRow
                            onChange={(newValue) => {
                                this.setSelectedAnswerForRow(row.id, newValue);
                            }}
                            answers={this.props.question.answers}
                            row={row}
                        >
                            <MatrixQuestionRowText>
                                {row.text}
                            </MatrixQuestionRowText>
                        </MatrixAnswerQuestionRow>
                    ))}
                </div>
                <div className="my-8 float-right">
                    <Button onClick={this.advance}>Continue</Button>
                </div>
            </QuestionContainer>
        );
    }
}

export default MatrixAnswerQuestion;
