import React from "react";
import TextInput from "../TextInput";
import { Button } from "../button";
import QuestionAnswerWrapper from "./QuestionAnswerWrapper";

class OtherElement extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { value: "Anderes" };
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    trigger() {
        this.setState({ triggered: true });
    }

    handleKeyDown(e) {
        console.log(e);
        if (e.key === "Enter") {
            this.props.onAnswerAdded &&
                this.props.onAnswerAdded(e.target.textContent);
            e.target.blur();
            this.setState({ value: "Anderes" });
        }
    }

    onBlur(e) {
        console.log("onBlur");
        console.log(e);
        if (e.target.textContent === "") {
            this.setState({value: "Anderes"})
        }
    }

    onSubmit() {
        this.props.onSubmit();
    }

    render() {
        return (
            <div className="w-full m-1 float-left">
                <div className="float-right">
                    <Button
                        outline
                        onClick={this.props.onClick}
                        color={this.props.color || "primary"}
                        leftLabel={this.props.leftLabel}
                        onMouseOver={this.onMouseOver}
                        onMouseOut={this.onMouseOut}
                    >
                        <div
                            contentEditable
                            onChange={this.contentChanged}
                            onFocus={(e) => {
                                this.setState({ value: "" });
                                document.execCommand("selectAll", false, null);
                            }}
                            className="break-normal outline-none"
                            onKeyDown={this.handleKeyDown}
                            onBlur={this.onBlur}
                        >
                            {this.state.value || "Schreiben Sie hier Ihre Antwort"}
                        </div>
                    </Button>
                </div>
            </div>
        );
    }
}

export default OtherElement;
