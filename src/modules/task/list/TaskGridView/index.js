// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { FormattedMessage } from 'react-intl';
import GridView from 'components/GridView';
import { TaskCard } from 'components/Cards';
import { encodeId } from 'utils/id';
import PartnerPermissionsWrapper from 'components/PartnerPermissionsWrapper';
import { PROJECT_FORM } from 'modules/permission/constants/project';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  renderItem?: Function,
};

const defaultRenderItem = (item: Object) => (
  <PartnerPermissionsWrapper key={item.id} data={item}>
    {permissions => (
      <TaskCard
        position={item.sort + 1}
        entity={item.entity}
        task={item}
        navigable={{ project: permissions.includes(PROJECT_FORM) }}
        onClick={() => navigate(`/task/${encodeId(item.id)}`)}
        showActionsOnHover
      />
    )}
  </PartnerPermissionsWrapper>
);

const defaultProps = {
  renderItem: defaultRenderItem,
};

const TaskGridView = (props: Props) => {
  const { items, onLoadMore, hasMore, isLoading, renderItem = defaultRenderItem } = props;

  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth="195px"
      isEmpty={items.length === 0}
      emptyMessage={<FormattedMessage id="modules.Tasks.noItem" defaultMessage="No tasks found" />}
    >
      {items.map(renderItem)}
    </GridView>
  );
};

TaskGridView.defaultProps = defaultProps;

export default TaskGridView;
