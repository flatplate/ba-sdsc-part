import React from "react";
import SurveyQuestionsTab from "./SurveyQuestionsTab";
import TextInput from "../TextInput";
import { alertService } from "../../services/AlertService";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Button from "../Button";
import SurveyQuestionCard from "./SurveyQuestionCard";
import { withRouter } from "react-router-dom";
import EvaluationSelectionCard from "./EvaluationSelectionCard";

class NewSurvey extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            surveyData: {
                name: "",
                questions: [],
                _evaluation: null,
            },
            questions: [],
            draggableHover: false,
            evaluations: [],
        };
        this.api = this.props.api;
        this.getQuestionById = this.getQuestionById.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.onDragUpdate = this.onDragUpdate.bind(this);
        this.saveSurvey = this.saveSurvey.bind(this);
        this.setEvaluation = this.setEvaluation.bind(this);
    }

    componentDidMount() {
        const surveyId = this.props.surveyId || this.props.match.params.id;
        if (surveyId) {
            this.loadSurvey(surveyId);
        }

        this.api
            .getQuestions()
            .then((questions) => {
                this.setState({ questions: questions });
            })
            .catch((error) => {
                alertService.error(error.message);
            });

        this.api
            .getEvaluations()
            .then((evaluations) => {
                evaluations.length > 0 && !this.state.surveyData._evaluation && this.setEvaluation(evaluations[0]);
                this.setState({ evaluations: evaluations })
            })
            .catch(() => alertService.error("Could not load evaluations"));
    }

    loadSurvey(surveyId) {
        this.api.getSurveyById(surveyId).then((surveyData) => {
            if (!surveyData.questions) {
                surveyData.questions = [];
            }
            surveyData.questions = surveyData.questions.map((question) => ({
                id: Math.random(),
                ...question,
            }));
            this.setState({ surveyData: surveyData });
        });
    }

    onDragEnd(result) {
        this.setState({ draggableHover: false });
        if (!result.destination) {
            return;
        }
        if (
            result.source.droppableId === "questionsListDroppable" &&
            result.destination.droppableId === "surveyDroppable"
        ) {
            const questionId = result.draggableId.split("_")[1];
            const question = this.getQuestionById(questionId);
            const surveyQuestion = this.createSurveyQuestionFromQuestion(question);
            this.addQuestion(surveyQuestion, result.destination.index);
        } else if (
            result.source.droppableId === "surveyDroppable" &&
            result.destination.droppableId === "questionsListDroppable"
        ) {
            this.removeQuestion(result.source.index);
        } else if (
            result.source.droppableId === "surveyDroppable" &&
            result.destination.droppableId === "surveyDroppable"
        ) {
            this.reorderQuestions(result.source.index, result.destination.index);
        }

        console.log(result);
    }

    reorderQuestions(fromIndex, toIndex) {
        let newSurveyQuestions = Array.from(this.state.surveyData.questions);
        const questionToReorder = newSurveyQuestions[fromIndex];
        newSurveyQuestions.splice(fromIndex, 1);
        newSurveyQuestions.splice(toIndex, 0, questionToReorder);
        this.setState({
            surveyData: {
                ...this.state.surveyData,
                questions: newSurveyQuestions,
            },
        });
    }

    removeQuestion(index) {
        let newSurveyQuestions = Array.from(this.state.surveyData.questions);
        newSurveyQuestions.splice(index, 1);
        this.setState({
            surveyData: {
                ...this.state.surveyData,
                questions: newSurveyQuestions,
            },
        });
    }

    onDragUpdate(result) {
        console.log("drag update");
        console.log(result);
        this.setState({
            draggableHover: result.destination && result.destination.droppableId === "surveyDroppable",
        });
    }

    addQuestion(question, index) {
        let newQuestions = Array.from(this.state.surveyData.questions);
        newQuestions.splice(index, 0, question);
        this.setState({
            surveyData: { ...this.state.surveyData, questions: newQuestions },
        });
    }

    createSurveyQuestionFromQuestion(question) {
        return {
            id: Math.random(),
            logic: [],
            question: question,
        };
    }

    getQuestionById(questionId) {
        const filteredQuestions = this.state.questions.filter((question) => question._id === questionId);
        if (filteredQuestions.length === 0) {
            return null;
        }
        return filteredQuestions[0];
    }

    onQuestionConditionsChange(conditions, index) {
        let questionCopy = { ...this.state.surveyData.questions[index] };
        questionCopy.logic = conditions;
        let newQuestions = Array.from(this.state.surveyData.questions);
        newQuestions[index] = questionCopy;
        this.setState({
            surveyData: { ...this.state.surveyData, questions: newQuestions },
        });
    }

    saveSurvey() {
        if (this.state.surveyData._id) {
            this.api
                .editSurvey(this.state.surveyData)
                .then(() => this.props.history.goBack())
                .catch((error) => alertService.error("There was a problem with saving the survey"));
            return;
        }

        this.api
            .createSurvey(this.state.surveyData)
            .then(() => this.props.history.goBack())
            .catch((error) => alertService.error(error));
    }

    setEvaluation(evaluation) {
        this.setState({surveyData: {...this.state.surveyData, _evaluation: evaluation}})
    }

    render() {
        return (
            <div className="w-auto space-y-6">
                <DragDropContext onDragEnd={this.onDragEnd} onDragUpdate={this.onDragUpdate}>
                    <div className="flex flex-row space-x-6 justify-between">
                        <div className="w-1/2">
                            <TextInput
                                label="Survey Name"
                                value={this.state.surveyData._name}
                                onChange={(e) =>
                                    this.setState({
                                        surveyData: {
                                            ...this.state.surveyData,
                                            _name: e.target.value,
                                        },
                                    })
                                }
                                bold
                                textSize="xl"
                            />
                        </div>
                        <div className="flex-grow">
                            <EvaluationSelectionCard
                                evaluations={this.state.evaluations}
                                value={this.state.surveyData._evaluation && this.state.surveyData._evaluation._id}
                                onChange={this.setEvaluation}
                            />
                        </div>
                        <div className="flex justify-end items-center">
                            <Button onClick={this.saveSurvey}>Save</Button>
                        </div>
                    </div>

                    <Droppable droppableId="surveyDroppable">
                        {(droppableProvided) => (
                            <div
                                ref={droppableProvided.innerRef}
                                {...droppableProvided.droppableProps}
                                className={`space-y-6 p-8 py-12 rounded-xl bg-gray-50 ${
                                    this.state.draggableHover && "bg-gray-100"
                                }`}
                            >
                                {this.state.surveyData.questions.length === 0 && (
                                    <div className="w-full text-center">Drag and drop the quesitons here</div>
                                )}
                                {this.state.surveyData.questions.map((question, index) => (
                                    <Draggable draggableId={"survey_" + question.id} index={index} key={question.id}>
                                        {(draggableProvided) => (
                                            <div
                                                {...draggableProvided.draggableProps}
                                                {...draggableProvided.dragHandleProps}
                                                ref={draggableProvided.innerRef}
                                            >
                                                <SurveyQuestionCard
                                                    question={question}
                                                    allQuestions={this.state.surveyData.questions}
                                                    onConditionsChanged={(conditions) =>
                                                        this.onQuestionConditionsChange(conditions, index)
                                                    }
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {droppableProvided.placeholder}
                            </div>
                        )}
                    </Droppable>
                    <SurveyQuestionsTab questions={this.state.questions} />
                </DragDropContext>
            </div>
        );
    }
}

export default withRouter(NewSurvey);
