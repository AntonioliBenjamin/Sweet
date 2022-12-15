import {Question} from "../Entities/Question";

export interface QuestionRepository {
    create(input: Question): Promise<Question>;
}