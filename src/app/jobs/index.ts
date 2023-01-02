import * as cron from "node-cron";
import {CreatePoll} from "../../core/usecases/poll/CreatePoll";
import {MongoDbPollRepository} from "../../adapters/repositories/mongoDb/repositories/MongoDbPollRepository";
import {MongoDbQuestionRepository} from "../../adapters/repositories/mongoDb/repositories/MongoDbQuestionRepository";
import {V4IdGateway} from "../../adapters/gateways/V4IdGateway";

const mongoDbPollRepository = new MongoDbPollRepository();
const mongoDbQuestionRepository = new MongoDbQuestionRepository();
const v4IdGateway = new V4IdGateway();
const createPoll = new CreatePoll(mongoDbPollRepository,mongoDbQuestionRepository,v4IdGateway)

export const creatPollTimer = cron.schedule("*/5 * * * * *",async() =>{
   // await createPoll.execute();

    console.log("running every second")
})