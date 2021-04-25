import React from 'react';
import { Button, SelectableButton } from "./components/button"
import Logo from './components/Logo';
import MatrixAnswerQuestion from './components/question/MatrixAnswerQuestion';
import MatrixAnswerQuestionRow from './components/question/MatrixAnswerQuestionRow';
import MatrixQuestionRowText from './components/question/MatrixQuestionRowText';
import MultipleAnswerQuestion from './components/question/MultipleAnswerQuestion';
import OrderedMultipleAnswerQuestion from './components/question/OrderedMultipleAnswerQuestion';
import QuestionAnswer from './components/question/QuestionAnswer';
import QuestionText from './components/question/QuestionText';
import SingleAnswerMultipleChoiceQuestion from './components/question/SingleAnswerMultipleChoiceQuestion';
import MatrixRow from "./components/question/MatrixRow";
import FileDropQuestion from './components/question/FileDropQuestion';
import ContactForm from './components/ContactForm';
import TooltipBar from './components/TooltipBar';
import { tooltipStore, TooltipHeader, TooltipText } from './components/TooltipBar'
import DataModelTable from './components/question/DataModelTable';

class TestView extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { text: null }
    }

    render() {
        return (
            <div class="flex justify-center">
                <Logo />
                <TooltipBar>
                    {this.state.text && this.state.text}
                </TooltipBar>
                <div className="container space-y-6 justify-center flex items-center h-screen">
                    <div className="w-256">
                        <DataModelTable />
                        {/* <ContactForm /> */}
                        {/* <FileDropQuestion /> */}
                        {/* <MultipleAnswerQuestion maximumSelectableAnswers={3} tooltip="This question asks you if you are familiar with subjects in statistics.">
                            <QuestionText>
                                How familiar are you with subjects in statistics?
                            </QuestionText>
                            <QuestionAnswer value="extremely" selected tooltip="this means you are extremely familiarr">
                                Extremely familiar
                            </QuestionAnswer>
                            <QuestionAnswer value="moderately" tooltip="this means you are moderately familiarr">
                                Moderately familiar
                            </QuestionAnswer>
                            <QuestionAnswer value="somewhat">
                                Somewhat familiar
                            </QuestionAnswer>
                            <QuestionAnswer value="slightly">
                                Slightly familiar
                            </QuestionAnswer>
                            <QuestionAnswer value="not">
                                Not familiar at all
                            </QuestionAnswer>
                            <QuestionAnswer value="not">
                                Not familiar at all
                            </QuestionAnswer>
                            <QuestionAnswer value="not">
                                Not familiar at all
                            </QuestionAnswer>
                            <QuestionAnswer value="not">
                                Not familiar at all
                            </QuestionAnswer>
                            <QuestionAnswer value="not">
                                Not familiar at all
                            </QuestionAnswer>
                            <QuestionAnswer value="not">
                                Not familiar at all
                            </QuestionAnswer>
                        </MultipleAnswerQuestion> */}
                        {/* <MatrixAnswerQuestion>
                    <QuestionText id="what is this">
                        What is this?
                    </QuestionText>
                    <MatrixRow id="csv">
                        CSV<br/>(.csv)
                    </MatrixRow>
                    <MatrixRow id="excel">
                        Excel<br/>(.xls, xlsx)
                    </MatrixRow>
                    <MatrixRow id="sql">
                        SQL dump<br/>(.sql)
                    </MatrixRow>
                    <QuestionAnswer value="1 week">
                        1 Week
                    </QuestionAnswer>
                    
                    <QuestionAnswer value="1 month">
                        1 Month
                    </QuestionAnswer>
                    
                    <QuestionAnswer value="longer">
                        Longer
                    </QuestionAnswer>
                </MatrixAnswerQuestion> */}
                        {/* <div className="space-y-6">
    
                <MatrixAnswerQuestionRow>
                    <MatrixQuestionRowText>
                        CSV<br/>(.csv)
                    </MatrixQuestionRowText>
                    <QuestionAnswer value="1 week">
                        1 Week
                    </QuestionAnswer>
                    <QuestionAnswer value="1 month">
                        1 Month
                    </QuestionAnswer>
                    <QuestionAnswer value="longer">
                        Longer
                    </QuestionAnswer>
                </MatrixAnswerQuestionRow>
                <MatrixAnswerQuestionRow>
                    <MatrixQuestionRowText>
                        CSV<br/>(.csv)
                    </MatrixQuestionRowText>
                    <QuestionAnswer value="1 week">
                        1 Week
                    </QuestionAnswer>
                    <QuestionAnswer value="1 month">
                        1 Month
                    </QuestionAnswer>
                    <QuestionAnswer value="longer">
                        Longer
                    </QuestionAnswer>
                </MatrixAnswerQuestionRow>
                <MatrixAnswerQuestionRow>
                    <MatrixQuestionRowText>
                        CSV<br/>(.csv)
                    </MatrixQuestionRowText>
                    <QuestionAnswer value="1 week">
                        1 Week
                    </QuestionAnswer>
                    <QuestionAnswer value="1 month">
                        1 Month
                    </QuestionAnswer>
                    <QuestionAnswer value="longer">
                        Longer
                    </QuestionAnswer>
                </MatrixAnswerQuestionRow>
                
</div> */}
                    </div>
                </div>
            </div>
        )
    }
}


export default TestView;