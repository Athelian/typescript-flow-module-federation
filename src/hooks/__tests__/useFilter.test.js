import { renderHook, act } from '@testing-library/react-hooks';
import useFilter from '../useFilter';

const initialFilter = {
  filter: {},
  sort: {
    field: 'createdAt',
    direction: 'ASCENDING',
  },
  page: 1,
  perPage: 10,
};

test('filterBy should be {archived: false}', () => {
  const cache = JSON.stringify({
    archived: false,
    sort: {
      field: 'createdAt',
      direction: 'DESCENDING',
    },
  });
  Storage.prototype.getItem = jest.fn(() => cache);

  const { result } = renderHook(() => useFilter(initialFilter, 'test'));
  expect(result.current.queryVariables.filterBy).toEqual({
    archived: false,
  });
});

test('filterBy should be {}', () => {
  Storage.prototype.getItem = jest.fn(() => null);

  const { result } = renderHook(() => useFilter(initialFilter, 'test'));
  expect(result.current.queryVariables.filterBy).toEqual({});
});

test('call onChangeFilter', () => {
  const { result } = renderHook(() => useFilter(initialFilter, 'test'));

  act(() => {
    result.current.onChangeFilter({
      filter: {
        query: 'query',
      },
      sort: {
        field: 'createdAt',
        direction: 'ASCENDING',
      },
      page: 1,
      perPage: 10,
    });
  });

  expect(result.current.queryVariables.filterBy).toEqual({
    query: 'query',
  });
});
