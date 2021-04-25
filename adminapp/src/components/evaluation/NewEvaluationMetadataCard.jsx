import React from "react";
import Button from "../Button";
import Card from "../Card";
import TextArea from "../TextArea";
import TextInput from "../TextInput";

class NewEvaluationMetadataCard extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <Card>
                <div className="flex flex-row">
                    <div className="flex-grow">
                        <TextInput
                            label="Evaluation Name"
                            className="flex-grow"
                            textSize="xl"
                            bold
                            onChange={this.props.onEvaluationNameChanged}
                            defaultValue={this.props.name || ""}
                        />
                    </div>
                    <div className="flex items-end mx-6">
                        <Button onClick={this.props.onSave}>Save</Button>
                    </div>
                </div>
                <TextArea label="Description" className="text-xl" onChange={this.props.onDescriptionChanged} value={this.props.description}/>
            </Card>
        );
    }
}

export default NewEvaluationMetadataCard;
