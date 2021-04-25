import React from "react";
import { Route, withRouter } from "react-router";
import DataModelTableQuestion from "./DataModelTableQuestion";
import FileDropQuestion from "./FileDropQuestion";

class DataQuestion extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.advanceFileDrop = this.advanceFileDrop.bind(this);
        this.state = { columns: [], uploadId: null, metadata: null };
    }

    advanceFileDrop() {
        this.props.history.push(`${this.props.match.url}/dataTable`);
    }

    notifyParent() {
        this.props.onChange && this.props.onChange({uploadId: this.state.uploadId, metadata: this.state.metadata})
    }

    render() {
        console.log(this.props.match);
        return (
            <>
                <Route path={`${this.props.match.path}/dataTable`}>
                    <DataModelTableQuestion
                        advance={this.props.advance}
                        columns={this.state.columns}
                        canAdvance={this.state.uploadId !== null}
                        onChange={(metadata) =>
                            this.setState({ metadata: metadata }, this.notifyParent)
                        }
                    ></DataModelTableQuestion>
                </Route>
                <Route path={this.props.match.path} exact>
                    <FileDropQuestion
                        advance={this.advanceFileDrop}
                        skip={this.props.advance}
                        api={this.props.api}
                        onColumnInfoReceived={(columns) =>
                            this.setState({ columns: columns })
                        }
                        onUploadIdReceived={(uploadId) =>
                            this.setState({ uploadId: uploadId }, this.notifyParent)
                        }
                    ></FileDropQuestion>
                </Route>
            </>
        );
    }
}

export default withRouter(DataQuestion);
