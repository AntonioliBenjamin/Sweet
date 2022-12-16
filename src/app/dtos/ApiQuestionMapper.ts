import {Mapper} from "../../core/models/Mapper";
import {Question} from "../../core/Entities/Question";

export type ApiQuestionResponse = {
    questionId: string;
    description: string;
    picture: string;
}

export class ApiQuestionMapper implements Mapper<ApiQuestionResponse, Question> {
    fromDomain(data: Question): ApiQuestionResponse {
        return {
            questionId: data.props.questionId,
            description: data.props.description,
            picture : data.props.picture
        }
    }
}