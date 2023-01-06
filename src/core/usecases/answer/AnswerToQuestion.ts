import {UseCase} from "../Usecase";
import {Answer} from "../../Entities/Answer";
import {IdGateway} from "../../gateways/IdGateway";
import {AnswerRepository} from "../../repositories/AnswerRepository";
import {UserRepository} from "../../repositories/UserRepository";
import {QuestionRepository} from "../../repositories/QuestionRepository";
import {User} from "../../Entities/User";
import {SchoolRepository} from "../../repositories/SchoolRepository";

export type AnswerToQuestionInput = {
    questionId: string;
    friendId: string;
    userId: string;
    pollId: string;
};

export class AnswerToQuestion
    implements UseCase<AnswerToQuestionInput, Answer> {
    constructor(
        private readonly answerRepository: AnswerRepository,
        private readonly userRepository: UserRepository,
        private readonly questionRepository: QuestionRepository,
        private readonly schoolRepository: SchoolRepository,
        private readonly idGateway: IdGateway
    ) {
    }

    async execute(input: AnswerToQuestionInput): Promise<Answer> {

        const user = await this.userRepository.getById(input.userId);

        const question = await this.questionRepository.getById(
            input.questionId
        );

        const school = await this.schoolRepository.getBySchoolId(user.props.schoolId);

        const id = this.idGateway.generate();

        const answer = Answer.create({
            userId: input.friendId,
            answerId: id,
            pollId: input.pollId,
            question: {
                description: question.props.description,
                picture: question.props.picture,
                questionId: question.props.questionId,
            },
            response: {
                firstName: user.props.firstName,
                gender: user.props.gender,
                lastName: user.props.lastName,
                schoolId: user.props.schoolId,
                schoolName: school.props.name,
                section: user.props.section,
                userId: user.props.id,
                userName: user.props.userName,
            },
        });

        return await this.answerRepository.create(answer);
    }
}
