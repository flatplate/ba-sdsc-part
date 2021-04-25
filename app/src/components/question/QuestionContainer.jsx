import React from 'react';

class QuestionContainer extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div className="w-auto md:w-128 md:p-0 p-6">
                {this.props.children}
            </div>
        );
    }
}


export default QuestionContainer;