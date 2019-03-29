// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { ObjectValue } from 'react-values';
import { isEquals, getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import Layout from 'components/Layout';
import { SlideViewNavBar, EntityIcon } from 'components/NavBar';
import { ApplyButton, CancelButton } from 'components/Buttons';
import TaskTemplateGridView from 'modules/taskTemplate/list/TaskTemplateGridView';
import { TemplateCard } from 'components/Cards';
import { taskTemplateListQuery } from 'modules/taskTemplate/list/query';

type Props = {
  selected?: ?{
    id: string,
    name: string,
  },
  onSelect: (item: Object) => void,
  onCancel: Function,
};

const defaultProps = {
  selected: {
    id: '',
    name: '',
  },
};

const SelectTaskTemplate = ({ selected, onCancel, onSelect }: Props) => (
  <Query
    query={taskTemplateListQuery}
    variables={{
      page: 1,
      perPage: 10,
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
        <ObjectValue defaultValue={selected}>
          {({ value, set }) => (
            <Layout
              navBar={
                <SlideViewNavBar>
                  <EntityIcon icon="TEMPLATE" color="TEMPLATE" invert />
                  <CancelButton onClick={onCancel} />
                  <ApplyButton
                    disabled={isEquals(value, selected)}
                    onClick={() => onSelect(value)}
                  />
                </SlideViewNavBar>
              }
            >
              <TaskTemplateGridView
                hasMore={hasMore}
                isLoading={loading}
                onLoadMore={() => loadMore({ fetchMore, data }, {}, 'taskTemplates')}
                items={getByPathWithDefault([], 'taskTemplates.nodes', data)}
                renderItem={({ item }) => (
                  <TemplateCard
                    template={item}
                    onSelect={() => {
                      if (value && item.id === value.id) {
                        set(null);
                      } else {
                        set(item);
                      }
                    }}
                    selectable
                    selected={value && item.id === value.id}
                    key={item.id}
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

SelectTaskTemplate.defaultProps = defaultProps;

export default SelectTaskTemplate;
