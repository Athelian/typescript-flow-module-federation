import { cleanTagsData } from '../tags';

describe('clean up tags', () => {
  it('should return the same entity if has no tags', () => {
    expect(cleanTagsData(1)).toEqual(1);
    expect(cleanTagsData({})).toEqual({});
    expect(
      cleanTagsData({
        1: {
          a: 2,
        },
      })
    ).toEqual({
      1: {
        a: 2,
      },
    });
    expect(cleanTagsData({ a: true })).toEqual({ a: true });
    expect(cleanTagsData({ b: 'this is a test' })).toEqual({ b: 'this is a test' });
    expect(cleanTagsData({ items: [] })).toEqual({ items: [] });
  });

  it('should clean tags from entity', () => {
    expect(
      cleanTagsData({
        tags: [],
      })
    ).toEqual({
      tags: [],
    });
    expect(
      cleanTagsData({
        tags: [{ id: 1 }, { __typename: 'NotFound' }],
        todo: {
          tasks: [{ __typename: 'NotFound' }],
        },
      })
    ).toEqual({
      tags: [{ id: 1 }],
      todo: {
        tasks: [{ __typename: 'NotFound' }],
      },
    });
    expect(
      cleanTagsData({
        items: [
          {
            tags: [{ id: 1 }, { __typename: 'NotFound' }],
            batch: {
              id: 2,
              tags: [{ id: 3 }, { __typename: 'NotFound' }],
            },
          },
        ],
      })
    ).toEqual({
      items: [
        {
          tags: [{ id: 1 }],
          batch: {
            id: 2,
            tags: [{ id: 3 }],
          },
        },
      ],
    });
  });
});
