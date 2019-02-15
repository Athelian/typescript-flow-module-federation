// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import { encodeId } from 'utils/id';
import GridView from 'components/GridView';
import { OrderCard, CardAction } from 'components/Cards';
import { OrderActivateDialog, OrderArchiveDialog } from 'modules/order/common/Dialog';
import usePermission from 'hooks/usePermission';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  renderItem?: (item: Object) => React.Node,
};

const defaultRenderItem = ({ canCreate, canUpdate, ...item }: Object): React.Node => (
  <BooleanValue key={item.id}>
    {({ value: statusDialogIsOpen, set: dialogToggle }) => (
      <>
        {item.archived ? (
          <OrderActivateDialog
            onRequestClose={() => dialogToggle(false)}
            isOpen={statusDialogIsOpen}
            order={item}
          />
        ) : (
          <OrderArchiveDialog
            onRequestClose={() => dialogToggle(false)}
            isOpen={statusDialogIsOpen}
            order={item}
          />
        )}
        <OrderCard
          order={item}
          actions={[
            ...(canCreate
              ? [
                  <CardAction
                    icon="CLONE"
                    onClick={() => navigate(`/order/clone/${encodeId(item.id)}`)}
                  />,
                ]
              : []),
            ...(canUpdate
              ? [
                  <CardAction
                    icon={item.archived ? 'ACTIVE' : 'ARCHIVE'}
                    onClick={() => dialogToggle(true)}
                  />,
                ]
              : []),
          ]}
          showActionsOnHover
        />
      </>
    )}
  </BooleanValue>
);

const OrderGridView = ({
  items,
  onLoadMore,
  hasMore,
  isLoading,
  renderItem = defaultRenderItem,
}: Props): React.Node => {
  const { hasPermission } = usePermission();
  const canCreate = hasPermission('order.orders.create');
  const canUpdate = hasPermission('order.orders.update');

  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth="195px"
      isEmpty={items.length === 0}
      emptyMessage={
        <FormattedMessage id="modules.Orders.noOrderFound" defaultMessage="No orders found" />
      }
    >
      {items.map(item => renderItem({ ...item, canCreate, canUpdate }))}
    </GridView>
  );
};

export default OrderGridView;
