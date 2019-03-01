import { parseGenericField, parseEnumField, parseDateField, parseArrayOfIdsField, parseParentIdField } from '../data';

describe('Functions to parse update mutations', () => {
  it('Test A - Strings', () => {
    // No change
    expect(parseGenericField('field1', 'abc', 'abc')).toEqual({});

    // Change from value to new value
    expect(parseGenericField('field2', 'abc', '123')).toEqual({ field2: '123' });

    // Change from value to null
    expect(parseGenericField('field3', 'abc', null)).toEqual({ field3: null });

    // Change from value to empty string
    expect(parseGenericField('field4', 'abc', '')).toEqual({ field4: '' });

    // Change from null to value
    expect(parseGenericField('field5', null, 'abc')).toEqual({ field5: 'abc' });

    // Everything above in object form
    expect({
      ...parseGenericField('field1', 'abc', 'abc'),
      ...parseGenericField('field2', 'abc', '123'),
      ...parseGenericField('field3', 'abc', null),
      ...parseGenericField('field4', 'abc', ''),
      ...parseGenericField('field5', null, 'abc'),
    }).toEqual({
      field2: '123',
      field3: null,
      field4: '',
      field5: 'abc',
    });
  });

  it('Test B - Enums', () => {
    // No change
    expect(parseEnumField('field1', 'abc', 'abc')).toEqual({});

    // Change from value to new value
    expect(parseEnumField('field2', 'abc', '123')).toEqual({ field2: '123' });

    // Change from value to null
    expect(parseEnumField('field3', 'abc', null)).toEqual({ field3: null });

    // Change from value to empty string should end up as null
    expect(parseEnumField('field4', 'abc', '')).toEqual({ field4: null });

    // Change from null to value
    expect(parseEnumField('field5', null, 'abc')).toEqual({ field5: 'abc' });

    // Everything above in object form
    expect({
      ...parseEnumField('field1', 'abc', 'abc'),
      ...parseEnumField('field2', 'abc', '123'),
      ...parseEnumField('field3', 'abc', null),
      ...parseEnumField('field4', 'abc', ''),
      ...parseEnumField('field5', null, 'abc'),
    }).toEqual({
      field2: '123',
      field3: null,
      field4: null,
      field5: 'abc',
    });
  });

  it('Test C - Dates', () => {
    // No change between date version and string version
    expect(parseDateField('field1', new Date('2019-01-01'), '2019-01-01')).toEqual({});

    // Change from value to new value
    expect(parseDateField('field2', new Date('2019-01-01'), '2019-01-02')).toEqual({
      field2: new Date('2019-01-02'),
    });

    // Change from value to null
    expect(parseDateField('field3', new Date('2019-01-01'), null)).toEqual({ field3: null });

    // Change from null to value
    expect(parseDateField('field4', null, new Date('2019-01-01'))).toEqual({
      field4: new Date('2019-01-01'),
    });

    // Everything above in object form
    expect({
      ...parseDateField('field1', new Date('2019-01-01'), '2019-01-01'),
      ...parseDateField('field2', new Date('2019-01-01'), '2019-01-02'),
      ...parseDateField('field3', new Date('2019-01-01'), null),
      ...parseDateField('field4', null, new Date('2019-01-01')),
    }).toEqual({
      field2: new Date('2019-01-02'),
      field3: null,
      field4: new Date('2019-01-01'),
    });
  });

  it('Test D - Array of ids', () => {
    // No change
    expect(
      parseArrayOfIdsField('tagIds', [{ id: '1', name: 'tag1' }], [{ id: '1', name: 'tag1' }])
    ).toEqual({});

    // Change from one tag to two tags
    expect(
      parseArrayOfIdsField(
        'tagIds',
        [{ id: '1', name: 'tag1' }],
        [{ id: '1', name: 'tag1' }, { id: '2', name: 'tag2' }]
      )
    ).toEqual({ tagIds: ['1', '2'] });

    // Change from two tags to one tag
    expect(
      parseArrayOfIdsField(
        'tagIds',
        [{ id: '1', name: 'tag1' }, { id: '2', name: 'tag2' }],
        [{ id: '1', name: 'tag1' }]
      )
    ).toEqual({ tagIds: ['1'] });

    // Swap two tags
    expect(
      parseArrayOfIdsField(
        'tagIds',
        [{ id: '1', name: 'tag1' }, { id: '2', name: 'tag2' }],
        [{ id: '2', name: 'tag2' }, { id: '1', name: 'tag1' }]
      )
    ).toEqual({ tagIds: ['2', '1'] });

    // Change to empty array
    expect(
      parseArrayOfIdsField('tagIds', [{ id: '1', name: 'tag1' }, { id: '2', name: 'tag2' }], [])
    ).toEqual({
      tagIds: [],
    });
  });

  it('Test E - Parent ids', () => {
    // No change
    expect(
      parseParentIdField('containerId', { id: '1', name: 'Container A' }, { id: '1', name: 'Container A' })
    ).toEqual({});

    // Change parents
    expect(
      parseParentIdField('containerId', { id: '1', name: 'Container A' }, { id: '2', name: 'Container B' })
    ).toEqual({ containerId: '2' });

    // Change from no parent to parent
    expect(
      parseParentIdField('containerId', null, { id: '1', name: 'Container A' })
    ).toEqual({ containerId: '1' });

    // Change from parent to no parent
    expect(
      parseParentIdField('containerId', { id: '1', name: 'Container A' }, null)
    ).toEqual({ containerId: null });
  });
});
