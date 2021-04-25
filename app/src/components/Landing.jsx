import React from 'react';
import QuestionAnswerWrapper from './question/QuestionAnswerWrapper';
import QuestionTextWrapper from './question/QuestionTextWrapper';
import { Link } from "react-router-dom"

class Landing extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div className="w-128">
                <QuestionTextWrapper>
                    Welcome to SDSC-BW potential analysis readiness tool. This tool will help you determine how you find the best fit for your business
                </QuestionTextWrapper>
                <div>
                    <Link to="/survey">
                        <QuestionAnswerWrapper primary answer={{text: "Start new assessment"}} />
                    </Link>
                    <Link to="/password">
                        <QuestionAnswerWrapper answer={{text: "Continue with password"}} />
                    </Link>
                </div>
            </div>
        );
    }
}


export default Landing;