// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { FormattedMessage } from 'react-intl';
import { TASK_CREATE } from 'modules/permission/constants/task';
import usePermission from 'hooks/usePermission';
import GridView from 'components/GridView';
import { TaskCard } from 'components/Cards';
import { encodeId } from 'utils/id';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  renderItem?: Function,
};

const defaultRenderItem = (item: Object, allowCreate: boolean) => (
  <TaskCard
    key={item.id}
    task={item}
    onClick={() => navigate(`/task/${encodeId(item.id)}`)}
    onClone={() => navigate(`/task/clone/${encodeId(item.id)}`)}
    showActionsOnHover
    readOnly={!allowCreate}
  />
);

const defaultProps = {
  renderItem: defaultRenderItem,
};

const TaskGridView = (props: Props) => {
  const { hasPermission } = usePermission();
  const allowCreate = hasPermission(TASK_CREATE);
  const { items, onLoadMore, hasMore, isLoading, renderItem = defaultRenderItem } = props;

  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth="200px"
      isEmpty={items.length === 0}
      emptyMessage={<FormattedMessage id="modules.Tasks.noItem" defaultMessage="No tasks found" />}
    >
      {items.map(item => renderItem(item, allowCreate))}
    </GridView>
  );
};

TaskGridView.defaultProps = defaultProps;

export default TaskGridView;
