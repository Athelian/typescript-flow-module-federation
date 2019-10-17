// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { ObjectValue } from 'react-values';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import useFilterSort from 'hooks/useFilterSort';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { ApplyButton, CancelButton } from 'components/Buttons';
import { TemplateCard } from 'components/Cards';
import {
  EntityIcon,
  Filter,
  TaskTemplateFilterConfig,
  TaskTemplateSortConfig,
  Search,
  Sort,
} from 'components/NavBar';
import TaskTemplateGridView from 'modules/taskTemplate/list/TaskTemplateGridView';
import { taskTemplateListQuery } from 'modules/taskTemplate/list/query';

type Props = {
  entityType: string,
  onSelect: (item: Object) => void,
  onCancel: Function,
};

const SelectTaskTemplate = ({ entityType, onCancel, onSelect }: Props) => {
  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '', entityTypes: [entityType] },
    { updatedAt: 'DESCENDING' }
  );

  const queryVariables = { filterBy: { query, ...filterBy }, sortBy, page: 1, perPage: 10 };

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
              <SlideViewLayout>
                <SlideViewNavBar>
                  <EntityIcon icon="TEMPLATE" color="TEMPLATE" />

                  <Filter
                    config={TaskTemplateFilterConfig}
                    filterBy={filterBy}
                    onChange={setFilterBy}
                    staticFilters={['entityTypes']}
                  />
                  <Search query={query} onChange={setQuery} />
                  <Sort config={TaskTemplateSortConfig} sortBy={sortBy} onChange={setSortBy} />

                  <CancelButton onClick={onCancel} />
                  <ApplyButton
                    disabled={!value}
                    onClick={() => onSelect(value)}
                    id="select_task_template_apply_button"
                  />
                </SlideViewNavBar>

                <Content>
                  <TaskTemplateGridView
                    hasMore={hasMore}
                    isLoading={loading}
                    onLoadMore={() =>
                      loadMore({ fetchMore, data }, queryVariables, 'taskTemplates')
                    }
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
                </Content>
              </SlideViewLayout>
            )}
          </ObjectValue>
        );
      }}
    </Query>
  );
};

export default SelectTaskTemplate;
