import React from 'react';

class QuestionAnswer extends React.Component {
    render() {
        return (
            <>
                {this.props.children}
            </>
        )
    }
}

export default QuestionAnswer;