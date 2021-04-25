import React from 'react';
import Button from './Button';

class SelectableButton extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {selected: false}
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({selected: !this.state.selected}, () => {
            this.props.onChange && this.props.onChange(this.state.selected);
        });
    }

    render() {
        return (
            <Button color={this.props.color} outline={!this.state.selected} onClick={this.toggle}>
                {this.props.children}
            </Button>
        )
    }
}

export default SelectableButton;