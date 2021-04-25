import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

class MetricSelectionBox extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div className="w-72 max-h-96 mb-10 bg-white absolute shadow-lg rounded border border-gray-200 divide-y px-6">
                <div className="text-gray-600 text-center p-2">Metrics</div>
                <div className="p-2">
                    <div className="space-y-2 my-2 max-h-72 overflow-y-scroll no-scrollbar-y">
                        {(!this.props.metrics ||
                            this.props.metrics.length === 0 ||
                            this.props.metrics[0].item !==
                                this.props.currentValue) && (
                            <div
                                className="w-full bg-secondary-600 text-white font-bold p-1 pl-4 hover:pl-3 rounded hover:bg-secondary-500 transition-all duration-300 cursor-pointer"
                                onClick={this.props.onCreate}
                            >
                                Create {this.props.currentValue}
                            </div>
                        )}
                        {this.props.metrics.map((metric) => (
                            <div className="w-full" key={metric.id_}>
                                <div className="w-4/5 inline-block pr-1">
                                    <div
                                        className="w-full bg-primary-600 text-white font-bold p-1 pl-4 hover:pl-3 rounded hover:bg-primary-400 transition-all duration-300  cursor-pointer"
                                        onClick={() =>
                                            this.props.onSelected &&
                                            this.props.onSelected(metric.item)
                                        }
                                    >
                                        {metric.item.name}
                                    </div>
                                </div>
                                <div className="w-1/5 h-full inline-block pl-1">
                                    <div className="w-full h-full bg-red-600 text-white font-bold p-1 pl-4 rounded hover:bg-red-500 transition-all duration-300 cursor-pointer" onClick={() => this.props.onDelete(metric.item)}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default MetricSelectionBox;
