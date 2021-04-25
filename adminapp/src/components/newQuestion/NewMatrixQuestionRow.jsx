import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTimes,
    faCaretUp,
    faCaretDown,
} from "@fortawesome/free-solid-svg-icons";

class NewMatrixQuestionRow extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { text: "", id: "", tooltip: "" };
        this.props.state && this.setState(this.props.state);
    }

    componentDidMount() {
        this.props.state && this.setState(this.props.state)
        // this.props.onChange && this.props.onChange(this.state);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.state !== this.props.state) {
            console.log("Matrix question row state updated by parent", JSON.stringify(this.props.state))
            this.setState(this.props.state);
        }
    }

    updateStateNotifyParent(state) {
        console.log("Matrix row update state notify parent", state)
        this.setState(state, () => {
            this.props.onChange && this.props.onChange(this.state);
        });
    }

    render() {
        return (
            <div className="w-full flex">
                <div className="w-5/12 p-6 space-y-6">
                    <div>
                        <label className="text-sm font-bold block mb-2">
                            Row Text
                        </label>
                        <input
                            type="text"
                            placeholder="Row Text"
                            className="w-full rounded border-gray-300"
                            value={this.state.text || ""}
                            onChange={(e) =>
                                this.updateStateNotifyParent({
                                    text: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div>
                        <label className="text-sm font-bold block mb-2">
                            Row Id
                        </label>
                        <input
                            type="text"
                            placeholder="Row Id"
                            className="w-full rounded border-gray-300"
                            value={this.state.id || ""}
                            onChange={(e) =>
                                this.updateStateNotifyParent({
                                    id: e.target.value,
                                })
                            }
                        />
                    </div>
                </div>
                <div className="w-1/2 p-6 flex-col flex">
                    <label className="text-sm font-bold block mb-2">
                        Row Tooltip
                    </label>
                    <textarea
                        type="textarea"
                        placeholder="Row Tooltip"
                        className="flex-grow w-full rounded border-gray-300"
                        value={this.state.tooltip || ""}
                        onChange={(e) =>
                            this.updateStateNotifyParent({
                                tooltip: e.target.value,
                            })
                        }
                    />
                </div>

                <div className="w-1/12 p-6 flex flex-col justify-around">
                    <div className="w-full">
                        <FontAwesomeIcon
                            icon={faTimes}
                            className="text-red-400 hover:text-red-500 cursor-pointer text-xl"
                            onClick={this.props.onDelete}
                        />
                    </div>
                    <div className="w-full">
                        <FontAwesomeIcon
                            icon={faCaretUp}
                            className="text-primary-600 hover:text-primary-400 cursor-pointer text-xl"
                            onClick={this.props.onUp}
                        />
                    </div>
                    <div className="w-full">
                        <FontAwesomeIcon
                            icon={faCaretDown}
                            className="text-primary-600 hover:text-primary-400 cursor-pointer text-xl"
                            onClick={this.props.onDown}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default NewMatrixQuestionRow;
