import React from 'react';
import { Button } from "../button"
import { tooltipStore, TooltipHeader, TooltipText } from "../TooltipBar";

class QuestionAnswerWrapper extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
    }

    componentDidMount() {
        this.tooltipElement = this.getTooltipElement();
    }

    componentWillUnmount() {
        this.onMouseOut();
    }

    getTooltipElement() {
        return this.props.answer.tooltip;
    }

    onMouseOver() {
        this.props.answer.tooltip && tooltipStore.addTooltip(this.tooltipElement);
    }

    onMouseOut() {
        this.props.answer.tooltip && tooltipStore.removeTooltip(this.tooltipElement)
    }

    render() {
        return (
            <div className="w-full m-1 float-left">
                <div className="float-right">
                    <Button
                        outline={!this.props.primary && !this.props.selected}
                        onClick={this.props.onClick}
                        color={this.props.color || "primary"}
                        leftLabel={this.props.leftLabel}
                        onMouseOver={this.onMouseOver}
                        onMouseOut={this.onMouseOut}
                    >
                        {this.props.answer.text}
                    </Button>
                </div>
            </div>
        )
    }
}

export default QuestionAnswerWrapper;