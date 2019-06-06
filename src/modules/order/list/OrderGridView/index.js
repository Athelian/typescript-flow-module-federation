// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { FormattedMessage } from 'react-intl';
import { Query } from 'react-apollo';
import { BooleanValue } from 'react-values';
import { encodeId } from 'utils/id';
import { getByPath, getByPathWithDefault } from 'utils/fp';
import LoadingIcon from 'components/LoadingIcon';
import GridView from 'components/GridView';
import { partnerPermissionQuery } from 'components/common/QueryForm/query';
import { OrderCard, CardAction } from 'components/Cards';
import { ORDER_CREATE, ORDER_UPDATE, ORDER_FORM } from 'modules/permission/constants/order';
import { OrderActivateDialog, OrderArchiveDialog } from 'modules/order/common/Dialog';
import usePermission from 'hooks/usePermission';
import useUser from 'hooks/useUser';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
};

const Item1 = ({ item }: Object): React.Node => {
  const { hasPermission } = usePermission();
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

const Item2 = ({ item }: Object): React.Node => {
  return (
    <Query
      query={partnerPermissionQuery}
      variables={{ partnerId: getByPath('ownedBy.partner.id', item) }}
      fetchPolicy="cache-first"
    >
      {({ loading: isLoading, data, error: permissionError }) => {
        if (isLoading) return <LoadingIcon />;
        if (permissionError) {
          if (permissionError.message && permissionError.message.includes('403')) {
            navigate('/403');
          }

          return permissionError.message;
        }

        const permissions = getByPathWithDefault([], 'viewer.permissionsFromPartner', data);
        const canCreate = permissions.includes(ORDER_CREATE);
        const canUpdate = permissions.includes(ORDER_UPDATE);
        const canViewForm = permissions.includes(ORDER_FORM);

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
      }}
    </Query>
  );
};

const OrderGridView = ({ items, onLoadMore, hasMore, isLoading }: Props): React.Node => {
  const { isOwnerBy } = useUser();

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
      {items.map(item =>
        isOwnerBy(getByPath('ownedBy.partner.id', item)) ? (
          <Item1 key={item.id} item={item} />
        ) : (
          <Item2 key={item.id} item={item} />
        )
      )}
    </GridView>
  );
};

export default OrderGridView;
