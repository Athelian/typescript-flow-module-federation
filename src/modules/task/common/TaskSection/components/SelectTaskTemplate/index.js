// @flow
import * as React from 'react';
import useFilterSort from 'hooks/useFilterSort';
import useQueryList from 'hooks/useQueryList';
import { Content, SlideViewLayout, SlideViewNavBar } from 'components/Layout';
import { ApplyButton, CancelButton } from 'components/Buttons';
import { TemplateCard } from 'components/Cards';
import Selector from 'components/Selector';
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

  const { nodes, loading, hasMore, loadMore } = useQueryList(
    taskTemplateListQuery,
    {
      variables: { filterBy: { query, ...filterBy }, sortBy, page: 1, perPage: 20 },
      fetchPolicy: 'network-only',
    },
    'taskTemplates'
  );

  return (
    <Selector.Single selected={null}>
      {({ value, dirty, getItemProps }) => (
        <SlideViewLayout>
          <SlideViewNavBar>
            <EntityIcon icon="TEMPLATE" color="TEMPLATE" subIcon="TASK" />

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
              disabled={!dirty}
              onClick={() => onSelect(value)}
              id="select_task_template_apply_button"
            />
          </SlideViewNavBar>

          <Content>
            <TaskTemplateGridView
              hasMore={hasMore}
              isLoading={loading}
              onLoadMore={loadMore}
              items={nodes}
              RenderItem={({ template }) => (
                <TemplateCard
                  key={template.id}
                  type="TASK"
                  template={{
                    id: template.id,
                    title: template.name,
                    description: template.description,
                    count: template.tasks?.length ?? 0,
                  }}
                  {...getItemProps(template)}
                />
              )}
            />
          </Content>
        </SlideViewLayout>
      )}
    </Selector.Single>
  );
};

export default SelectTaskTemplate;
