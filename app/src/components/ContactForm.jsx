import React from "react";
import CheckBoxWithLabel from "./CheckBoxWithLabel";
import QuestionTextWrapper from "./question/QuestionTextWrapper";
import TextInput from "./TextInput";
import { Button } from "./button";

class ContactForm extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    setNewValue(id, newValue) {
        this.setState(
            { [id]: newValue },
            () => this.props.onChange && this.props.onChange(this.state)
        );
    }

    render() {
        return (
            <div className="w-128 p-6">
                <QuestionTextWrapper>
                    Please fill out your contact information so that we can
                    reach you
                </QuestionTextWrapper>
                <div className="px-6 space-y-8">
                    {this.props.question.answers.map((answer) => (
                        <TextInput
                            onChange={(event) =>
                                this.setNewValue(
                                    answer.value,
                                    event.target.value
                                )
                            }
                            type={answer.type || "text"}
                        >
                            {answer.text}
                        </TextInput>
                    ))}
                    <CheckBoxWithLabel
                        id="legalstuff"
                        name="legalstuff"
                        onChange={(val) =>
                            this.setState({ legalstuff: val.target.checked })
                        }
                    >
                        I accept that my contact information will be saved and
                        SDSC-BW can contact me using this information (If more
                        info needed will just change this
                    </CheckBoxWithLabel>
                </div>

                <div className="my-8 float-right">
                    <Button onClick={this.props.advance}>Continue</Button>
                </div>
            </div>
        );
    }
}

export default ContactForm;
