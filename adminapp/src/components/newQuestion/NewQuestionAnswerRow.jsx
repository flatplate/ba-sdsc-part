import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCaretUp, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import MarkdownEditor from "./MarkdownEditor";

class NewQuestionAnswerRow extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { text: "", value: "", tooltip: "", numericalValue: 0 };
    }

    componentDidMount() {
        this.props.state &&
            this.setState(this.props.state, () => this.props.onChange && this.props.onChange(this.state));
    }

    componentDidUpdate(prevProps) {
        if (prevProps.state !== this.props.state) {
            this.setState(this.props.state);
        }
    }

    updateStateNotifyParent(state) {
        this.setState(state, () => {
            this.props.onChange && this.props.onChange(this.state);
        });
    }

    render() {
        return (
            <div className="w-full flex">
                <div className="w-5/12 p-6 space-y-6">
                    <input
                        type="text"
                        placeholder="Answer Text"
                        className="w-full rounded border-gray-300"
                        value={this.state.text}
                        onChange={(e) =>
                            this.updateStateNotifyParent({
                                text: e.target.value,
                            })
                        }
                    />
                    <input
                        type="text"
                        placeholder="Answer Value"
                        className="w-full rounded border-gray-300"
                        value={this.state.value}
                        onChange={(e) =>
                            this.updateStateNotifyParent({
                                value: e.target.value,
                            })
                        }
                    />
                    <div className="items-center flex">
                        <div className="inline-block w-1/3 text-gray-500">Numerical Value:</div>
                        <input
                            type="range"
                            min="0"
                            value={this.state.numericalValue}
                            max="1"
                            step="0.01"
                            className="inline-block w-1/2"
                            id="myRange"
                            onChange={(e) =>
                                this.updateStateNotifyParent({
                                    numericalValue: parseFloat(e.target.value),
                                })
                            }
                        ></input>
                        <div className="text-2xl w-1/6 text-gray-500 text-center inline-block">
                            {this.state.numericalValue}
                        </div>
                    </div>
                </div>
                <div className="w-1/2 p-6">
                    <MarkdownEditor
                        value={this.state.tooltip}
                        onChange={(e) =>
                            this.updateStateNotifyParent({
                                tooltip: e,
                            })
                        }
                        maxEditorHeight="95px"
                        maxPreviewHeight="95px"
                        classes={{preview: "h-6"}}
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

export default NewQuestionAnswerRow;
