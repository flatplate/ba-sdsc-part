import React from 'react';
import Button from '../Button';
import { alertService } from '../../services/AlertService'
import QuestionCard from './QuestionCard';
import { Link } from 'react-router-dom';

class Questions extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.api = this.props.api;
        this.state = { questions: [] }
        this.updateQuestions = this.updateQuestions.bind(this);
        this.deleteQuestion = this.deleteQuestion.bind(this);
    }

    componentDidMount() {
        this.updateQuestions();
    }

    updateQuestions() {
        this.api.getQuestions().then(questions => {
            console.log(questions);
            this.setState({ questions: questions })
        }).catch(error => {
            alertService.error(error.message);
        })
    }

    deleteQuestion(questionId) {
        this.api.deleteQuestion(questionId).then(this.updateQuestions);
    }

    render() {
        return (
            <div className="flex justify-center">
                <div className='w-128 space-y-12'>
                    <Link to="questions/new">
                        <Button>
                            New Question
                        </Button>
                    </Link>
                    {
                        this.state.questions.map(questionData => (
                            <QuestionCard question={questionData} deleteQuestion={() => this.deleteQuestion(questionData._id)}/>
                        ))
                    }
                </div>
            </div>
        )
    }
}

export default Questions;