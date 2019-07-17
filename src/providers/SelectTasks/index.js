// @flow
import * as React from 'react';
import { toast } from 'react-toastify';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { useQuery } from '@apollo/react-hooks';
import { ArrayValue } from 'react-values';
import { trackingError } from 'utils/trackingError';
import { SlideViewLayout } from 'components/Layout';
import TaskGridView from 'modules/task/list/TaskGridView';
import LoadingIcon from 'components/LoadingIcon';
import { SlideViewNavBar, EntityIcon, SortInput, SearchInput } from 'components/NavBar';
import { SaveButton, CancelButton } from 'components/Buttons';
import { getByPathWithDefault } from 'utils/fp';
import messages from 'modules/task/messages';
import useFilter from 'hooks/useFilter';
import { TaskCard } from 'components/Cards';
import { selectTaskListQuery } from './query';

type OptionalProps = {
  cacheKey: string,
};

type Props = OptionalProps & {
  onCancel: Function,
  onSelect: Function,
  intl: IntlShape,
  filter: Object,
};

const getInitFilter = (filter: Object) => ({
  perPage: 20,
  page: 1,
  filter: {
    query: '',
    hasMilestone: false,
    ...filter,
  },
  sort: { field: 'updatedAt', direction: 'DESCENDING' },
});

function SelectTasks({ intl, cacheKey, onCancel, onSelect, filter }: Props) {
  const fields = [
    { title: intl.formatMessage(messages.updatedAt), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAt), value: 'createdAt' },
    { title: intl.formatMessage(messages.name), value: 'name' },
    { title: intl.formatMessage(messages.startDate), value: 'startDate' },
    { title: intl.formatMessage(messages.dueDate), value: 'dueDate' },
    { title: intl.formatMessage(messages.entity), value: 'entity' },
  ];
  const { filterAndSort: filtersAndSort, queryVariables, onChangeFilter: onChange } = useFilter(
    getInitFilter({
      ...filter,
    }),
    cacheKey
  );

  const [isLoading, setIsLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [tasks, setTasks] = React.useState([]);
  const { loading, error, client, networkStatus } = useQuery(selectTaskListQuery, {
    variables: queryVariables,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
    onCompleted: result => {
      setTasks(getByPathWithDefault([], 'tasks.nodes', result));
      const nextPage = getByPathWithDefault(1, 'tasks.page', result) + 1;
      const totalPage = getByPathWithDefault(1, 'tasks.totalPage', result);
      setHasMore(nextPage <= totalPage);
      setPage(nextPage);
      setIsLoading(false);
    },
  });

  const refetching = networkStatus === 4;

  React.useEffect(() => {
    if (loading && !refetching) {
      setIsLoading(true);
    }
  }, [loading, refetching]);

  if (error) {
    return error.message;
  }

  return (
    <ArrayValue>
      {({ value: selected, push, filter: arrayValueFilter }) => (
        <SlideViewLayout>
          <SlideViewNavBar>
            <EntityIcon icon="TASK" color="TASK" />
            <SortInput
              sort={fields.find(item => item.value === filtersAndSort.sort.field) || fields[0]}
              ascending={filtersAndSort.sort.direction !== 'DESCENDING'}
              fields={fields}
              onChange={({ field: { value }, ascending }) =>
                onChange({
                  ...filtersAndSort,
                  sort: {
                    field: value,
                    direction: ascending ? 'ASCENDING' : 'DESCENDING',
                  },
                })
              }
            />
            <SearchInput
              value={filtersAndSort.filter.query}
              name="search"
              onClear={() =>
                onChange({
                  ...filtersAndSort,
                  filter: { ...filtersAndSort.filter, query: '' },
                })
              }
              onChange={newQuery =>
                onChange({
                  ...filtersAndSort,
                  filter: { ...filtersAndSort.filter, query: newQuery },
                })
              }
            />
            <CancelButton onClick={onCancel} />
            <SaveButton
              data-testid="btnSaveSelectTasks"
              disabled={selected.length === 0}
              onClick={() => {
                onSelect(selected);
              }}
            />
          </SlideViewNavBar>
          <TaskGridView
            items={tasks}
            loader={null}
            onLoadMore={() => {
              setIsLoading(true);
              client
                .query({
                  query: selectTaskListQuery,
                  fetchPolicy: 'no-cache',
                  variables: {
                    ...queryVariables,
                    page,
                  },
                })
                .then(result => {
                  setTasks([...tasks, ...getByPathWithDefault([], 'data.tasks.nodes', result)]);
                  const nextPage = getByPathWithDefault(1, 'data.tasks.page', result) + 1;
                  const totalPage = getByPathWithDefault(1, 'data.tasks.totalPage', result);
                  setHasMore(nextPage <= totalPage);
                  setPage(nextPage);
                  setIsLoading(false);
                })
                .catch(err => {
                  trackingError(err);
                  toast.error(
                    intl.formatMessage({
                      id: 'global.apiErrorMessage',
                      defaultMessage: 'There was an error. Please try again later.',
                    })
                  );
                  setIsLoading(false);
                });
            }}
            hasMore={hasMore}
            isLoading={isLoading && tasks.length === 0}
            renderItem={(item, position) => {
              const isSelected = selected.map(({ id }) => id).includes(item.id);
              return (
                <TaskCard
                  entity={{
                    ...item.entity,
                    ...getByPathWithDefault({}, 'order', item),
                    ...getByPathWithDefault({}, 'orderItem', item),
                    ...getByPathWithDefault({}, 'batch', item),
                    ...getByPathWithDefault({}, 'product', item),
                    ...getByPathWithDefault({}, 'productProvider', item),
                    ...getByPathWithDefault({}, 'shipment', item),
                  }}
                  position={position + 1}
                  key={item.id}
                  selectable
                  task={item}
                  selected={isSelected}
                  onSelect={() => {
                    if (isSelected) {
                      arrayValueFilter(({ id }) => id !== item.id);
                    } else {
                      push(item);
                    }
                  }}
                  hideProjectInfo
                />
              );
            }}
          />
          {isLoading && tasks.length > 0 && <LoadingIcon />}
        </SlideViewLayout>
      )}
    </ArrayValue>
  );
}

const defaultProps = {
  cacheKey: 'SelectTasks',
};

SelectTasks.defaultProps = defaultProps;

export default injectIntl(SelectTasks);
