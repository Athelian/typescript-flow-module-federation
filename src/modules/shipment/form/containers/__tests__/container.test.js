import faker from 'faker';
import Container, { initValues } from '../containers';

describe('shipment task container', () => {
  it('should init empty array on creation', () => {
    const container = new Container();
    expect(container.state).toEqual(initValues);
  });

  it('should reset status and remove staff when change importer ', async () => {
    const container = new Container();
    const organization = {
      id: faker.random.uuid(),
      name: faker.name.findName(),
    };

    const staff = {
      id: faker.random.uuid(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      organization,
    };

    const entity = {
      warehouse: null,
      freeTimeStartDate: null,
      freeTimeDuration: 14,
      autoCalculatedFreeTimeStartDate: true,
      yardName: null,
      departureDate: null,
      tags: [],
      batches: [],
      representativeBatch: null,
      warehouseArrivalAgreedDate: faker.date.future(),
      warehouseArrivalActualDate: faker.date.future(),
    };

    const containers = [
      {
        ...entity,
        warehouseArrivalAgreedDateApprovedAt: faker.date.future(),
        warehouseArrivalActualDateApprovedAt: faker.date.future(),
        warehouseArrivalAgreedDateApprovedBy: staff,
        warehouseArrivalActualDateApprovedBy: staff,
        departureDateApprovedAt: faker.date.future(),
        departureDateApprovedBy: staff,
      },
    ];

    await container.initDetailValues(containers, true);

    expect(container.originalValues.containers).toEqual(containers);
    expect(container.state.containers).toEqual(containers);

    await container.onChangePartner(organization);

    expect(container.state.containers).toEqual([
      {
        ...entity,
        warehouseArrivalAgreedDateApprovedAt: null,
        warehouseArrivalActualDateApprovedAt: null,
        warehouseArrivalAgreedDateApprovedBy: null,
        warehouseArrivalActualDateApprovedBy: null,
        departureDateApprovedAt: null,
        departureDateApprovedBy: null,
      },
    ]);
  });
});
