import { Test, TestingModule } from '@nestjs/testing';
import { PeopleService } from '../people.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { People, PeopleByState } from '../schemas';
import {
  mockedPeopleByState,
  mockedPeople,
  expectedAggregateParams,
  expectedBulkUpdatePeopleParams,
  expectedBulkUpdatePeopleByStateParams,
} from '../mocks/people.service.mock';

describe('PeopleService', () => {
  let service: PeopleService;
  let peopleModel: Model<People>;
  let peopleByStateModel: Model<PeopleByState>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PeopleService,
        {
          provide: getModelToken(People.name),
          useValue: {
            bulkWrite: jest.fn(),
            aggregate: jest.fn(),
          },
        },
        {
          provide: getModelToken(PeopleByState.name),
          useValue: {
            bulkWrite: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PeopleService>(PeopleService);
    peopleModel = module.get<Model<People>>(getModelToken(People.name));
    peopleByStateModel = module.get<Model<PeopleByState>>(
      getModelToken(PeopleByState.name),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('savePeopleData', () => {
    it('should save people data and update people by state', async () => {
      jest
        .spyOn(service as any, 'groupPeopleByState')
        .mockResolvedValue(mockedPeopleByState);
      jest.spyOn(service as any, 'savePeople').mockResolvedValue(undefined);
      jest
        .spyOn(service as any, 'updatePeopleByState')
        .mockResolvedValue(undefined);

      await service.savePeopleData(mockedPeople);

      expect(service['savePeople']).toHaveBeenCalledWith(mockedPeople);
      expect(service['groupPeopleByState']).toHaveBeenCalled();
      expect(service['updatePeopleByState']).toHaveBeenCalledWith(
        mockedPeopleByState,
      );
    });

    it.each(['savePeople', 'groupPeopleByState', 'updatePeopleByState'])(
      'should throw an error if %s fails',
      async (method) => {
        jest.spyOn(service as any, method).mockRejectedValue(new Error());

        await expect(service['savePeopleData'](mockedPeople)).rejects.toThrow(
          'Error saving people data',
        );
      },
    );
  });

  describe('savePeople', () => {
    it('should save people data', async () => {
      await service['savePeople'](mockedPeople);

      expect(peopleModel.bulkWrite).toHaveBeenCalledWith(
        expectedBulkUpdatePeopleParams,
      );
    });
  });

  describe('groupPeopleByState', () => {
    it('should group people by state', async () => {
      peopleModel.aggregate['mockResolvedValue'](mockedPeopleByState);

      const result = await service['groupPeopleByState']();

      expect(result).toEqual(mockedPeopleByState);
      expect(peopleModel.aggregate).toHaveBeenCalledWith(
        expectedAggregateParams,
      );
    });
  });

  describe('updatePeopleByState', () => {
    it('should update people by state', async () => {
      await service['updatePeopleByState'](mockedPeopleByState);

      expect(peopleByStateModel.bulkWrite).toHaveBeenCalledWith(
        expectedBulkUpdatePeopleByStateParams,
      );
    });
  });
});
