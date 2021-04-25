import React from 'react';

class Card extends React.Component {
    render() {
        const { className, ...newProps } = this.props;
        return (
            <div className={`w-full p-6 shadow-md rounded-xl border bg-white border-gray-200 space-y-4 ${className}`} {...newProps}>
                {this.props.children}
            </div>
        );
    }
}

export default Card;