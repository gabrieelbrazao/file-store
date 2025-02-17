import { Controller, ParseArrayPipe } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { PeopleDto } from './dtos';
import { PeopleService } from './people.service';

@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @EventPattern('processed-people')
  async savePeopleData(
    @Payload(new ParseArrayPipe({ items: PeopleDto })) people: PeopleDto[],
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    await this.peopleService.savePeopleData(people);

    channel.ack(originalMsg);
  }
}
