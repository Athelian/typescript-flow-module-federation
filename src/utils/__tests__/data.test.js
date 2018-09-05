import { flatten, unflatten } from '../data';

describe('Flatten object', () => {
  it('Return flatten object from simple nested object', () => {
    const dummyData = {
      a: 1,
      b: {
        c: 2,
      },
    };
    const desiredResult = {
      a: 1,
      b_c: 2,
    };

    expect(flatten(dummyData)).toEqual(desiredResult);
  });

  it('Return flatten object from object with nested array', () => {
    const dummyData = {
      a: {
        b: [
          {
            c: {
              j: 1,
            },
            d: 2,
          },
          {
            c: {
              j: 3,
            },
            d: 4,
          },
        ],
        f: 5,
      },
    };
    const desiredResult = {
      a_b: [
        {
          c_j: 1,
          d: 2,
        },
        {
          c_j: 3,
          d: 4,
        },
      ],
      a_f: 5,
    };

    expect(flatten(dummyData)).toEqual(desiredResult);
  });
});

describe('Unflatten object', () => {
  it('Return unflattened object from simple flattened object', () => {
    const dummyData = {
      a: 1,
      b_c: 2,
    };
    const desiredResult = {
      a: 1,
      b: {
        c: 2,
      },
    };

    expect(unflatten(dummyData)).toEqual(desiredResult);
  });
});
