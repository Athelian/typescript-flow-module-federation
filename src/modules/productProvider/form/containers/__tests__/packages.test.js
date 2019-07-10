import faker from 'faker';
import Package, { initValues } from '../packages';

describe('package end product container', () => {
  it('should init empty array on creation', () => {
    const container = new Package();
    expect(container.state).toEqual(initValues);
  });

  it('should create new package', async () => {
    const container = new Package();
    expect(container.state).toEqual(initValues);
    await container.newPackaging();
    expect(container.state.packages.length).toEqual(2);
  });

  it('should remove package by id', async () => {
    const container = new Package();
    expect(container.state).toEqual(initValues);
    const id = faker.random.uuid();
    const packages = [
      {
        id: faker.random.uuid(),
      },
      {
        id: faker.random.uuid(),
      },
      {
        id,
      },
    ];
    await container.initDetailValues({
      packages,
      defaultPackage: {
        id,
      },
    });
    expect(container.state.packages.length).toEqual(3);
    expect(container.state.packages).toEqual(packages);

    await container.removePackage(id);
    expect(container.state.packages.length).toEqual(2);
    expect(container.state.defaultPackage).toEqual(packages[0]);
  });

  it('should allow to change the default packaging', async () => {
    const container = new Package();
    const id = faker.random.uuid();
    expect(container.state).toEqual(initValues);
    const packages = [
      {
        id: faker.random.uuid(),
      },
      {
        id,
      },
    ];

    await container.initDetailValues({ packages, defaultPackage: '' });

    await container.setDefault({ id });

    expect(container.state.defaultPackage).toEqual({ id });
  });

  it('should get the active package by id', async () => {
    const container = new Package();
    const id = faker.random.uuid();
    expect(container.state).toEqual(initValues);
    const packages = [
      {
        id: faker.random.uuid(),
        name: faker.name.findName(),
      },
      {
        id,
      },
    ];
    await container.initDetailValues({ packages, defaultPackage: '' });
    const activePackage = await container.getActivePackage(id);

    expect(activePackage).toEqual({
      values: { id },
      originalValues: {
        id,
      },
      isNew: false,
    });
  });

  it('should update package name', async () => {
    const container = new Package();
    const id = faker.random.uuid();
    expect(container.state).toEqual(initValues);
    const packages = [
      {
        id: faker.random.uuid(),
        name: faker.name.findName(),
      },
      {
        id,
      },
    ];
    await container.initDetailValues({ packages, defaultPackage: '' });
    const newName = faker.name.findName();
    await container.setPackageValue({
      id,
      value: {
        name: newName,
      },
    });
    const activePackage = await container.getActivePackage(id);

    expect(activePackage).toEqual({
      values: { id, name: newName },
      originalValues: {
        id,
      },
      isNew: false,
    });
  });
});
