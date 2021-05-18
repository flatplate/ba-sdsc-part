import React from 'react';

class QuestionError extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div className="xl:text-lg text-md m-6 -mt-8 whitespace-pre-wrap text-red-500">{this.props.children}</div>
        );
    }
}


export default QuestionError;