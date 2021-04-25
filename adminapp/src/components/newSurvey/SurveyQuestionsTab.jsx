import React from "react";
import TextInput from "../TextInput";
import Fuse from "fuse.js";
import { Droppable } from "react-beautiful-dnd";
import SurveyQuestionsTabList from "./SurveyQuestionsTabList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";

class SurveyQuestionsTab extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { filterText: "", collapsed: true };
        this.fuse = null;
        this.fuseOptions = {
            keys: [
                "name",
                "type",
                "text",
                "tooltip",
                "answers.text",
                "answers.value",
                "answers.tooltip",
                "rows.text",
                "rows.id",
                "rows.tooltip",
            ],
        };
        this.toggle = this.toggle.bind(this);
    }

    updateFuse() {
        this.fuse = new Fuse(this.props.questions, this.fuseOptions);
    }

    componentDidMount() {
        this.updateFuse();
    }

    componentDidUpdate(oldProps) {
        if (oldProps.questions !== this.props.questions) {
            this.updateFuse();
        }
    }

    filterQuestions(value) {
        if (value === "") {
            return this.props.questions;
        }
        return this.fuse.search(value).map((fuseItem) => fuseItem.item);
    }

    toggle() {
        this.setState({ collapsed: !this.state.collapsed });
    }

    render() {
        const tabRightString = this.state.collapsed ? "-right-96" : "right-0";
        const buttonRightString = this.state.collapsed ? "right-16" : "right-112";
        return (
            <>
                <div className={`transform ${buttonRightString} fixed top-32 z-20 cursor-pointer transition-all`}>
                    <div className="rounded-full transform translate-x-1/2 bg-primary-600 shadow w-8 h-8 text-center align-middle text-white hover:bg-primary-500 transition-all duration-200" onClick={this.toggle}>
                        <FontAwesomeIcon
                            icon={faAngleLeft}
                            className={`h-full text-2xl text-center w-full transition-all duration-300 transform ${!this.state.collapsed && "rotate-180"}`}
                        />
                    </div>
                </div>
                <div className={`bg-gray-50 fixed z-0 right-0 w-112 h-screen top-0 shadow-lg p-8 pt-32 overflow-y-scroll no-scrollbar-y ${tabRightString} transition-all`}>
                    <div className="space-y-6">
                        <TextInput
                            rounded="full"
                            placeholder="Filter questions..."
                            onChange={(e) =>
                                this.setState({ filterText: e.target.value })
                            }
                        />
                        <Droppable droppableId="questionsListDroppable">
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    <SurveyQuestionsTabList
                                        questions={this.filterQuestions(
                                            this.state.filterText
                                        )}
                                        placeholder={provided.placeholder}
                                    />
                                </div>
                            )}
                        </Droppable>
                    </div>
                </div>
            </>
        );
    }
}

export default SurveyQuestionsTab;
