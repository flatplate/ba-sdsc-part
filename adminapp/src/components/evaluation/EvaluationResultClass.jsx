import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Button from "../Button";
import Card from "../Card";
import MarkdownEditor from "../newQuestion/MarkdownEditor";
import Select from "../Select";
import TextInput from "../TextInput";

class EvaluationResultClass extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <Card>
                <div className="flex justify-between">
                    <h3 className="text-xl font-bold">Result Class {this.props.index || ""}</h3>
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="text-xl text-red-500 hover:text-red-600 cursor-pointer"
                        onClick={this.props.onRemoveResultClass}
                    />
                </div>
                <hr />
                <h3 className="text-lg font-bold">Conditions</h3>
                {this.props.resultClass.conditions.map((condition, index) => (
                    <div className="flex flex-row">
                        <div className="w-1/3 flex-grow">
                            <Select
                                values={this.props.evaluationMetadata.metricNames.map((metricName) => ({
                                    text: metricName,
                                    value: metricName,
                                }))}
                                defaultValue={condition.metric}
                                key={condition.metric}
                                onChange={(e) => this.props.onConditionMetricNameChanged(index, e.target.value)}
                            />
                        </div>
                        <div className="w-1/4  px-2">
                            <Select
                                values={this.props.evaluationMetadata.allowedOperations.map((operation) => ({
                                    text: operation,
                                    value: operation,
                                }))}
                                defaultValue={condition.operation}
                                key={condition.operation}
                                onChange={(e) => this.props.onConditionOperationChanged(index, e.target.value)}
                            />
                        </div>
                        <div className="w-1/3 ">
                            <TextInput
                                defaultValue={condition.value}
                                type="number"
                                onChange={(e) => this.props.onConditionValueChanged(index, e.target.value)}
                            ></TextInput>
                        </div>
                        <div className="mx-6 items-center flex text-right text-xl">
                            <FontAwesomeIcon
                                icon={faTimes}
                                className="text-lg text-red-500 hover:text-red-600 cursor-pointer"
                                onClick={() => this.props.onConditionRemoved(index)}
                            />
                        </div>
                    </div>
                ))}
                <Button onClick={this.props.onConditionAdded}>Add Condition</Button>
                <hr />
                <h3 className="text-lg font-bold">Result Text</h3>
                <MarkdownEditor
                    onChange={(e) => this.props.onResultTextChanged(e)}
                    value={this.props.resultClass.resultText}
                />
            </Card>
        );
    }
}

export default EvaluationResultClass;
