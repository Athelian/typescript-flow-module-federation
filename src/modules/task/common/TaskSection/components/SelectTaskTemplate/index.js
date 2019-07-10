// @flow
import * as React from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import { Query } from 'react-apollo';
import { ObjectValue } from 'react-values';
import { getByPathWithDefault } from 'utils/fp';
import useFilter from 'hooks/useFilter';
import loadMore from 'utils/loadMore';
import Layout from 'components/Layout';
import { SlideViewNavBar } from 'components/NavBar';
import FilterToolBar from 'components/common/FilterToolBar';
import { ApplyButton, CancelButton } from 'components/Buttons';
import TaskTemplateGridView from 'modules/taskTemplate/list/TaskTemplateGridView';
import { TemplateCard } from 'components/Cards';
import { taskTemplateListQuery } from 'modules/taskTemplate/list/query';
import messages from 'modules/task/messages';

type OptionalProps = {
  cacheKey: string,
};

type Props = OptionalProps & {
  intl: IntlShape,
  entityType: string,
  onSelect: (item: Object) => void,
  onCancel: Function,
};

const SelectTaskTemplate = ({
  intl,
  cacheKey = 'SelectTaskTemplate',
  entityType,
  onCancel,
  onSelect,
}: Props) => {
  const sortFields = [
    { title: intl.formatMessage(messages.updatedAt), value: 'updatedAt' },
    { title: intl.formatMessage(messages.createdAt), value: 'createdAt' },
    { title: intl.formatMessage(messages.name), value: 'name' },
  ];

  const initialFilter = {
    filter: {
      entityTypes: [entityType],
    },
    sort: {
      field: 'updatedAt',
      direction: 'DESCENDING',
    },
    page: 1,
    perPage: 10,
  };

  const { filterAndSort, queryVariables, onChangeFilter } = useFilter(initialFilter, cacheKey);

  return (
    <Query
      key={entityType}
      query={taskTemplateListQuery}
      variables={queryVariables}
      fetchPolicy="network-only"
    >
      {({ loading, data, fetchMore, error }) => {
        if (error) {
          return error.message;
        }
        const nextPage = getByPathWithDefault(1, 'taskTemplates.page', data) + 1;
        const totalPage = getByPathWithDefault(1, 'taskTemplates.totalPage', data);
        const hasMore = nextPage <= totalPage;

        return (
          <ObjectValue defaultValue={null}>
            {({ value, set }) => (
              <Layout
                navBar={
                  <SlideViewNavBar>
                    <FilterToolBar
                      icon="TEMPLATE"
                      sortFields={sortFields}
                      filtersAndSort={filterAndSort}
                      onChange={onChangeFilter}
                    />
                    <CancelButton onClick={onCancel} />
                    <ApplyButton disabled={!value} onClick={() => onSelect(value)} />
                  </SlideViewNavBar>
                }
              >
                <TaskTemplateGridView
                  hasMore={hasMore}
                  isLoading={loading}
                  onLoadMore={() => loadMore({ fetchMore, data }, queryVariables, 'taskTemplates')}
                  items={getByPathWithDefault([], 'taskTemplates.nodes', data)}
                  renderItem={item => (
                    <TemplateCard
                      key={item.id}
                      type="TASK"
                      template={{
                        id: item.id,
                        title: item.name,
                        description: item.description,
                        count: item.tasks.length,
                      }}
                      onSelect={() => {
                        if (value && item.id === value.id) {
                          set(null);
                        } else {
                          set(item);
                        }
                      }}
                      selectable
                      selected={value && item.id === value.id}
                    />
                  )}
                />
              </Layout>
            )}
          </ObjectValue>
        );
      }}
    </Query>
  );
};

export default injectIntl(SelectTaskTemplate);
