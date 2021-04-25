import React from 'react';
import Checkbox from './Checkbox';

class CheckBoxWithLabel extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div className="w-f items-start flex p-2">
                <div className="flex items-center">
                    &#8203;
                <Checkbox
                        id={this.id}
                        name={this.props.name}
                        onChange={this.props.onChange}
                        value={this.props.value}
                    />
                </div>
                <label htmlFor={this.id} className="ml-3">
                    {this.props.children}
                </label>
            </div>
        )
    }
}

export default CheckBoxWithLabel;