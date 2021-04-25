import React from "react";
import TextInput from "../TextInput";
import Fuse from "fuse.js";
import MetricSelectionBox from "./MetricSelectionBox";
import { alertService } from "../../services/AlertService";

class MetricInput extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            values: [],
            active: false,
            loading: true,
            fuse: null,
        };
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onChange = this.onChange.bind(this);
        this.reloadValues = this.reloadValues.bind(this);
        this.onCreate = this.onCreate.bind(this);
        this.onSelected = this.onSelected.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    reloadValues() {
        const fuseOptions = { keys: ["name"] };
        this.props.valueSupplier &&
            this.props.valueSupplier().then((values) => {
                this.setState({
                    fuse: new Fuse(values, fuseOptions),
                    values: values,
                    loading: false,
                });
            });
    }

    onFocus() {
        this.setState({ loading: true });
        this.reloadValues();
        this.setState({ active: true });
    }

    onBlur(e) {
        if (!e.currentTarget.contains(e.relatedTarget))
            this.setState({ active: false });
    }

    onChange(e) {
        this.setState({ inputValue: e.target.value });
        this.props.onChange(e.target.value);
    }

    getCurrentMetrics() {
        if (!this.props.inputValue || this.props.inputValue === "") {
            return this.state.values.map((value) => ({
                item: value,
                score: 1,
            }));
        }
        if (!this.state.fuse) {
            return [];
        }
        return this.state.fuse.search(this.props.inputValue);
    }

    onCreate() {
        this.props.api
            .createMetric(this.props.inputValue)
            .catch((error) => alertService.error(error.toString()));
        this.setState({ active: false });
    }

    onSelected(value) {
        this.setState({
            inputValue: value.name,
            currentItem: value,
            active: false,
        });
        this.props.onChange(value.name);
    }

    onDelete(metric) {
        this.props.onDelete(metric);
        this.reloadValues();
    }

    render() {
        return (
            <div onFocus={this.onFocus} onBlur={this.onBlur} tabIndex={0}>
                <TextInput
                    {...this.props}
                    onChange={this.onChange}
                    value={this.props.inputValue}
                />
                {this.state.active && (
                    <MetricSelectionBox
                        currentValue={this.props.inputValue}
                        metrics={this.getCurrentMetrics()}
                        onCreate={this.onCreate}
                        onSelected={this.onSelected}
                        onDelete={this.onDelete}
                    />
                )}
            </div>
        );
    }
}

export default MetricInput;
