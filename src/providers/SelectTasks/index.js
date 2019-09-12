// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { Query } from 'react-apollo';
import { ArrayValue } from 'react-values';
import loadMore from 'utils/loadMore';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import FilterToolBar from 'components/common/FilterToolBar';
import TaskGridView from 'modules/task/list/TaskGridView';
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
  const sortFields = [
    { title: intl.formatMessage(messages.updatedAt), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAt), value: 'createdAt' },
    { title: intl.formatMessage(messages.name), value: 'name' },
    { title: intl.formatMessage(messages.startDate), value: 'startDate' },
    { title: intl.formatMessage(messages.dueDate), value: 'dueDate' },
    { title: intl.formatMessage(messages.entity), value: 'entity' },
  ];
  const { filterAndSort, queryVariables, onChangeFilter } = useFilter(
    getInitFilter({
      ...filter,
    }),
    cacheKey
  );

  return (
    <Query fetchPolicy="network-only" query={selectTaskListQuery} variables={queryVariables}>
      {({ loading, data, fetchMore, error }) => {
        if (error) {
          return error.message;
        }
        const items = getByPathWithDefault([], 'tasks.nodes', data);
        const nextPage = getByPathWithDefault(1, 'tasks.page', data) + 1;
        const totalPage = getByPathWithDefault(1, 'tasks.totalPage', data);
        const hasMore = nextPage <= totalPage;

        return (
          <ArrayValue>
            {({ value: selected, push, filter: arrayValueFilter }) => (
              <SlideViewLayout>
                <SlideViewNavBar>
                  <FilterToolBar
                    icon="TASK"
                    sortFields={sortFields}
                    filtersAndSort={filterAndSort}
                    onChange={onChangeFilter}
                    canSearch
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

                <Content>
                  <TaskGridView
                    items={items}
                    onLoadMore={() => loadMore({ fetchMore, data }, queryVariables, 'tasks')}
                    hasMore={hasMore}
                    isLoading={loading}
                    renderItem={(item, position) => {
                      const isSelected = selected.some(({ id }) => id === item.id);
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
                </Content>
              </SlideViewLayout>
            )}
          </ArrayValue>
        );
      }}
    </Query>
  );
}

const defaultProps = {
  cacheKey: 'SelectTasks',
};

SelectTasks.defaultProps = defaultProps;

export default injectIntl(SelectTasks);
