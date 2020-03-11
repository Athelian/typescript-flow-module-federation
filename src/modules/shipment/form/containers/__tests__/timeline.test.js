import faker from 'faker';
import Timeline, { initValues } from '../timeline';

describe('shipment timeline container', () => {
  it('should init empty array on creation', () => {
    const container = new Timeline();
    expect(container.state).toEqual(initValues);
  });

  it('should not change the data if timeline is empty', async () => {
    const container = new Timeline();
    const organization = {
      id: faker.random.uuid(),
      name: faker.name.findName(),
    };

    await container.onChangePartner(organization);

    expect(container.state).toEqual(initValues);
  });

  it('should reset cargo ready when change importer', async () => {
    const container = new Timeline();
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

    const cargoReady = {
      id: faker.random.uuid(),
      date: null,
      approvedBy: staff,
      approvedAt: faker.date.future(),
      timelineDateRevisions: [
        {
          id: faker.random.uuid(),
          date: faker.date.future(),
          type: 'Other',
          memo: null,
        },
      ],
    };
    const containerGroup = {};
    const voyage = {};

    await container.initDetailValues(
      {
        cargoReady,
        containerGroups: [containerGroup],
        voyages: [voyage],
      },
      true
    );

    expect(container.state).toEqual({
      hasCalledTimelineApiYet: true,
      cargoReady,
      containerGroups: [containerGroup],
      voyages: [voyage],
    });

    await container.onChangePartner(organization);

    expect(container.state).toEqual({
      cargoReady: {
        ...cargoReady,
        approvedBy: null,
        approvedAt: null,
      },
      containerGroups: [containerGroup],
      voyages: [voyage],
      hasCalledTimelineApiYet: true,
    });
  });

  it('should reset status and remove staff when change importer ', async () => {
    const container = new Timeline();
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

    const cargoReady = {
      id: faker.random.uuid(),
      date: null,
      approvedBy: staff,
      approvedAt: faker.date.future(),
      timelineDateRevisions: [
        {
          id: faker.random.uuid(),
          date: faker.date.future(),
          type: 'Other',
          memo: null,
        },
      ],
    };
    const containerGroup = {
      id: faker.random.uuid(),
      warehouse: null,
      customClearance: {
        id: faker.random.uuid(),
        approvedBy: staff,
        approvedAt: faker.date.future(),
        timelineDateRevisions: [],
      },
      warehouseArrival: {
        id: faker.random.uuid(),
        date: null,
        approvedBy: staff,
        approvedAt: faker.date.future(),
        timelineDateRevisions: [],
      },
      deliveryReady: {
        id: faker.random.uuid(),
        approvedBy: staff,
        approvedAt: faker.date.future(),
        timelineDateRevisions: [],
      },
    };
    const voyage = {
      id: faker.random.uuid(),
      no: null,
      vesselName: null,
      vesselCode: null,
      departurePort: {
        seaport: null,
        airport: null,
      },
      arrivalPort: {
        seaport: null,
        airport: null,
      },
      departure: {
        id: faker.random.uuid(),
        date: null,
        approvedBy: staff,
        approvedAt: faker.date.future(),
        timelineDateRevisions: [],
      },
      arrival: {
        id: faker.random.uuid(),
        date: null,
        approvedBy: staff,
        approvedAt: faker.date.future(),
        timelineDateRevisions: [],
      },
    };

    await container.initDetailValues(
      {
        cargoReady,
        containerGroups: [containerGroup],
        voyages: [voyage],
      },
      true
    );

    await container.onChangePartner(organization);

    expect(container.state).toEqual({
      hasCalledTimelineApiYet: true,
      cargoReady: {
        ...cargoReady,
        approvedBy: null,
        approvedAt: null,
      },
      containerGroups: [
        {
          ...containerGroup,
          customClearance: {
            ...containerGroup.customClearance,
            approvedBy: null,
            approvedAt: null,
          },
          warehouseArrival: {
            ...containerGroup.warehouseArrival,
            approvedBy: null,
            approvedAt: null,
          },
          deliveryReady: {
            ...containerGroup.deliveryReady,
            approvedBy: null,
            approvedAt: null,
          },
        },
      ],
      voyages: [
        {
          ...voyage,
          departure: {
            ...voyage.departure,
            approvedBy: null,
            approvedAt: null,
          },
          arrival: {
            ...voyage.arrival,
            approvedBy: null,
            approvedAt: null,
          },
        },
      ],
    });
  });
});
