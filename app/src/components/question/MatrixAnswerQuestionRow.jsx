import React from 'react';
import { Button } from '../button';
import QuestionAnswer from './QuestionAnswer';
import MatrixQuestionRowText from './MatrixQuestionRowText';

class MatrixAnswerQuestionRow extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { selected: null };
    }

    render() {
        return (
            <div className={`grid grid-cols-${this.props.answers.length + 1}`}>
                <div className="font-bold text-center text-xl align-center flex justify-center">{this.props.row.text}</div>
                {this.props.answers.map((answer) => {
                    return (
                        <div className="content-center p-2 flex justify-center">
                            <Button
                                outline={this.state.selected !== answer.value}
                                onClick={() => this.setState({ selected: answer.value }, () => this.props.onChange && this.props.onChange(this.state.selected))}
                            >
                                {answer.text}
                            </Button>
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default MatrixAnswerQuestionRow;