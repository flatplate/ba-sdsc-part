import React from 'react';

class Checkbox extends React.Component {
    render() {
        return (
            <input
                id={this.props.id}
                className="text-primary-400 form-checkbox border-gray-400 h-6 w-6 rounded outline-none focus:ring-transparent"
                type="checkbox"
                name={this.props.name}
                onChange={this.props.onChange}
                value={this.props.value}
            />
        )
    }
}

export default Checkbox;