import React from "react";
import Card from "../Card";

class MetricScore extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <Card className="flex-grow items-center justify-center text-center">
                <div className="block w-full font-bold text-xl">{this.props.metricScore.metric.name}</div>
                <div className="flex w-full justify-center">
                    <div className="rounded-full w-24 h-24 bg-gradient-to-tr hover:bg-gradient-to-r from-primary-500 to-secondary-500 items-center flex justify-center">
                        <div className="rounded-full w-16 h-16 bg-white text-center text-3xl text-secondary-500 flex items-center justify-center font-bold">
                            <p className="text-transparent bg-clip-text bg-gradient-to-tr hover:bg-gradient-to-r from-primary-500 to-secondary-500 ">
                                {this.props.metricScore.score * 100}
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        );
    }
}

export default MetricScore;
