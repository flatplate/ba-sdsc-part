import React from "react";
import NewEvaluationMetadataCard from "./NewEvaluationMetadataCard";
import Button from "../Button";
import EvaluationResultClass from "./EvaluationResultClass";
import { withRouter } from "react-router";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

class NewEvaluation extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            evaluationData: { name: "", description: "", resultClasses: [] },
            evaluationMetadata: { metricNames: [], allowedOperations: [] },
        };
        this.addResultClass = this.addResultClass.bind(this);
        this.setEvaluationName = this.setEvaluationName.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
    }

    componentDidMount() {
        const evaluationId = this.props.evaluationId || this.props.match.params.id;
        console.log("Evaluation Id", evaluationId);
        if (evaluationId) {
            this.loadEvaluation(evaluationId);
        }

        this.props.api
            .getEvaluationMetadata()
            .then((evaluationMetadata) => this.setState({ evaluationMetadata: evaluationMetadata }));
    }

    loadEvaluation(id) {
        this.props.api
            .getEvaluationById(id)
            .then((evaluationData) =>
                this.setState({
                    evaluationData: {
                        ...evaluationData,
                        resultClasses: evaluationData.resultClasses.map((resultClass) => ({
                            ...resultClass,
                            id: Math.random().toString(),
                        })),
                    },
                })
            );
    }

    addResultClass() {
        const defaultResultClass = { conditions: [], resultText: "", id: Math.random().toString() };
        this.setState({
            evaluationData: {
                ...this.state.evaluationData,
                resultClasses: [...this.state.evaluationData.resultClasses, defaultResultClass],
            },
        });
    }

    removeResultClass(index) {
        this.setState({
            evaluationData: {
                ...this.state.evaluationData,
                resultClasses: this.state.evaluationData.resultClasses.filter((_, i) => i !== index),
            },
        });
    }

    transformResultClass(index, fun) {
        const currentResultClass = { ...this.state.evaluationData.resultClasses[index] };
        const newResultClass = fun(currentResultClass);
        const newResultClasses = Array.from(this.state.evaluationData.resultClasses);
        newResultClasses[index] = newResultClass;
        this.setState({ evaluationData: { ...this.state.evaluationData, resultClasses: newResultClasses } });
    }

    addCondition(index) {
        const defaultCondition = {
            metric: this.state.evaluationMetadata.metricNames[0],
            operation: this.state.evaluationMetadata.allowedOperations[0],
            value: "0",
        };
        this.transformResultClass(index, (resultClass) => ({
            ...resultClass,
            conditions: [...resultClass.conditions, defaultCondition],
        }));
    }

    removeCondition(resultClassIndex, conditionIndex) {
        this.transformResultClass(resultClassIndex, (resultClass) => ({
            ...resultClass,
            conditions: resultClass.conditions.filter((_, i) => i !== conditionIndex),
        }));
    }

    onConditionMetricNameChanged(resultClassIndex, conditionIndex, newMetricName) {
        this.transformResultClass(resultClassIndex, (resultClass) => {
            resultClass.conditions[conditionIndex].metric = newMetricName;
            return resultClass;
        });
    }

    onConditionOperationChanged(resultClassIndex, conditionIndex, newOperation) {
        this.transformResultClass(resultClassIndex, (resultClass) => {
            resultClass.conditions[conditionIndex].operation = newOperation;
            return resultClass;
        });
    }

    onConditionValueChanged(resultClassIndex, conditionIndex, newValue) {
        this.transformResultClass(resultClassIndex, (resultClass) => {
            resultClass.conditions[conditionIndex].value = newValue;
            return resultClass;
        });
    }

    onResultTextChanged(resultClassIndex, newResultText) {
        this.transformResultClass(resultClassIndex, (resultClass) => ({
            ...resultClass,
            resultText: newResultText,
        }));
    }

    setEvaluationName(newEvaluationName) {
        this.setState({ evaluationData: { ...this.state.evaluationData, name: newEvaluationName } });
    }

    setEvaluationDescription(newDescription) {
        this.setState({ evaluationData: { ...this.state.evaluationData, description: newDescription } });
    }

    onSave() {
        if (!this.props.api) {
            return;
        }

        if (this.state.evaluationData._id) {
            console.log("Edit evaluation");
            this.props.api.editEvaluation(this.state.evaluationData).then(() => this.props.history.goBack());
            return;
        }
        this.props.api.createEvaluation(this.state.evaluationData).then(() => this.props.history.goBack());
    }

    reorderResultClasses(fromIndex, toIndex) {
        let newResultClasses = Array.from(this.state.evaluationData.resultClasses);
        const resultClassToReorder = newResultClasses[fromIndex];
        newResultClasses.splice(fromIndex, 1);
        newResultClasses.splice(toIndex, 0, resultClassToReorder);
        this.setState({
            evaluationData: {
                ...this.state.evaluationData,
                resultClasses: newResultClasses,
            },
        });
    }

    onDragEnd(result) {
        console.log(result);
        if (!result.destination) {
            return;
        }
        if (
            result.source.droppableId === "resultClassDroppable" &&
            result.destination.droppableId === "resultClassDroppable"
        ) {
            this.reorderResultClasses(result.source.index, result.destination.index);
        }

        console.log(result);
    }

    render() {
        return (
            <div className="space-y-6">
                <NewEvaluationMetadataCard
                    onEvaluationNameChanged={(e) => this.setEvaluationName(e.target.value)}
                    onDescriptionChanged={(e) => this.setEvaluationDescription(e.target.value)}
                    name={this.state.evaluationData.name}
                    description={this.state.evaluationData.description}
                    onSave={this.onSave}
                />
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable droppableId="resultClassDroppable">
                        {(droppableProvided) => (
                            <div
                                ref={droppableProvided.innerRef}
                                {...droppableProvided.droppableProps}
                                className="space-y-6"
                            >
                                {this.state.evaluationData.resultClasses.map((resultClass, i) => (
                                    <Draggable index={i} draggableId={`i${resultClass.id}`} key={`i${resultClass.id}`}>
                                        {(draggableProvided) => (
                                            <div
                                                {...draggableProvided.draggableProps}
                                                {...draggableProvided.dragHandleProps}
                                                ref={draggableProvided.innerRef}
                                            >
                                                <EvaluationResultClass
                                                    key={resultClass.id}
                                                    resultClass={resultClass}
                                                    onRemoveResultClass={() => this.removeResultClass(i)}
                                                    evaluationMetadata={this.state.evaluationMetadata}
                                                    onConditionAdded={() => this.addCondition(i)}
                                                    onConditionRemoved={(conditionIndex) =>
                                                        this.removeCondition(i, conditionIndex)
                                                    }
                                                    onConditionMetricNameChanged={(conditionIndex, newMetricName) =>
                                                        this.onConditionMetricNameChanged(
                                                            i,
                                                            conditionIndex,
                                                            newMetricName
                                                        )
                                                    }
                                                    onConditionOperationChanged={(conditionIndex, newOperation) =>
                                                        this.onConditionOperationChanged(
                                                            i,
                                                            conditionIndex,
                                                            newOperation
                                                        )
                                                    }
                                                    onConditionValueChanged={(conditionIndex, newValue) =>
                                                        this.onConditionValueChanged(i, conditionIndex, newValue)
                                                    }
                                                    onResultTextChanged={(newResultText) =>
                                                        this.onResultTextChanged(i, newResultText)
                                                    }
                                                    index={i + 1}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {droppableProvided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                <Button onClick={this.addResultClass}>Add Result Class</Button>
            </div>
        );
    }
}

export default withRouter(NewEvaluation);
