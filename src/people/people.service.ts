import { Injectable, Logger } from '@nestjs/common';
import { PeopleDto } from './dtos';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PeoplePerState } from './schemas';

type Test = { uf: string; quantity: number };

@Injectable()
export class PeopleService {
  constructor(
    @InjectModel(PeoplePerState.name)
    private PeoplePerStateModel: Model<PeoplePerState>,
  ) {}

  private readonly logger = new Logger(PeopleService.name);

  async savePeopleData(people: PeopleDto[]) {
    const peoplePerState = this.organizePeoplePerState(people);

    const documents = await this.PeoplePerStateModel.find();

    for (const peopleOnState of peoplePerState) {
      const ufDocument = documents.filter((doc) => doc.uf === peopleOnState.uf);

      this.logger.log(
        `Saving ${peopleOnState.quantity} people from ${peopleOnState.uf}`,
      );

      if (ufDocument.length > 0) {
        await this.PeoplePerStateModel.updateOne(
          { uf: peopleOnState.uf },
          { $inc: { quantity: peopleOnState.quantity } },
        );

        continue;
      }

      await this.PeoplePerStateModel.create({
        uf: peopleOnState.uf,
        quantity: peopleOnState.quantity,
      });
    }
  }

  private organizePeoplePerState(people: PeopleDto[]) {
    return people.reduce((acc: Test[], { state }) => {
      const ufRow = acc.find((p) => p.uf === state);

      if (ufRow) {
        ufRow.quantity++;
      } else {
        acc.push({ uf: state, quantity: 1 });
      }

      return acc;
    }, []);
  }
}
