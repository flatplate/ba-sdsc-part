import React from 'react';

class MatrixQuestionRowText extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div className="items-center flex justify-center">
                {this.props.children}
            </div>
        );
    }
}

export default MatrixQuestionRowText;