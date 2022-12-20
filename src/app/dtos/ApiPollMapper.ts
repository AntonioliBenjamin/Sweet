import {Mapper} from "../../core/models/Mapper";
import {QuestionProperties} from "../../core/Entities/Question";
import {Poll} from "../../core/Entities/Poll";


export type ApiPollResponse = {
    pollId: string,
    questions: QuestionProperties [],
    createdAt: Date,
}

export class ApiPollMapper implements Mapper<ApiPollResponse, Poll> {
    fromDomain(data: Poll): ApiPollResponse {
        return {
           pollId : data.props.pollId,
            questions: data.props.questions,
            createdAt: data.props.createdAt
        }
    }
}