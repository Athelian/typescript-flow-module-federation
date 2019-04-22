// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ORDER_ITEMS_FORM } from 'modules/permission/constants/orderItem';
import GridView from 'components/GridView';
import usePermission from 'hooks/usePermission';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  renderItem?: (item: Object) => React.Node,
};

const defaultRenderItem = (item: Object): React.Node => <div>{JSON.stringify(item)}</div>;

const OrderItemGridView = ({
  items,
  onLoadMore,
  hasMore,
  isLoading,
  renderItem = defaultRenderItem,
}: Props): React.Node => {
  const { hasPermission } = usePermission();
  const viewForm = hasPermission(ORDER_ITEMS_FORM);

  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth="195px"
      isEmpty={items.length === 0}
      emptyMessage={
        <FormattedMessage
          id="modules.OrderItems.noOrderItemFound"
          defaultMessage="No order Items found"
        />
      }
    >
      {items.map(item => renderItem({ ...item, viewForm }))}
    </GridView>
  );
};

export default OrderItemGridView;
