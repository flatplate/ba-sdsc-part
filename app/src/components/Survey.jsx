import React from "react";
import { withRouter } from "react-router-dom";
import Question from "./question/Question";

class Survey extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { currentQuestionIndex: 0, survey: null, response: null };
        this.api = this.props.api;
        this.setQuestionAnswer = this.setQuestionAnswer.bind(this);
        this.advance = this.advance.bind(this);
        this.evaluateLogicStatement = this.evaluateLogicStatement.bind(this);
    }

    componentDidMount() {
        this.api.getActiveSurvey().then((survey) => {
            const response = {};
            survey.questions.forEach((surveyQuestion) => (response[surveyQuestion.question._id] = null));
            this.setState(
                {
                    survey: survey,
                    response: response,
                },
                this.props.history.push(`/survey/question/${survey.questions[0].question._id}`)
            );
        });
    }

    setQuestionAnswer(questionId, answerValue, callback) {
        let newResponse = { ...this.state.response };
        newResponse[questionId] = answerValue;
        this.setState({ response: newResponse }, callback);
    }

    getQuestionById(questionId) {
        const question = this.state.survey.questions.find(
            (surveyQuestion) => surveyQuestion.question._id === questionId
        );
        console.log(question);
        return question;
    }

    advance() {
        const questions = this.state.survey.questions;
        const currentQuestionId = this.props.match.params.questionId;
        const currentIndex = this.state.survey.questions.findIndex(
            (question) => question.question._id === currentQuestionId
        );
        for (let nextIndex = currentIndex + 1; nextIndex < questions.length; nextIndex++) {
            const possibleNextQuestion = questions[nextIndex];
            const actionsFromLogic = this.getActionsFromLogic(possibleNextQuestion.logic);

            if (actionsFromLogic.includes("finish")) {
                this.props.history.push("/");
                return;
            }

            if (!actionsFromLogic.includes("hide")) {
                this.props.history.push(`/survey/question/${possibleNextQuestion.question._id}`);
                return;
            }
        }
        this.finishSurvey();
    }

    finishSurvey() {
        this.api.postResponse(this.state.survey._id, this.state.response).then((data) => this.props.onResultReceived(data.result));
        this.props.history.push("/result")
        console.log("Survey finished");
    }

    getActionsFromLogic(logic) {
        return logic.filter((l) => l.conditions.every(this.evaluateLogicStatement)).map((l) => l.action);
    }

    evaluateLogicStatement({ question, operator, answer }) {
        const currentValue = this.state.response[question._id];
        console.log(`question ${question._id} value is ${currentValue} should be "${operator} ${answer}"`);
        switch (operator) {
            case "is":
                return currentValue === answer;
            case "!=": // TODO Fix this
                return currentValue !== answer;
            default:
                console.error("Unknown operator detected: " + operator);
                return false;
        }
    }

    render() {
        if (!(this.state.survey && this.props.match.params.questionId)) {
            return null;
        }
        const questionId = this.props.match.params.questionId;
        const surveyQuestion = this.getQuestionById(questionId);

        return (
            <div>
                <Question
                    question={surveyQuestion.question}
                    onChange={(value, callback) => this.setQuestionAnswer(questionId, value, callback)}
                    advance={this.advance}
                    key={questionId}
                    state={this.state.response[questionId]}
                    api={this.props.api}
                />
            </div>
        );
    }
}

export default withRouter(Survey);
