// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import GridView from 'components/GridView';
import { StaffCard } from 'components/Cards';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  renderItem?: (item: Object) => React.Node,
};

const defaultRenderItem = (item: Object) => (
  <StaffCard key={item.id} staff={item} onClick={() => {}} />
);

const defaultProps = {
  renderItem: defaultRenderItem,
};

const StaffGridView = (props: Props) => {
  const { items, onLoadMore, hasMore, isLoading, renderItem = defaultRenderItem } = props;

  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth="200px"
      isEmpty={items.length === 0}
      emptyMessage={
        <FormattedMessage id="modules.staff.noStaffFound" defaultMessage="No staff found" />
      }
    >
      {items.map(item => renderItem(item))}
    </GridView>
  );
};

StaffGridView.defaultProps = defaultProps;

export default StaffGridView;
