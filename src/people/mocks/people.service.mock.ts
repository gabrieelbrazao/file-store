import { PeopleDto } from '../dtos';
import { TPeopleByState } from '../types';

export const mockedPeople: PeopleDto[] = [
  { id: 1, name: 'John Doe', phone: '1234567890', state: 'CA' },
];

export const mockedPeopleByState: TPeopleByState = [
  { state: 'CA', quantity: 1 },
];

export const expectedAggregateParams = [
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
];

export const expectedBulkUpdatePeopleByStateParams = mockedPeopleByState.map(
  (people) => ({
    updateOne: {
      filter: { state: people.state },
      update: people,
      upsert: true,
    },
  }),
);

export const expectedBulkUpdatePeopleParams = mockedPeople.map((person) => ({
  updateOne: {
    filter: { id: person.id },
    update: person,
    upsert: true,
  },
}));
