import React from 'react';
import Scrollbar from "react-scrollbars-custom";

class MultipleChoiceScrollField extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        if (React.Children.toArray(this.props.children).length > 6) {
            return (
                <div className="xl:h-96 h-72 border border-gray-100 overflow-x-hidden">
                    <Scrollbar>
                        <div className="m-6">
                            {this.props.children}
                        </div>
                    </Scrollbar>
                </div>
            )
        }
        return this.props.children;
    }
}

export default MultipleChoiceScrollField;