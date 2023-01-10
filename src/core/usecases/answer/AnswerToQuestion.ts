import {UseCase} from "../Usecase";
import {Answer} from "../../Entities/Answer";
import {IdGateway} from "../../gateways/IdGateway";
import {AnswerRepository} from "../../repositories/AnswerRepository";
import {UserRepository} from "../../repositories/UserRepository";
import {QuestionRepository} from "../../repositories/QuestionRepository";
import {SchoolRepository} from "../../repositories/SchoolRepository";
import {PushNotificationGateway} from "../../gateways/PushNotificationGateway";
import {Gender, User} from "../../Entities/User";

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
        private readonly idGateway: IdGateway,
        private readonly pushNotificationGateway: PushNotificationGateway
    ) {}

    async execute(input: AnswerToQuestionInput): Promise<Answer> {
        let friend: User = null;
        const user = await this.userRepository.getById(input.userId);
        if (input.friendId) {
            friend = await this.userRepository.getById(input.friendId);
            await this.pushNotificationGateway.send({
                identifier: friend.props.pushToken,
                message: `${user.props.gender === Gender.BOY ? "Un garçon" : "Une fille"} t’as envoyé un POV`,
                title: "Un nouveau POV"
            });
        }

        const question = await this.questionRepository.getById(input.questionId);

        const school = await this.schoolRepository.getBySchoolId(user.props.schoolId);

        const id = this.idGateway.generate();

        const answer = Answer.create({
            userId: input.userId,
            answerId: id,
            pollId: input.pollId,
            question: {
                description: question.props.description,
                picture: question.props.picture,
                questionId: question.props.questionId,
            },
            from: {
                firstName: user.props.firstName,
                gender: user.props.gender,
                lastName: user.props.lastName,
                schoolId: user.props.schoolId,
                schoolName: school.props.name,
                section: user.props.section,
                userId: user.props.id,
                userName: user.props.userName,
            },
            response: friend != null ? {
                firstName: friend.props.firstName,
                gender: friend.props.gender,
                lastName: friend.props.lastName,
                schoolId: friend.props.schoolId,
                schoolName: school.props.name,
                section: friend.props.section,
                userId: friend.props.id,
                userName: friend.props.userName,
            } : null,
        });
        return await this.answerRepository.create(answer);
    }
}
