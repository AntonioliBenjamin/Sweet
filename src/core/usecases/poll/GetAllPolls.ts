import {UseCase} from "../Usecase";
import {Poll} from "../../Entities/Poll";
import {PollRepository} from "../../repositories/PollRepository";

export class GetAllPolls implements UseCase<void, Poll[]> {
    constructor(private readonly pollRepository: PollRepository) {
    }

    async execute(): Promise<Poll[]> {
        return await this.pollRepository.getAllPolls()
    }
}