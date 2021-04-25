import React from "react";
import Card from "../Card";
import {Link} from "react-router-dom"
import Button from "../Button";
import EvaluationCard from "./EvaluationCard";


class Evaluations extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {evaluations: []};
    }
    
    componentDidMount() {
        this.updateEvaluations();
    }

    deleteEvaluation(id) {
        this.props.api.deleteEvaluation(id).then(() => {
            this.updateEvaluations();
        })
    }

    updateEvaluations() {
        this.props.api.getEvaluations().then(evaluations => this.setState({evaluations: evaluations}));
    }

    render() {
        return (
            <div className="flex justify-center">
                <div className="w-128 space-y-12">
                    <Link to="evaluation/new">
                        <Button>New Evaluation</Button>
                    </Link>
                    {this.state.evaluations.map((evaluationData) => (
                        <EvaluationCard
                            evaluation={evaluationData}
                            deleteEvaluation={() => this.deleteEvaluation(evaluationData._id)}
                        />
                    ))}
                </div>
            </div>
        );
    }
}

export default Evaluations;
