// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import GridView from 'components/GridView';
import { TemplateCard } from 'components/Cards';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
};

const TaskTemplateGridView = ({ items, onLoadMore, hasMore, isLoading }: Props) => (
  <GridView
    onLoadMore={onLoadMore}
    hasMore={hasMore}
    isLoading={isLoading}
    itemWidth="200px"
    isEmpty={items.length === 0}
    emptyMessage={
      <FormattedMessage id="modules.TableTemplates.noItem" defaultMessage="No template found" />
    }
  >
    {items.map(item => (
      <TemplateCard
        key={item.id}
        type="TASK"
        template={{
          id: item.id,
          title: item.name,
          description: item.memo,
          count: item.tasks.length,
        }}
      />
    ))}
  </GridView>
);

export default TaskTemplateGridView;
