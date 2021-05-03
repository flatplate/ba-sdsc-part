import React from "react";
import Card from "../Card";

class QuestionAnswer extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <Card>
                <h2 className="font-bold text-xl">Question: {this.props.questionAnswer.question._name}</h2>
                <hr></hr>
                <div className="px-6 space-y-2">
                    <div><span className="font-bold">Question text: </span>{this.props.questionAnswer.question.text}</div>
                    <div><span className="font-bold">Answer: </span>{JSON.stringify(this.props.questionAnswer.answer.data)}</div>
                </div>
            </Card>
        );
    }
}

export default QuestionAnswer;
