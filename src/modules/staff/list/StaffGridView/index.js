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
  padding?: string,
};

const defaultRenderItem = (item: Object) => <StaffCard key={item.id} staff={item} />;

const defaultProps = {
  renderItem: defaultRenderItem,
};

const StaffGridView = ({
  items,
  onLoadMore,
  hasMore,
  isLoading,
  renderItem = defaultRenderItem,
  padding,
}: Props) => {
  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth="195px"
      isEmpty={items.length === 0}
      emptyMessage={
        <FormattedMessage id="modules.Staff.noStaffFound" defaultMessage="No staff found" />
      }
      padding={padding}
    >
      {items.map(item => renderItem(item))}
    </GridView>
  );
};

StaffGridView.defaultProps = defaultProps;

export default StaffGridView;
