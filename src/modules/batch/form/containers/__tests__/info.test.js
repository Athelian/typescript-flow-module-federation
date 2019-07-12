import faker from 'faker';
import { defaultDistanceMetric, defaultVolumeMetric, defaultWeightMetric } from 'utils/metric';
import Info, { initValues } from '../info';

describe('batch info container', () => {
  it('should init empty array on creation', () => {
    const container = new Info();
    expect(container.state).toEqual(initValues);
  });

  it('should sync packing', async () => {
    const container = new Info();
    await container.initDetailValues({
      id: faker.random.number(),
      archived: false,
      autoCalculatePackageQuantity: true,
      autoCalculatePackageVolume: false,
      memo: null,
      no: faker.name.findName(),
      quantity: 0,
      latestQuantity: 0,
      batchQuantityRevisions: [],
      producedAt: '2019-07-18T00:00:00Z',
      deliveredAt: '2019-07-12T00:00:00Z',
      desiredAt: '2019-07-25T00:00:00Z',
      expiredAt: '2019-07-26T00:00:00Z',
      totalVolume: {
        value: 0,
        metric: 'm³',
        __typename: 'MetricValue',
      },
      customFields: {},
      packageName: null,
      packageCapacity: null,
      packageQuantity: 0,
      packageGrossWeight: null,
      packageVolume: null,
      packageSize: null,
      tags: [],
      orderItem: {
        id: faker.random.number(),
        productProvider: {},
        __typename: 'OrderItem',
      },
      shipment: {
        id: faker.random.number(),
      },
      container: null,
      __typename: 'Batch',
    });

    const pkg = {
      capacity: faker.random.number(),
      size: {
        width: {
          metric: defaultDistanceMetric,
          value: faker.random.number(),
        },
        height: {
          metric: defaultDistanceMetric,
          value: faker.random.number(),
        },
        length: {
          metric: defaultDistanceMetric,
          value: faker.random.number(),
        },
      },
      grossWeight: {
        metric: defaultWeightMetric,
        value: faker.random.number(),
      },
      volume: {
        metric: defaultVolumeMetric,
        value: faker.random.number(),
      },
      autoCalculateVolume: false,
    };

    await container.syncPackaging(pkg);
    expect(container.state.packageCapacity).toEqual(pkg.capacity);
    expect(container.state.packageSize).toEqual(pkg.size);
    expect(container.state.packageVolume).toEqual(pkg.volume);
    expect(container.state.packageGrossWeight).toEqual(pkg.grossWeight);
    expect(container.state.autoCalculatePackageVolume).toEqual(pkg.autoCalculateVolume);

    const newPkg = {
      capacity: faker.random.number(),
      size: {
        width: {
          metric: defaultDistanceMetric,
          value: faker.random.number(),
        },
        height: {
          metric: defaultDistanceMetric,
          value: faker.random.number(),
        },
        length: {
          metric: defaultDistanceMetric,
          value: faker.random.number(),
        },
      },
      grossWeight: {
        metric: defaultWeightMetric,
        value: faker.random.number(),
      },
      volume: {
        metric: defaultVolumeMetric,
        value: faker.random.number(),
      },
      autoCalculateVolume: true,
    };
    await container.syncPackaging(newPkg);
    expect(container.state.packageVolume).not.toEqual(newPkg.volume);
  });
});
