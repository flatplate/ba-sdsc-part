import React from "react";
import { PartAPI } from "partjs";
import NewQuestion from "./newQuestion/NewQuestion";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Login from "./Login";
import NavBar from "./NavBar";
import AlertComponent from "./alert/AlertComponent";
import Questions from "./questions/Questions";
import Surveys from "./surveys/Surveys";
import NewSurvey from "./newSurvey/NewSurvey";
import Responses from "./responses/Responses";
import Evaluations from "./evaluation/Evaluations";
import NewEvaluation from "./evaluation/NewEvaluation";

class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.api = new PartAPI("/api/v1");
    }

    componentDidMount() {
        this.api.checkAuthentification();
    }

    render() {
        return (
            <div className="App justify-center flex items-center mt-24">
                <AlertComponent />
                <BrowserRouter basename="/admin">
                    <Switch>
                        <Route path="/login" exact>
                            <Login api={this.api} />
                        </Route>
                        <Route>
                            <NavBar api={this.api} />
                            <div className="w-full lg:w-256 xl:w-256 2xl:w-256 3xl:w-256 p-10">
                                <Switch>
                                    <PrivateRoute path="/questions/new" api={this.api}>
                                        <NewQuestion api={this.api} />
                                    </PrivateRoute>
                                    <PrivateRoute path="/questions/:id" api={this.api}>
                                        <NewQuestion api={this.api} />
                                    </PrivateRoute>
                                    <PrivateRoute path="/questions" api={this.api} exact>
                                        <Questions api={this.api} />
                                    </PrivateRoute>
                                    <PrivateRoute path="/surveys/new" api={this.api} exact>
                                        <NewSurvey api={this.api} />
                                    </PrivateRoute>
                                    <PrivateRoute path="/surveys/:id" api={this.api}>
                                        <NewSurvey api={this.api} />
                                    </PrivateRoute>
                                    <PrivateRoute path="/surveys" api={this.api} exact>
                                        <Surveys api={this.api} />
                                    </PrivateRoute>
                                    <PrivateRoute path="/responses" api={this.api} exact>
                                        <Responses api={this.api} />
                                    </PrivateRoute>
                                    <PrivateRoute path="/evaluation" api={this.api} exact>
                                        <Evaluations api={this.api} />
                                    </PrivateRoute>
                                    <PrivateRoute path="/evaluation/new" api={this.api} exact>
                                        <NewEvaluation api={this.api} />
                                    </PrivateRoute>
                                    <PrivateRoute path="/evaluation/:id" api={this.api}>
                                        <NewEvaluation api={this.api} />
                                    </PrivateRoute>
                                    <PrivateRoute path="/" api={this.api} exact>
                                        <Redirect to="/responses" />
                                    </PrivateRoute>
                                </Switch>
                            </div>
                        </Route>
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
