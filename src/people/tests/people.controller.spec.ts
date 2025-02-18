import { Test, TestingModule } from '@nestjs/testing';
import { PeopleController } from '../people.controller';
import { PeopleService } from '../people.service';
import { mockedContext, mockedPeople } from '../mocks/people.controller.mock';

describe('PeopleController', () => {
  let controller: PeopleController;
  let service: PeopleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PeopleController],
      providers: [
        {
          provide: PeopleService,
          useValue: {
            savePeopleData: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PeopleController>(PeopleController);
    service = module.get<PeopleService>(PeopleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('savePeopleData', () => {
    it('should call savePeopleData on PeopleService', async () => {
      await controller.savePeopleData(mockedPeople, mockedContext);

      expect(service.savePeopleData).toHaveBeenCalledWith(mockedPeople);
      expect(mockedContext.getChannelRef().ack).toHaveBeenCalledWith(
        mockedContext.getMessage(),
      );
    });

    it('should handle exceptions thrown by PeopleService', async () => {
      jest
        .spyOn(service, 'savePeopleData')
        .mockRejectedValue(new Error('Test error'));

      await expect(
        controller.savePeopleData(mockedPeople, mockedContext),
      ).rejects.toThrow('Test error');
    });
  });
});
