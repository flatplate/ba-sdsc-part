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
            { [id]: newValue,  },
            () => this.props.onChange && this.props.onChange(this.state)
        );
    }

    render() {
        return (
            <div className="w-128 p-6">
                <QuestionTextWrapper>
                    Bitte tragen Sie Ihre Kontaktinformationen ein, damit wir Sie kontaktieren können
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
                        Ich akzeptiere dass meine Kontaktinformationen gespeichert werden und dass SDSC-BW diese Daten benutzen kann um mich zu kontaktieren
                    </CheckBoxWithLabel>
                </div>

                <div className="my-8 float-right">
                    <Button onClick={this.props.advance}>Weiter</Button>
                </div>
            </div>
        );
    }
}

export default ContactForm;
