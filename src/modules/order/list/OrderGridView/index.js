// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import { encodeId } from 'utils/id';
import {
  ORDER_CREATE,
  ORDER_UPDATE,
  ORDER_FORM,
  ORDER_SET_ARCHIVED,
} from 'modules/permission/constants/order';
import GridView from 'components/GridView';
import { OrderCard, CardAction } from 'components/Cards';
import { OrderActivateDialog, OrderArchiveDialog } from 'modules/order/common/Dialog';
import PartnerPermissionsWrapper from 'components/PartnerPermissionsWrapper';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  renderItem?: (item: Object) => React.Node,
};

const defaultRenderItem = (item: Object): React.Node => (
  <PartnerPermissionsWrapper key={item.id} data={item}>
    {permissions => {
      const canCreate = permissions.includes(ORDER_CREATE);
      const canChangeStatus =
        permissions.includes(ORDER_UPDATE) || permissions.includes(ORDER_SET_ARCHIVED);
      const canViewForm = permissions.includes(ORDER_FORM);
      return (
        <BooleanValue>
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
                  ...(canChangeStatus
                    ? [
                        <CardAction
                          icon={item.archived ? 'ACTIVE' : 'ARCHIVE'}
                          onClick={() => dialogToggle(true)}
                        />,
                      ]
                    : []),
                ]}
                showActionsOnHover
                onClick={() => {
                  if (canViewForm) {
                    navigate(`/order/${encodeId(item.id)}`);
                  }
                }}
              />
            </>
          )}
        </BooleanValue>
      );
    }}
  </PartnerPermissionsWrapper>
);

const OrderGridView = ({
  items,
  onLoadMore,
  hasMore,
  isLoading,
  renderItem = defaultRenderItem,
}: Props): React.Node => {
  console.log('[debug]', 'order items are ', items);
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
      {items.map(renderItem)}
    </GridView>
  );
};

export default OrderGridView;
