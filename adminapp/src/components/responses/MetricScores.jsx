import React from "react";
import MetricScore from "./MetricScore";

class MetricScores extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div className="flex flex-row space-x-4">
                {this.props.metricScores.map((metricScore) => (
                    <MetricScore metricScore={metricScore} key={metricScore.name}/>
                ))}
            </div>
        );
    }
}

export default MetricScores;
