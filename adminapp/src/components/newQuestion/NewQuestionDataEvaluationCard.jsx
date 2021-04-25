import React from "react";
import { alertService } from "../../services/AlertService";

const defaultCurrentEvaluationStrategy = {};

class NewQuestionDataEvaluationCard extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            evaluationStrategies: [],
            currentEvaluationStrategy: defaultCurrentEvaluationStrategy,
        };
        this.onSelectChange = this.onSelectChange.bind(this);
    }

    onChange(newEvaluationStrategy) {
        this.props.onChange && this.props.onChange(newEvaluationStrategy);
    }

    componentDidMount() {
        this.loadEvaluationStrategies();
    }

    loadEvaluationStrategies() {
        this.props.evaluationStrategySupplier((evaluationStrategies) => {
            let updatedState = {};
            updatedState.evaluationStrategies = evaluationStrategies;
            if (
                this.state.currentEvaluationStrategy == defaultCurrentEvaluationStrategy &&
                this.props.initialStrategyName
            ) {
                updatedState.currentEvaluationStrategy = evaluationStrategies.find(
                    (strategy) => this.props.initialStrategyName === strategy.name
                );
                if (!this.state.currentEvaluationStrategy) {
                    alertService.error(
                        "Data evaluation strategy with the loaded name seems to not exists anymore: " +
                            this.props.initialStrategyName
                    );
                } else {
                    this.onChange(updatedState.currentEvaluationStrategy);
                }
            } else if (this.state.currentEvaluationStrategy == defaultCurrentEvaluationStrategy) {
                console.log("XD");
                updatedState.currentEvaluationStrategy = evaluationStrategies[0];
                this.onChange(evaluationStrategies[0]);
            }
            console.log(updatedState);
            this.setState(updatedState);
        });
    }

    onSelectChange(event) {
        let newEvaluationStrategy = this.state.evaluationStrategies.find(
            (strategy) => strategy.name === event.target.value
        );
        if (!newEvaluationStrategy) {
            alertService.error("Could not find the selected evaluation strategy.");
            return;
        }
        this.onChange(newEvaluationStrategy);
        this.setState({ currentEvaluationStrategy: newEvaluationStrategy });
    }

    render() {
        return (
            <div className="w-full p-6 shadow-md rounded-xl border border-gray-200 divide-y">
                <div className="text-xl font-bold w-full items-center mb-3">Evaluation Strategy</div>
                <div>
                    <select
                        className="rounded border-gray-300 w-full my-3"
                        defaultValue={this.state.currentEvaluationStrategy.name}
                        onChange={this.onSelectChange}
                    >
                        {this.state.evaluationStrategies &&
                            this.state.evaluationStrategies.map((evaluationStrategy) => (
                                <option
                                    value={evaluationStrategy.name}
                                    selected={evaluationStrategy.name === this.state.currentEvaluationStrategy.name}
                                    key={evaluationStrategy.name}
                                >
                                    {evaluationStrategy.visibleName}
                                </option>
                            ))}
                    </select>
                </div>
                <div className="space-y-6">
                    <div className="w-full flex justify-center p-6">
                        <div className="w-1/3 font-bold text-lg inline-block">Name</div>
                        <div className="w-2/3 text-lg inline-block">
                            {this.state.currentEvaluationStrategy.visibleName}
                        </div>
                    </div>
                    <div className="w-full flex justify-center bg-gray-50 p-6">
                        <div className="w-1/3 font-bold text-lg inline-block">Description</div>
                        <div className="w-2/3 text-lg inline-block">
                            {this.state.currentEvaluationStrategy.description}
                        </div>
                    </div>
                    <div className="w-full flex justify-center p-6">
                        <div className="w-1/3 font-bold text-lg inline-block">Author</div>
                        <div className="w-2/3 text-lg inline-block">{this.state.currentEvaluationStrategy.author}</div>
                    </div>
                    <div className="w-full flex justify-center bg-gray-50 p-6">
                        <div className="w-1/3 font-bold text-lg inline-block">Outputs</div>
                        <div className="w-2/3 text-lg inline-block">
                            {this.state.currentEvaluationStrategy.outputs &&
                                this.state.currentEvaluationStrategy.outputs.join(", ")}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default NewQuestionDataEvaluationCard;
