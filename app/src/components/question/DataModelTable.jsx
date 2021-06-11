import React from "react";
import Scrollbar from "react-scrollbars-custom";
import Checkbox from "../Checkbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import QuestionTextWrapper from "./QuestionTextWrapper";

const types = [
    { text: "Numeric", value: "numeric" },
    { text: "Boolean", value: "boolean" },
    { text: "Categorical", value: "categorical" },
    { text: "Date", value: "date" },
    { text: "Datetime", value: "datetime" },
    { text: "File Path", value: "filePath" },
    { text: "Integer", value: "integer" },
    { text: "Reference", value: "reference" },
    { text: "Text", value: "text" },
    { text: "Time", value: "time" },
];

class DataModelTable extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            columns: this.props.columns.map((column) => ({
                influenceSource: false,
                influenceTarget: false,
                ...column,
            })),
        };
        this.notifyParentWithState();
        this.getDataTypeOnChangeHandler = this.getDataTypeOnChangeHandler.bind(
            this
        );
    }

    getDataTypeOnChangeHandler(index) {
        return (event) => {
            let columnsCopy = Array.from(this.state.columns);
            columnsCopy[index].type = event.target.value;
            this.setState({ columns: columnsCopy }, this.notifyParentWithState);
        };
    }

    getInfluenceSourceOnChangeHandler(index) {
        return (event) => {
            let columnsCopy = Array.from(this.state.columns);
            columnsCopy[index].influenceSource = event.target.checked;
            this.setState({ columns: columnsCopy }, this.notifyParentWithState);
        };
    }

    getInfluenceTargetOnChangeHandler(index) {
        return (event) => {
            let columnsCopy = Array.from(this.state.columns);
            columnsCopy[index].influenceTarget = event.target.checked;
            this.setState({ columns: columnsCopy }, this.notifyParentWithState);
        };
    }

    notifyParentWithState() {
        this.props.onChange && this.props.onChange(this.state)
    }

    render() {
        return (
            <div className="overflow-y-auto overflow-x-hidden h-96 w-256">
                <Scrollbar className="overflow-x-hidden w-256 h-96">
                    <div>
                        <table class="table-auto w-full text-center text-lg text-gray-700 font-light">
                            <thead>
                                <th>
                                    Spaltenname{" "}
                                    <FontAwesomeIcon icon={faInfoCircle} />{" "}
                                </th>
                                <th>
                                    Datentyp{" "}
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                </th>
                                <th>
                                    Einflussquelle{" "}
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                </th>
                                <th>
                                    Einflussziel{" "}
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                </th>
                            </thead>
                            <tbody>
                                {this.state.columns.map((column, index) => (
                                    <tr
                                        className={`hover:bg-gray-200 transition-all duration-200 ${
                                            index % 2 === 1 && "bg-gray-100"
                                        }`}
                                        key={index}
                                    >
                                        <td className="py-2">{column.name}</td>
                                        <td className="py-2">
                                            <select
                                                name="types"
                                                className="w-1/2"
                                                defaultValue={column.type}
                                                onChange={this.getDataTypeOnChangeHandler(
                                                    index
                                                )}
                                            >
                                                {types.map((type) => (
                                                    <option value={type.value}>
                                                        {type.text}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="py-2">
                                            <Checkbox onChange={this.getInfluenceSourceOnChangeHandler(index)} />
                                        </td>
                                        <td className="py-2">
                                            <Checkbox onChange={this.getInfluenceTargetOnChangeHandler(index)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Scrollbar>
            </div>
        );
    }
}

export default DataModelTable;
