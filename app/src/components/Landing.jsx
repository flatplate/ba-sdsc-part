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
                    Wilkommen zu dem SDSC-BW Potentialanalysebereitschaftstool. Dieses Tool wird Ihnen helfen die beste Loesung fuer Ihr Unternehmen zu finden.
                </QuestionTextWrapper>
                <div>
                    <Link to="/survey">
                        <QuestionAnswerWrapper primary answer={{text: "Ein neues Assessment starten"}} />
                    </Link>
                </div>
            </div>
        );
    }
}


export default Landing;