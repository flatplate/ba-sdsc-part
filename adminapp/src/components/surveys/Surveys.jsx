import React from 'react';
import Button from "../Button";
import { Link } from "react-router-dom";
import { alertService } from "../../services/AlertService";
import SurveyCard from './SurveyCard';

class Surveys extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.api = this.props.api;
        this.state = { surveys: [] }
        this.setActive = this.setActive.bind(this);
        this.setInactive = this.setInactive.bind(this);
        this.updateSurveys = this.updateSurveys.bind(this);
    }

    componentDidMount() {
        this.updateSurveys();
    }

    updateSurveys() {
        this.api.getSurveys().then(surveys => {
            this.setState({ surveys: surveys })
        }).catch(error => {
            alertService.error(error.message);
        })
    }

    setActive(surveyId) {
        this.api.setActiveSurvey(surveyId).then(() => {
            let newSurveys = this.state.surveys.map(survey => ({...survey, active: false}))
            newSurveys.find(survey => survey._id === surveyId).active = true;
            this.setState({surveys: newSurveys});
        })
    }

    setInactive(surveyId) {
        this.api.setInactiveSurvey(surveyId).then(() => {
            let newSurveys = this.state.surveys.map(survey => ({...survey, active: false}))
            this.setState({surveys: newSurveys});
        })
    }

    render() {
        return (
            <div className="flex justify-center">
                <div className='w-128 space-y-12'>
                    <Link to="surveys/new">
                        <Button>
                            New Survey
                        </Button>
                    </Link>
                    {
                        this.state.surveys.map(surveyData => (
                            <SurveyCard survey={surveyData} setActive={this.setActive} setInactive={this.setInactive} onDelete={(id) => this.props.api.deleteSurvey(id).then(this.updateSurveys)}/>
                        )) // TODO
                    }
                </div>
            </div>
        )
    }
}

export default Surveys;