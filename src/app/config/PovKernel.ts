import { Container } from "inversify";
import { BcryptGateway } from "../../adapters/gateways/BcryptGateway";
import { V4IdGateway } from "../../adapters/gateways/V4IdGateway";
import { MongoDbQuestionRepository } from "../../adapters/repositories/mongoDb/repositories/MongoDbQuestionRepository";
import { MongoDbUserRepository } from "../../adapters/repositories/mongoDb/repositories/MongoDbUserRepository";
import { SchoolDbRepository } from "../../adapters/repositories/school/SchoolDbRepository";
import { identifiers } from "../../core/identifiers/identifiers";
import { SignUp } from "../../core/usecases/user/SignUp";
import { UserController } from "../controllers/UserController";

export class PovKernel extends Container {
    init() {
        this.bind(identifiers.UserRepository).toConstantValue(new MongoDbUserRepository())
        this.bind(identifiers.SchoolRepository).toConstantValue(new SchoolDbRepository())
        this.bind(identifiers.IdGateway).toConstantValue(new V4IdGateway())
        this.bind(identifiers.PasswordGateway).toConstantValue(new BcryptGateway())
        this.bind(SignUp).toSelf()
        this.bind(UserController).toSelf()
    }
}