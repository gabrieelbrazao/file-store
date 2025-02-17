import { Module } from '@nestjs/common';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  People,
  PeopleByState,
  PeopleByStateSchema,
  PeopleSchema,
} from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PeopleByState.name, schema: PeopleByStateSchema },
      { name: People.name, schema: PeopleSchema },
    ]),
  ],
  controllers: [PeopleController],
  providers: [PeopleService],
})
export class PeopleModule {}
