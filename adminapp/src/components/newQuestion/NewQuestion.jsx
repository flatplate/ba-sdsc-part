import React from "react";
import { withRouter } from "react-router-dom";
import Button from "../Button";
import NewMatrixQuestionRow from "./NewMatrixQuestionRow";
import NewQuestionAnswerRow from "./NewQuestionAnswerRow";
import NewQuestionMetricCard from "./NewQuestionMetricCard";
import NewQuestionDataEvaluationCard from "./NewQuestionDataEvaluationCard";
import "react-mde/lib/styles/css/react-mde-all.css";
import ReactMde from "react-mde";
import MarkdownEditor from "./MarkdownEditor";



class NewQuestion extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            questionData: {
                _name: "",
                type: "",
                text: "",
                tooltip: "",
                rows: [],
                answers: [],
                evaluationStrategy: "",
                _metricEffects: [],
            },
            initialQuestionData: {
                _name: "",
                type: "",
                text: "",
                tooltip: "",
                rows: [],
                answers: [],
                evaluationStrategy: "",
                _metricEffects: [],
            },
            questionTypes: [],
            currentEvaluationStrategy: null,
            selectedTab: "write",
        };
        this.addAnswer = this.addAnswer.bind(this);
        this.addRow = this.addRow.bind(this);
        this.saveQuestion = this.saveQuestion.bind(this);
        this.api = this.props.api;
        this.onDataEvaluationStrategyChanged = this.onDataEvaluationStrategyChanged.bind(this);
    }

    componentDidMount() {
        this.loadQuestionTypes();
        const questionId = this.props.questionId || this.props.match.params.id;
        if (questionId) {
            this.loadQuestion(questionId);
        }
    }

    loadQuestion(questionId) {
        this.api
            .getQuestionById(questionId)
            .then((res) => res.data)
            .then((questionData) => {
                console.log("Got question data", JSON.stringify(questionData));
                if (!questionData.answers) {
                    questionData.answers = [];
                }
                if (!questionData.rows) {
                    questionData.rows = [];
                }
                this.setState({ questionData: questionData, initialQuestionData: questionData });
            });
    }

    setQuestionText(text) {
        this.state.questionData.text = text;
        this.setState({});
    }

    setQuestionName(name) {
        this.state.questionData._name = name;
        this.setState({});
    }

    setQuestionType(type) {
        this.state.questionData.type = type;
        this.setState({});
    }

    setQuestionTooltip(tooltip) {
        this.state.questionData.tooltip = tooltip;
        this.setState({});
    }

    setAnswerData(answerIndex, answerData) {
        this.state.questionData.answers[answerIndex] = answerData;
        this.setState({});
    }

    deleteAnswer(answerIndex) {
        this.state.questionData.answers = this.state.questionData.answers.filter((_, i) => i !== answerIndex);
        this.setState({});
    }

    answerUp(answerIndex) {
        if (answerIndex === 0) return;
        let answer = this.state.questionData.answers[answerIndex];
        this.state.questionData.answers[answerIndex] = this.state.questionData.answers[answerIndex - 1];
        this.state.questionData.answers[answerIndex - 1] = answer;
        this.setState({});
    }

    answerDown(answerIndex) {
        if (answerIndex === this.state.questionData.answers.length - 1) return;
        let answer = this.state.questionData.answers[answerIndex];
        this.state.questionData.answers[answerIndex] = this.state.questionData.answers[answerIndex + 1];
        this.state.questionData.answers[answerIndex + 1] = answer;
        this.setState({});
    }

    addAnswer() {
        this.state.questionData.answers.push({});
        this.setState({});
    }

    addRow() {
        this.state.questionData.rows.push({});
        this.setState({});
    }

    setRowData(rowIndex, rowData) {
        this.state.questionData.rows[rowIndex] = rowData;
        this.setState({});
    }

    deleteRow(rowIndex) {
        this.state.questionData.rows = this.state.questionData.rows.filter((_, i) => i !== rowIndex);
        this.setState({});
    }

    rowUp(rowIndex) {
        if (rowIndex === 0) return;
        let row = this.state.questionData.rows[rowIndex];
        this.state.questionData.rows[rowIndex] = this.state.questionData.rows[rowIndex - 1];
        this.state.questionData.rows[rowIndex - 1] = row;
        this.setState({});
    }

    rowDown(rowIndex) {
        if (rowIndex === this.state.questionData.rows.length - 1) return;
        let row = this.state.questionData.rows[rowIndex];
        this.state.questionData.rows[rowIndex] = this.state.questionData.rows[rowIndex + 1];
        this.state.questionData.rows[rowIndex + 1] = row;
        this.setState({});
    }

    loadQuestionTypes() {
        this.api &&
            this.api.getQuestionTypes().then((questionTypes) => {
                this.setQuestionType(questionTypes[0]);
                this.setState({ questionTypes: questionTypes });
            });
    }

    saveQuestion() {
        if (!this.api) {
            return;
        }

        if (this.state.questionData._id) {
            this.api.editQuestion(this.state.questionData).then(() => this.props.history.goBack());
            return;
        }
        this.api.createQuestion(this.state.questionData).then(() => this.props.history.goBack());
    }

    setMetricEffects(metricEffects) {
        const newQuestionData = {
            ...this.state.questionData,
            _metricEffects: metricEffects,
        };
        this.setState({ questionData: newQuestionData });
    }

    onDataEvaluationStrategyChanged(newStrategy) {
        const newQuestionData = {
            ...this.state.questionData,
            evaluationStrategy: newStrategy.name,
        };
        this.setState({ questionData: newQuestionData, currentEvaluationStrategy: newStrategy });
    }

    render() {
        console.log("Question data rows", JSON.stringify(this.state.questionData.rows));
        return (
            <div className="space-y-6 m-12">
                <div className="w-full p-6 shadow-md rounded-xl border border-gray-200 space-y-6">
                    <div className="text-2xl font-bold w-full items-center flex justify-between">
                        <div>
                            <label htmlFor="questionName" className="w-full block text-sm mb-2">
                                Question Name
                            </label>
                            <input
                                type="text"
                                name="questionName"
                                value={this.state.questionData._name}
                                placeholder="Question Name"
                                className="font-bold block text-2xl rounded border-gray-300"
                                onChange={(e) => this.setQuestionName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="questionType" className="w-full block text-sm mb-2">
                                Question Type
                            </label>
                            <select
                                className="rounded border-gray-300 w-80"
                                name="questionType"
                                onChange={(e) => this.setQuestionType(e.target.value)}
                            >
                                {this.state.questionTypes &&
                                    this.state.questionTypes.map((questionType) => (
                                        <option
                                            value={questionType}
                                            selected={questionType === this.state.questionData.type}
                                        >
                                            {questionType}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <Button onClick={this.saveQuestion}>Save</Button>
                    </div>

                    <div>
                        <label htmlFor="questionText" className="w-full block text-sm font-bold mb-2">
                            Question Text
                        </label>
                        <MarkdownEditor
                            value={this.state.questionData.text}
                            onChange={(e) => this.setQuestionText(e)}
                        />
                    </div>
                    <div>
                        <label htmlFor="questionTooltip" className="w-full block text-sm font-bold mb-2">
                            Question Tooltip
                        </label>
                        <MarkdownEditor
                            value={this.state.questionData.tooltip}
                            onChange={(e) => this.setQuestionTooltip(e)}
                        />
                    </div>
                </div>

                {/* Answers */}
                {this.state.questionData.type !== "Data Question" && (
                    <div className="w-full p-6 shadow-md rounded-xl border border-gray-200 divide-y">
                        <div className="text-xl font-bold w-full items-center mb-6">Answers</div>
                        {this.state.questionData.answers.map((answer, i) => (
                            <NewQuestionAnswerRow
                                onChange={(answerData) => this.setAnswerData(i, answerData)}
                                onDelete={() => this.deleteAnswer(i)}
                                onDown={() => this.answerDown(i)}
                                onUp={() => this.answerUp(i)}
                                state={answer}
                                key={answer.id}
                            />
                        ))}
                        <div className="p-6">
                            <Button onClick={this.addAnswer}>Add Answer</Button>
                        </div>
                    </div>
                )}

                {/* Data Question Information */}
                {this.state.questionData.type === "Data Question" && (
                    <NewQuestionDataEvaluationCard
                        evaluationStrategySupplier={(fun) => this.api.getDataEvaluationStrategies().then(fun)}
                        onChange={this.onDataEvaluationStrategyChanged}
                    />
                )}

                {/* Matrix Rows */}
                {this.state.questionData.type === "Matrix Question" && (
                    <div className="w-full p-6 shadow-md rounded-xl border border-gray-200 divide-y">
                        <div className="text-xl font-bold w-full items-center mb-6">Matrix Rows</div>
                        {this.state.questionData.rows.map((row, i) => (
                            <NewMatrixQuestionRow
                                onChange={(rowData) => this.setRowData(i, rowData)}
                                onDelete={() => this.deleteRow(i)}
                                onDown={() => this.rowDown(i)}
                                onUp={() => this.rowUp(i)}
                                state={row}
                            />
                        ))}
                        <div className="p-6">
                            <Button onClick={this.addRow}>Add Row</Button>
                        </div>
                    </div>
                )}

                {/* Metric Effects */}
                <NewQuestionMetricCard
                    api={this.api}
                    onChange={(metricEffects) => this.setMetricEffects(metricEffects)}
                    currentQuestionData={this.state.questionData}
                    currentEvaluationStrategy={this.state.currentEvaluationStrategy}
                    initialMetricEffectGroups={this.state.initialQuestionData._metricEffects}
                />
            </div>
        );
    }
}

export default withRouter(NewQuestion);
