import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Landing from "./Landing";
import Logo from "./Logo";
import TooltipBar from "./TooltipBar";
import { PartAPI } from "partjs";
import Survey from "./Survey";
import ProgressBar from "./ProgressBar";
import ResultPage from "./ResultPage";

class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.api = new PartAPI("/api/v1");
        this.state = { result: "" };
    }

    render() {
        return (
            <div class="md:mt-0 mt-8 flex justify-center">
                <Logo />
                <TooltipBar />
                <ProgressBar />
                <BrowserRouter>
                    <div className="container space-y-6 justify-center flex items-center h-screen text-gray-600">
                        <div className="w-auto">
                            <Route path="/" exact>
                                <Landing />
                            </Route>
                            <Route path={["/survey/question/:questionId", "/survey"]}>
                                <Survey api={this.api} onResultReceived={(result) => this.setState({result: result})} />
                            </Route>
                            <Route path="/result">
                                <ResultPage result={this.state.result} />
                            </Route>
                        </div>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
