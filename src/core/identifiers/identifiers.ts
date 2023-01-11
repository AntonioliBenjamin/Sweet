export const identifiers = {
    //user usecases
    SignUp : Symbol.for("SignUp"),
    SignIn : Symbol.for("SignIn"),
    UpdateUser : Symbol.for("UpdateUser"),
    UpdatePushToken : Symbol.for("UpdatePushToken"),
    SendFeedBack : Symbol.for("SendFeedBack"),
    ResetPassword : Symbol.for("ResetPassword"),
    GetUserById : Symbol.for("GetUserById"),
    GetAllMyPotentialFriends : Symbol.for("GetAllMyPotentialFriends"),
    GenrateRecoveryCode : Symbol.for("GenrateRecoveryCode"), 
    EmailExist : Symbol.for("EmailExist"), 
    DeleteUser : Symbol.for("DeleteUser"), 

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