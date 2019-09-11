import { getByPath, getByPathWithDefault, setIn } from '../fp';

describe('Functional helper', () => {
  it('should return value from object path', () => {
    const testObj = {
      a: 1,
      b: {
        c: 2,
      },
    };
    expect(getByPath('a', testObj)).toEqual(1);
    expect(getByPath('b.c', testObj)).toEqual(2);
    expect(getByPath('a.b.c', testObj)).toEqual(undefined);
  });

  it('should return default value if undefined', () => {
    const testObj = {
      a: 1,
    };
    expect(getByPathWithDefault(0, 'a', testObj)).toEqual(1);
    expect(getByPathWithDefault(0, 'd', testObj)).toEqual(0);
  });

  it('should set new value in object by path', () => {
    const testObj = {
      a: 1,
      b: [
        {
          c: 2,
          d: {
            eee: 3,
          },
        },
      ],
    };
    expect(setIn('a', 2, testObj)).toEqual({
      a: 2,
      b: [
        {
          c: 2,
          d: {
            eee: 3,
          },
        },
      ],
    });

    expect(setIn('b.0.c', 3, testObj)).toEqual({
      a: 1,
      b: [
        {
          c: 3,
          d: {
            eee: 3,
          },
        },
      ],
    });
    expect(setIn('b.0.d.eee', 4, testObj)).toEqual({
      a: 1,
      b: [
        {
          c: 2,
          d: {
            eee: 4,
          },
        },
      ],
    });
  });

  it('should set new value in array by path', () => {
    const subject = [...Array(100).keys()].map(() => ({
      a: 1,
      b: [
        {
          c: 2,
          d: {
            eee: 3,
          },
        },
      ],
    }));

    const result = setIn('78.b.0.d.eee', 4, subject);

    expect(result[78].b[0].d.eee).toEqual(4);
  });
});
