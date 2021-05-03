import { faAngleRight, faCheck, faCheckCircle, faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Card from "../Card";

class ResponseCard extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.contactFormQuestion = this.props.response.answers.find(answer => answer.question.type === "Contact Form Question");
    }

    render() {
        return (
            <Card className="rounded-full hover:shadow-lg transition-all duration-300">
                <div className="flex flex-row justify-between">
                    <div>
                        <div className="rounded-full w-12 h-12 bg-gradient-to-tr mr-2 hover:bg-gradient-to-r from-primary-500 to-secondary-500 -m-4 items-center flex justify-center">
                            <div className="rounded-full w-9 h-9 bg-white text-center text-2xl text-primary-500 flex items-center justify-center">
                                <FontAwesomeIcon icon={faCheck} />
                            </div>
                        </div>
                    </div>
                    <div className="flex-grow">
                        <div className="h-12 -my-4 divide-x flex flex-row space-around">
                            <div className="p-2 flex w-36 justify-center flex-col">
                                <div className="font-bold text-lg">{this.contactFormQuestion && this.contactFormQuestion.answer.data.company || "CompanyName"}</div>
                                <div className="text-gray-500">Company branch</div>
                            </div>
                            <div className="p-2 flex w-48 items-center justify-center">{new Date(this.props.response._createdAt).toDateString()}</div>
                            <div className="p-2 w-24 flex items-center justify-around">
                                <div>Eligible</div>
                                <div>
                                    <FontAwesomeIcon icon={faCheckCircle} className="text-primary-600 text-lg"/>
                                </div>
                            </div>
                            <div className="p-2 w-24 flex items-center justify-around">
                                <div>Data</div>
                                <div>
                                    <FontAwesomeIcon icon={faCheckCircle} className="text-primary-600 text-lg"/>
                                </div></div>
                            <div className="p-2 flex flex-grow items-right justify-center flex-col">
                                <div className="font-bold text-lg">{this.contactFormQuestion ? this.contactFormQuestion.answer.data.fullName : "Max Mustermann"}</div>
                                <div className="text-gray-500">{this.contactFormQuestion ? this.contactFormQuestion.answer.data.email : "maxmustermann@randommail.com"}</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="h-12 -m-4 flex items-center justify-center text-4xl text-primary-500">
                            <FontAwesomeIcon icon={faAngleRight} />
                        </div>
                    </div>
                </div>
            </Card>
        );
    }
}

export default ResponseCard;
