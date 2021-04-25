import React from 'react';
import {Draggable} from 'react-beautiful-dnd';
import QuestionCard from '../questions/QuestionCard';

class SurveyQuestionsTabList extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div className="space-y-6">
                {
                    this.props.questions.map((question, index) => (
                        <Draggable draggableId={"all_" + question._id} index={index}>
                            {(draggableProvided) => (
                                <div {...draggableProvided.draggableProps} {...draggableProvided.dragHandleProps} ref={draggableProvided.innerRef} key={question._id}>
                                    <QuestionCard question={question} />
                                </div>
                            )}
                        </Draggable>
                    ))
                }
                {this.props.placeholder}
            </div>
        );
    }
}


export default SurveyQuestionsTabList;