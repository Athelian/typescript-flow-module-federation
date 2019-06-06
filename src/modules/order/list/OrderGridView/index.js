// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import { encodeId } from 'utils/id';
import GridView from 'components/GridView';
import { OrderCard, CardAction } from 'components/Cards';
import { ORDER_CREATE, ORDER_UPDATE, ORDER_FORM } from 'modules/permission/constants/order';
import { OrderActivateDialog, OrderArchiveDialog } from 'modules/order/common/Dialog';
import usePartnerPermission from 'hooks/usePartnerPermission';
import usePermission from 'hooks/usePermission';
import PartnerPermissionsWrapper from './PartnerPermissionsWrapper';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
};

const Card = ({ item }: Object): React.Node => {
  const { isOwner } = usePartnerPermission();
  const { hasPermission } = usePermission(isOwner);
  const canCreate = hasPermission(ORDER_CREATE);
  const canUpdate = hasPermission(ORDER_UPDATE);
  const canViewForm = hasPermission(ORDER_FORM);

  return (
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
};

const OrderGridView = ({ items, onLoadMore, hasMore, isLoading }: Props): React.Node => {
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
      {items.map(item => (
        <PartnerPermissionsWrapper key={item.id} data={item}>
          {data => <Card item={data} />}
        </PartnerPermissionsWrapper>
      ))}
    </GridView>
  );
};

export default OrderGridView;
