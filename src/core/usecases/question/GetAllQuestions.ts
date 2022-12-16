import {UseCase} from "../Usecase";
import {Question} from "../../Entities/Question";
import {QuestionRepository} from "../../repositories/QuestionRepository";




export class GetAllQuestions implements UseCase< void,Question[]>{
    constructor (private readonly questionRepository : QuestionRepository){
    }

    async execute() : Promise<Question[]>{
        return await this.questionRepository.getAllQuestions()
    }
}