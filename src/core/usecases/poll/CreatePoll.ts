import {UseCase} from "../Usecase";
import {Poll} from "../../Entities/Poll";
import {PollRepository} from "../../repositories/PollRepository";
import {IdGateway} from "../../gateways/IdGateway";
import {QuestionRepository} from "../../repositories/QuestionRepository";

export class CreatePoll implements UseCase<void, void> {
    constructor(
        private readonly pollRepository: PollRepository,
        private readonly questionRepository: QuestionRepository,
        private readonly idGateway: IdGateway,
    ) {
    }

    async execute(): Promise<void> {
        const id = this.idGateway.generate();
        const poll = Poll.create({
            pollId: id,
        })
        const questionsArray = await this.questionRepository.getAllQuestions();
        const questions = questionsArray.map(elem=> elem.props)

        await this.pollRepository.addQuestions(poll, questions)

        await this.pollRepository.update(poll);
        return
    }
}

// function fill() {
//     const question = questionsArray [Math.floor(Math.random() * (questionsArray.length))];
//     const canAddQuestion = poll.canAddQuestion(question.props.questionId);
//     if (!canAddQuestion) {
//         fill()
//     }
//     if (canAddQuestion && questionsArray.length < 12) {
//         poll.addQuestion(question.props);
//         fill()
//     }
//     return poll
// }
//
// fill()