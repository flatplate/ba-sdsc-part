import React from "react";
import { withRouter } from "react-router";
import Card from "../Card";
import MetricScores from "./MetricScores";
import QuestionAnswer from "./QuestionAnswer";
import {converter} from "../newQuestion/MarkdownEditor"

class Response extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { responseData: null };
    }

    componentDidMount() {
        const responseId = this.props.responseId || this.props.match.params.id;
        this.props.api
            .getResponseById(responseId)
            .then((responseData) => this.setState({ responseData: responseData }));
    }

    render() {
        return (
            <div className="space-y-12">
                <div className="w-full space-y-4">
                    <h2 className="font-bold text-2xl">Scores</h2>
                    <hr />
                    {this.state.responseData && <MetricScores metricScores={this.state.responseData.metricScores} />}
                </div>
                <div className="w-full space-y-4">
                    <h2 className="font-bold text-2xl">Result</h2>
                    <hr />
                    <Card>
                        {this.state.responseData && <div dangerouslySetInnerHTML={({__html: converter.makeHtml(this.state.responseData.surveyResult.resultText)})}></div>}
                    </Card>
                </div>
                <div className="w-full space-y-4">
                    <h2 className="font-bold text-2xl">Answers</h2>
                    <hr />
                    {this.state.responseData &&
                        this.state.responseData.answers.map(
                            (answer) =>
                                answer.answer.data && (
                                    <QuestionAnswer questionAnswer={answer} key={answer.question._id} />
                                )
                        )}
                </div>
            </div>
        );
    }
}

export default withRouter(Response);
