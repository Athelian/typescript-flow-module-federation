// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { ObjectValue } from 'react-values';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import Layout from 'components/Layout';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { ApplyButton, CancelButton } from 'components/Buttons';
import TaskTemplateGridView from 'modules/taskTemplate/list/TaskTemplateGridView';
import { TemplateCard } from 'components/Cards';
import { taskTemplateListQuery } from 'modules/taskTemplate/list/query';

type Props = {
  entityType: string,
  onSelect: (item: Object) => void,
  onCancel: Function,
};

const SelectTaskTemplate = ({ entityType, onCancel, onSelect }: Props) => (
  <Query
    key={entityType}
    query={taskTemplateListQuery}
    variables={{
      page: 1,
      perPage: 10,
      filterBy: {
        entityTypes: [entityType],
      },
    }}
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
                  <EntityIcon icon="TEMPLATE" color="TEMPLATE" invert />
                  <CancelButton onClick={onCancel} />
                  <ApplyButton disabled={!value} onClick={() => onSelect(value)} />
                </SlideViewNavBar>
              }
            >
              <TaskTemplateGridView
                hasMore={hasMore}
                isLoading={loading}
                onLoadMore={() => loadMore({ fetchMore, data }, {}, 'taskTemplates')}
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

export default SelectTaskTemplate;
