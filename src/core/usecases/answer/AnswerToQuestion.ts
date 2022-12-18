import {UseCase} from "../Usecase";
import {Answer, AnswerProperties} from "../../Entities/Answer";
import {IdGateway} from "../../gateways/IdGateway";
import {AnswerRepository} from "../../repositories/AnswerRepository";

export type AnswerToQuestionInput = {

};

export class AnswerToQuestion implements UseCase<AnswerToQuestionInput, Answer>{
    constructor(
        private readonly answerRepository : AnswerRepository,
        private readonly idGateway : IdGateway
    ){

    }

    async execute(input : AnswerToQuestionInput) : Promise<Answer> {
        const id = this.idGateway.generate();
        const answer = Answer.create({
})
    }
}