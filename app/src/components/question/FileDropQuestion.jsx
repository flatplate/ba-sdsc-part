import React from "react";
import Dropzone from "react-dropzone";
import QuestionTextWrapper from "./QuestionTextWrapper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFileUpload,
    faCheckCircle,
    faSpinner,
    faCircleNotch,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "../button";
import { progressManager } from "../ProgressBar";

class FileDropQuestion extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { files: null, columnsReady: false };
        this.handleFileDropped = this.handleFileDropped.bind(this);
        this.continue = this.continue.bind(this);
    }

    updateFiles(files) {
        this.setState(
            { files: files },
            () => this.props.onChange && this.props.onChange(this.state.files)
        );
    }

    handleFileDropped(acceptedFiles) {
        if (acceptedFiles.length < 1) {
            // TODO show error maybe?
            return;
        }
        const { onColumnInfoReceived } = this.props;
        this.setState({ files: acceptedFiles, columnsReady: false });
        this.props.api
            .getDataTypes(acceptedFiles[0], (progressEvent) =>
                progressManager.setProgress(progressEvent.loaded / progressEvent.total)
            )
            .then((data) => {
                progressManager.setProgress(0);
                console.log(data);
                return data;
            })
            .then((res) => res.data)
            .then(onColumnInfoReceived)
            .then(() => this.setState({ columnsReady: true }))
            .catch((error) => console.error(error));
    }

    continue() {
        // TODO Do real file upload, make sure to do the progress also
        // Maybe check file size? Should probably checked in handleFileDropped
        const size = this.state.files[0].size;
        this.props.api
            .uploadDataFile(this.state.files[0], (progressEvent) => {
                console.log("Progress");
                console.log(progressEvent);
                progressManager.setProgress(progressEvent.loaded / progressEvent.total);
            })
            .then((data) => {
                progressManager.setProgress(1)
                setTimeout(() => progressManager.stopProgress(), 500)
                this.props.onUploadIdReceived(data.uploadId);
            })
            .catch((error) => console.error(error)); // TODO
        this.props.advance();
    }

    render() {
        let iconElement;
        if (this.state.files === null) {
            iconElement = (
                <FontAwesomeIcon
                    className="text-8xl w-full"
                    icon={faFileUpload}
                />
            );
        } else if (this.state.columnsReady) {
            iconElement = (
                <FontAwesomeIcon
                    className="text-8xl text-primary-400 w-full"
                    icon={faCheckCircle}
                />
            );
        } else {
            iconElement = (
                <FontAwesomeIcon
                    className="text-8xl text-primary-400 w-full"
                    icon={faCircleNotch}
                    spin
                />
            );
        }

        return (
            <div className="w-128">
                <QuestionTextWrapper>
                    Would you like to upload a sample dataset for a preliminary
                    analysis? Your data will not be saved. Only .csv files are
                    supported
                </QuestionTextWrapper>
                <div className="px-6">
                    <Dropzone onDrop={this.handleFileDropped} accept=".csv">
                        {({ getRootProps, getInputProps }) => (
                            <section className="mb-6">
                                <div
                                    className="cursor-pointer bg-gray-50 hover:text-gray-500 text-gray-400 transition-all duration-200 shadow-inner shadow-lg border border-gray-100 p-6 space-y-6"
                                    {...getRootProps()}
                                >
                                    <div className="w-full text-center">
                                        {iconElement}
                                    </div>
                                    <div className="w-full text-center text-lg">
                                        {this.state.files === null
                                            ? "Drag and drop a file or click here to upload"
                                            : this.state.files
                                                  .map((file) => file.name)
                                                  .join(", ")}
                                    </div>
                                    <input {...getInputProps()} />
                                </div>
                            </section>
                        )}
                    </Dropzone>
                    <div className="w-full m-2 float-left">
                        <div className="float-right">
                            <Button
                                onClick={this.continue}
                                disabled={!this.state.columnsReady}
                            >
                                Continue
                            </Button>
                        </div>
                    </div>
                    <div className="w-full m-2 float-left">
                        <div className="float-right">
                            <Button onClick={this.props.skip} outline>
                                Continue without Data
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default FileDropQuestion;
