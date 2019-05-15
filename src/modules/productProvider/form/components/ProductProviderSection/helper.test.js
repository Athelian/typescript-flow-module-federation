import faker from 'faker';

import { generateName } from './helper';

describe('Auto generate name helper', () => {
  it('should create new name base on exporter value', () => {
    const entityName = faker.name.findName();
    const name = '';
    expect(
      generateName({
        name,
        entityName,
        type: 'exporter',
      })
    ).toEqual(entityName);
  });

  it('should replace old exporter value', () => {
    const name = faker.name.findName();
    const entityName = faker.name.findName();
    expect(
      generateName(
        {
          name,
          entityName,
          type: 'exporter',
        },
        {
          exporter: name,
        }
      )
    ).toEqual(entityName);
  });

  it('should append to name if only have supplier', () => {
    const entityName = faker.name.findName();
    const supplier = faker.name.findName();
    const name = supplier;
    const expectedName = `${entityName}-${supplier}`;
    expect(
      generateName(
        {
          name,
          entityName,
          type: 'exporter',
        },
        {
          supplier,
        }
      )
    ).toEqual(expectedName);
  });

  it('should replace old exporter value with hyphen', () => {
    const entityName = faker.name.findName();
    const exporter = faker.name.findName();
    const supplier = faker.name.findName();
    const name = `${exporter}-${supplier}`;
    const expectedName = `${entityName}-${supplier}`;
    expect(
      generateName(
        {
          name,
          entityName,
          type: 'exporter',
        },
        {
          exporter,
          supplier,
        }
      )
    ).toEqual(expectedName);
  });

  it('should not change the name if export is not match', () => {
    const entityName = faker.name.findName();
    const exporter = faker.name.findName();
    const supplier = faker.name.findName();
    const name = faker.name.findName();
    expect(
      generateName(
        {
          name,
          entityName,
          type: 'exporter',
        },
        {
          exporter,
          supplier,
        }
      )
    ).toEqual(name);
    expect(
      generateName(
        {
          name,
          entityName,
          type: 'supplier',
        },
        {
          exporter,
          supplier,
        }
      )
    ).toEqual(name);
  });

  it('should create new name base on supplier value', () => {
    const entityName = faker.name.findName();
    const name = '';
    expect(
      generateName({
        name,
        entityName,
        type: 'supplier',
      })
    ).toEqual(entityName);
  });

  it('should change supplier name if exist', () => {
    const entityName = faker.name.findName();
    const supplier = faker.name.findName();
    const name = supplier;
    expect(
      generateName(
        {
          name,
          entityName,
          type: 'supplier',
        },
        {
          supplier,
        }
      )
    ).toEqual(entityName);
  });

  it('should append to name if only have exporter', () => {
    const entityName = faker.name.findName();
    const exporter = faker.name.findName();
    const name = exporter;
    const expectedName = `${exporter}-${entityName}`;
    expect(
      generateName(
        {
          name,
          entityName,
          type: 'supplier',
        },
        {
          exporter,
        }
      )
    ).toEqual(expectedName);
  });

  it('should remove hyphen when remove the supplier', () => {
    const entityName = '';
    const exporter = faker.name.findName();
    const supplier = faker.name.findName();
    const name = `${exporter}-${supplier}`;
    const expectedName = exporter;
    expect(
      generateName(
        {
          name,
          entityName,
          type: 'supplier',
        },
        {
          exporter,
          supplier,
        }
      )
    ).toEqual(expectedName);
  });
});
