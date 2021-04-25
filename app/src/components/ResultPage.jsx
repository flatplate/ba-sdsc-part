import React from "react";
import QuestionTextWrapper from "./question/QuestionTextWrapper";

class ResultPage extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div className="w-128">
                <QuestionTextWrapper>{this.props.result}</QuestionTextWrapper>
            </div>
        );
    }
}

export default ResultPage;
