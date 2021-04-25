import React from "react";
import Card from "../Card";
import Select from "../Select";

class EvaluationSelectionCard extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <Select
                values={
                    this.props.evaluations
                        ? this.props.evaluations.map((evaluation) => ({
                              text: evaluation.name,
                              value: evaluation._id,
                          }))
                        : []
                }
                label="Evaluation Strategy"
                className="w-full"
                bold
                textSize="xl"
                defaultValue={this.props.value}
                onChange={(e) =>
                    this.props.onChange &&
                    this.props.onChange(this.props.evaluations.find((evaluation) => evaluation._id === e.target.value))
                }
            ></Select>
        );
    }
}

export default EvaluationSelectionCard;
