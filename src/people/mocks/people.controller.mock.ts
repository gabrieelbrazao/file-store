import { RmqContext } from '@nestjs/microservices';
import { PeopleDto } from '../dtos';

export const mockedPeople: PeopleDto[] = [
  { id: 1, name: 'John Doe', phone: '1234567890', state: 'CA' },
];
export const mockedContext = {
  getChannelRef: jest.fn().mockReturnValue({
    ack: jest.fn(),
  }),
  getMessage: jest.fn().mockReturnValue({}),
} as unknown as RmqContext;
