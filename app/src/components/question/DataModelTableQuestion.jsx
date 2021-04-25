import React from "react";
import DataModelTable from "./DataModelTable";
import { Button } from "../button";
import QuestionTextWrapper from "./QuestionTextWrapper"

class DataModelTableQuestion extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div className="w-256">
                <div className="text-center">
                    <QuestionTextWrapper>
                        {`For a better analysis, please specify further points${this.props.canAdvance ? "." : " while the file is being uploaded"}`}
                    </QuestionTextWrapper>
                    <DataModelTable
                        columns={this.props.columns}
                        onChange={this.props.onChange}
                    ></DataModelTable>
                    <div className="my-8 float-right">
                        <Button
                            onClick={this.props.advance}
                            disabled={!this.props.canAdvance}
                        >
                            Continue
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default DataModelTableQuestion;
