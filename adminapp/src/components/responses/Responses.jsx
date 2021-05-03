import React from "react";
import { Link } from "react-router-dom";
import ResponseCard from "./ResponseCard";

class Responses extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { responses: [] };
    }

    componentDidMount() {
        this.props.api && this.props.api.getResponses().then((responses) => this.setState({ responses: responses }));
    }

    render() {
        return (
            <div className="flex justify-center">
                <div className="w-256 space-y-12">
                    {this.state.responses.map((response) => (
                        <div>
                            <Link to={`responses/${response._id}`}>
                                <ResponseCard response={response} />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default Responses;
