import React from "react";
import QuestionTextWrapper from "./question/QuestionTextWrapper";
import { Button } from "./button";

class ResultPage extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div className="w-128">
                <QuestionTextWrapper>{this.props.result}</QuestionTextWrapper>
                <a href="https://www.sdsc-bw.de/Kontakt/">
                    <Button>Contact Us</Button>
                </a>
            </div>
        );
    }
}

export default ResultPage;
