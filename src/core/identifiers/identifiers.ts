export const identifiers = {
    //repositories
    UserRepository : Symbol.for("UserRepository"), 
    AnswerRepository : Symbol.for("AnswerRepository"), 
    FollowedRepository : Symbol.for("FollowedRepository"), 
    PollRepository : Symbol.for("PollRepository"), 
    QuestionRepository : Symbol.for("QuestionRepository"), 
    SchoolRepository : Symbol.for("SchoolRepository"),

    //gateways
    EmailGateway : Symbol.for("EmailGateway"),
    IdGateway : Symbol.for("IdGateway"),
    PasswordGateway : Symbol.for("PasswordGateway"),
    PushNotificationGateway : Symbol.for("PushNotificationGateway"),
}