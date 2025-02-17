import { Injectable, Logger } from '@nestjs/common';
import { PeopleDto } from './dtos';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { People, PeopleByState } from './schemas';

type Test = { state: string; quantity: number };

@Injectable()
export class PeopleService {
  constructor(
    @InjectModel(PeopleByState.name)
    private PeopleByStateModel: Model<PeopleByState>,
    @InjectModel(People.name)
    private PeopleModel: Model<People>,
  ) {}

  private readonly logger = new Logger(PeopleService.name);

  async savePeopleData(people: PeopleDto[]) {
    if (!Array.isArray(people)) {
      const message = 'Invalid payload: expected an array.';

      this.logger.error(message);
      throw new Error(message);
    }

    await this.savePeople(people);

    const peopleByState = await this.groupPeopleByState();

    await this.updatePeopleByState(peopleByState);
  }

  private async savePeople(people: PeopleDto[]) {
    this.logger.log(`Saving ${people.length} people.`);

    this.logger.debug(people);

    await this.PeopleModel.bulkWrite(
      people.map((person) => ({
        updateOne: {
          filter: { id: person.id },
          update: person,
          upsert: true,
        },
      })),
    );
  }

  private async groupPeopleByState(): Promise<Test[]> {
    return this.PeopleModel.aggregate([
      {
        $group: {
          _id: '$state',
          quantity: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          state: '$_id',
          quantity: 1,
        },
      },
    ]);
  }

  private async updatePeopleByState(peopleByState: Test[]) {
    this.logger.log('Updating people by state.');

    this.logger.debug(peopleByState);

    await this.PeopleByStateModel.bulkWrite(
      peopleByState.map((people) => ({
        updateOne: {
          filter: { state: people.state },
          update: people,
          upsert: true,
        },
      })),
    );
  }
}
