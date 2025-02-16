import { Module } from '@nestjs/common';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PeoplePerState, PeoplePerStateSchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PeoplePerState.name, schema: PeoplePerStateSchema },
    ]),
  ],
  controllers: [PeopleController],
  providers: [PeopleService],
})
export class PeopleModule {}
