import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import TextInput from "../TextInput";
import MetricInput from "./MetricInput";
import Button from "../Button";
import MetricEffectRow from "./MetricEffectRow";
import { alertService } from "../../services/AlertService";

const defaultMetric = {
    metric: {name: ""},
    weight: 1,
    strategy: "min",
};

const defaultInitialMetricGroup = {
    fieldName: "default",
    metricEffects: [],
};

const defaultInitialMetricGroups = [{ ...defaultInitialMetricGroup }];

class NewQuestionMetricCard extends React.Component {
    constructor(props, context) {
        super(props, context);
        const initialMetricEffects =
            this.props.initialMetricEffectGroups &&
            this.props.initialMetricEffectGroups.map((m) => ({ ...m, id: Math.random().toString() }));

        this.state = { metricEffects: initialMetricEffects || defaultInitialMetricGroups };
        this.addMetricEffect = this.addMetricEffect.bind(this);
        this.getNecessaryMetricGroupNames = this.getNecessaryMetricGroupNames.bind(this);
    }

    setMetricEffects(metricEffects) {
        this.setState({ metricEffects: metricEffects });
        this.props.onChange && this.props.onChange(metricEffects);
    }

    transformMetricEffects(fun) {
        let newMetricEffects = fun(Array.from(this.state.metricEffects));
        this.setMetricEffects(newMetricEffects);
    }

    addMetricEffect(outerIndex) {
        console.log(outerIndex);
        this.transformMetricEffects((metricEffects) => {
            metricEffects[outerIndex].metricEffects.push({ ...defaultMetric, id: Math.random().toString() });
            return metricEffects;
        });
    }

    removeMetricEffect(outerIndex, innerIndex) {
        this.transformMetricEffects((metricEffects) => {
            metricEffects[outerIndex].metricEffects.splice(innerIndex, 1);
            return metricEffects;
        });
    }

    onMetricEffectNameChanged(newMetricName, outerIndex, innerIndex) {
        console.log("metricName");
        console.log(newMetricName);
        this.transformMetricEffects((metricEffects) => {
            metricEffects[outerIndex].metricEffects[innerIndex] = {
                ...metricEffects[outerIndex].metricEffects[innerIndex],
                metric: {name: newMetricName},
            };
            return metricEffects;
        });
    }

    setMetricWeight(weight, outerIndex, innerIndex) {
        this.transformMetricEffects((metricEffectGroups) => {
            try {
                metricEffectGroups[outerIndex].metricEffects[innerIndex].weight = parseFloat(weight);
            } catch {
                alertService.error("Weight is not valid");
            } finally {
                return metricEffectGroups;
            }
        });
    }

    setStrategy(strategy, outerIndex, innerIndex) {
        this.transformMetricEffects((metricEffects) => {
            metricEffects[outerIndex].metricEffects[innerIndex].strategy = strategy;
            return metricEffects;
        });
    }

    componentDidUpdate(oldProps) {
        const { type } = this.props.currentQuestionData;
        const { initialMetricEffectGroups } = this.props;
        const oldInitialMetricEffectGroups = oldProps.initialMetricEffectGroups;

        console.log("initialMetricEFfectGroups", initialMetricEffectGroups, oldInitialMetricEffectGroups);
        
        let newMetricEffects = this.state.metricEffects;
        let metricEffectsChanged = false;

        if (initialMetricEffectGroups && initialMetricEffectGroups !== oldInitialMetricEffectGroups) {
            console.log("Initial metric effects changed", initialMetricEffectGroups)
            newMetricEffects = initialMetricEffectGroups.map((m) => ({ ...m, id:  Math.random().toString() }));
            metricEffectsChanged = true;
        }

        const isDataQuestion = type === "Data Question";

        if (isDataQuestion && !this.props.currentEvaluationStrategy) {
            return;
        }

        const necessaryMetricGroups = this.getNecessaryMetricGroupNames();

        const necessaryMetricsLength = necessaryMetricGroups.length;
        const currentMetricsLength = newMetricEffects.length;

        if (necessaryMetricsLength < currentMetricsLength) {
            newMetricEffects = newMetricEffects.slice(0, necessaryMetricsLength);
            metricEffectsChanged = true;
        } else if (necessaryMetricsLength > currentMetricsLength) {
            let updatedMetricEffects = Array.from(newMetricEffects);
            for (let i = 0; i < necessaryMetricsLength - currentMetricsLength; i++) {
                updatedMetricEffects.push({ fieldName: "default", metricEffects: [] });
            }
            newMetricEffects = updatedMetricEffects;
            metricEffectsChanged = true;
        }

        for (let i = 0; i < newMetricEffects.length; i++) {
            if (newMetricEffects[i].fieldName !== necessaryMetricGroups[i]) {
                newMetricEffects[i].fieldName = necessaryMetricGroups[i];
                metricEffectsChanged = true;
            }
        }

        if (metricEffectsChanged) {
            console.log("metric effects changed", newMetricEffects)
            this.setState({ metricEffects: newMetricEffects });
        }
    }

    getNecessaryMetricGroupNames() {
        const { type } = this.props.currentQuestionData;
        const isDataQuestion = type === "Data Question";
        const isMatrixQuestion = type === "Matrix Question";
        const multipleQuestions = isDataQuestion || isMatrixQuestion;

        if (!multipleQuestions) {
            return ["default"];
        }

        if (isDataQuestion) {
            return this.props.currentEvaluationStrategy.outputs;
        }

        if (isMatrixQuestion) {
            return this.props.currentQuestionData.rows.map((row) => row.id);
        }
    }

    render() {
        return this.state.metricEffects.map((metricEffects, outerIndex) => (
            <div className="w-full p-6 shadow-md rounded-xl border border-gray-200 divide-y" key={metricEffects.fieldName}>
                <div className="text-xl font-bold w-full items-center mb-6">Metrics {metricEffects.fieldName}</div>
                {metricEffects.metricEffects.map((metricEffect, i) => (
                    <MetricEffectRow
                        metricEffect={metricEffect}
                        onMetricEffectNameChanged={(newName) => this.onMetricEffectNameChanged(newName, outerIndex, i)}
                        valueSupplier={() => this.props.api.getMetrics()}
                        onChange={(metric) => this.onMetricEffectNameChanged(metric, outerIndex, i)}
                        deleteMetric={(metric) => this.props.api.deleteMetric(metric)}
                        removeMetricEffect={() => this.removeMetricEffect(outerIndex, i)}
                        api={this.props.api}
                        key={metricEffect.id}
                        onWeightChange={(weight) => this.setMetricWeight(weight, outerIndex, i)}
                        onStrategyChange={(strategy) => this.setStrategy(strategy, outerIndex, i)}
                    />
                ))}
                <div className="p-6">
                    <Button onClick={() => this.addMetricEffect(outerIndex)}>Add Metric Effect</Button>
                </div>
            </div>
        ));
    }
}

export default NewQuestionMetricCard;
