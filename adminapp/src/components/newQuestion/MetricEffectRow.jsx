import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import MetricInput from "./MetricInput";
import TextInput from "../TextInput";

class MetricEffectRow extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div className="w-full p-0 m-0">
                <div className="w-1/4 inline-block p-3">
                    <MetricInput
                        placeholder="Metric Name"
                        inputValue={this.props.metricEffect.metric.name}
                        valueSupplier={this.props.valueSupplier}
                        onChange={(metric) =>
                            this.props.onMetricEffectNameChanged(metric)
                        }
                        api={this.props.api}
                        onDelete={(metric) =>
                            this.props.deleteMetric(metric.name)
                        }
                    />
                </div>
                <div className="w-1/4 inline-block  p-3">
                    <TextInput
                        placeholder="Weight"
                        type="number"
                        defaultValue={this.props.metricEffect.weight || 1}
                        onChange={(e) =>
                            this.props.onWeightChange &&
                            this.props.onWeightChange(e.target.value)
                        }
                    />
                </div>
                <div className="w-5/12 inline-block p-3">
                    <select
                        name="strategy"
                        id="strategy"
                        className="w-full rounded border-gray-300"
                        defaultValue={this.props.metricEffect.strategy}
                        onChange={(e) =>
                            this.props.onStrategyChange(e.target.value)
                        }
                    >
                        <option value="min">Min</option>
                        <option value="max">Max</option>
                        <option value="avg">Average</option>
                        <option value="first">First</option>
                        <option value="last">Last</option>
                    </select>
                    {/* <TextInput placeholder="Strategy" defaultValue="alskjdhf" /> */}
                </div>
                <div className="w-1/12 inline-block p-3 text-center">
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="text-red-500 hover:text-red-300 cursor-pointer text-xl transition-all duration-200"
                        onClick={this.props.removeMetricEffect}
                    />
                </div>
            </div>
        );
    }
}

export default MetricEffectRow;
