import React from 'react';
import SingleAnswerMultipleChoiceQuestion from './SingleAnswerMultipleChoiceQuestion';
import MultipleAnswerQuestion from './MultipleAnswerQuestion';
import OrderedMultipleAnswerQuestion from './OrderedMultipleAnswerQuestion';
import MatrixAnswerQuestion from './MatrixAnswerQuestion';
import DataQuestion from './DataQuestion';
import ContactForm from '../ContactForm';

class Question extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        console.log(this.props.question.type);
        switch (this.props.question.type) {
            case 'Single Answer Question':
                return <SingleAnswerMultipleChoiceQuestion {...this.props} />;
            case 'Single Answer Question With Other':
                return <SingleAnswerMultipleChoiceQuestion {...this.props} other />;
            case 'Multiple Answer Question':
                return <MultipleAnswerQuestion {...this.props} />;
            case 'Multiple Answer Question With Other':
                return <MultipleAnswerQuestion {...this.props} other />;
            case 'Multiple Answer Ordered Question':
                return <OrderedMultipleAnswerQuestion {...this.props} />;
            case 'Multiple Answer Ordered Question With Other':
                return <OrderedMultipleAnswerQuestion {...this.props} other />;
            case 'Matrix Question':
                return <MatrixAnswerQuestion {...this.props} />;
            case 'Data Question':
                return <DataQuestion {...this.props} />;
            case 'Contact Form Question':
                return <ContactForm {...this.props} />;
            default:
                return <pre>{JSON.stringify(this.props.question, null, 2)}</pre>;
        }
        return null;
    }
}

export default Question;
