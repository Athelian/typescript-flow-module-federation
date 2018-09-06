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

  it('should set new value by path', () => {
    const testObj = {
      a: 1,
      b: {
        c: 2,
        d: {
          e: 3,
        },
      },
    };
    expect(setIn('b.c', 3, testObj)).toEqual({
      a: 1,
      b: {
        c: 3,
        d: {
          e: 3,
        },
      },
    });
    expect(setIn('b.d.e', 4, testObj)).toEqual({
      a: 1,
      b: {
        c: 2,
        d: {
          e: 4,
        },
      },
    });
  });
});
