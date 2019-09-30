// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useAllHasPermission } from 'components/Context/Permissions';
import { RelationMapContext } from 'modules/relationMapV2/components/OrderFocus/store';
import { Entities } from 'modules/relationMapV2/store';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { ORDER, ORDER_ITEM, BATCH, CONTAINER, SHIPMENT } from 'modules/relationMapV2/constants';
import { TAG_LIST } from 'modules/permission/constants/tag';
import { ORDER_UPDATE, ORDER_SET_TAGS } from 'modules/permission/constants/order';
import { BATCH_UPDATE, BATCH_SET_TAGS } from 'modules/permission/constants/batch';
import { ORDER_ITEMS_UPDATE, ORDER_ITEMS_SET_TAGS } from 'modules/permission/constants/orderItem';
import { CONTAINER_UPDATE, CONTAINER_SET_TAGS } from 'modules/permission/constants/container';
import { SHIPMENT_UPDATE, SHIPMENT_SET_TAGS } from 'modules/permission/constants/shipment';
import { SaveButton, CancelButton } from 'components/Buttons';
import Dialog from 'components/Dialog';
import Icon from 'components/Icon';
import { FieldItem, Label, TagsInput } from 'components/Form';
import {
  ordersByIDsQuery,
  orderItemsByIDsQuery,
  batchesByIDsQuery,
  containersByIDsQuery,
  shipmentsByIDsQuery,
} from './query';
import { entitiesUpdateManyMutation } from './mutation';
import { DialogStyle, ButtonsStyle, ConfirmMessageStyle } from './style';
import { targetedIds } from '../OrderFocus/helpers';

type Props = {|
  onSuccess: (orderIds: Array<string>) => void,
|};

export default function AddTags({ onSuccess }: Props) {
  const { mapping } = Entities.useContainer();
  const [tags, setTags] = React.useState([]);
  const { dispatch, state } = React.useContext(RelationMapContext);
  const [loadOrders, ordersResult] = useLazyQuery(ordersByIDsQuery);
  const [loadOrderItems, orderItemsResult] = useLazyQuery(orderItemsByIDsQuery);
  const [loadBatches, batchesResult] = useLazyQuery(batchesByIDsQuery);
  const [loadContainers, containersResult] = useLazyQuery(containersByIDsQuery);
  const [loadShipments, shipmentsResult] = useLazyQuery(shipmentsByIDsQuery);
  const [updateEntities] = useMutation(entitiesUpdateManyMutation);
  const {
    targets,
    tags: { isOpen, isProcessing, source },
  } = state;
  React.useEffect(() => {
    return () => {
      if (isOpen) setTags([]);
    };
  }, [isOpen]);

  const orderIds = targetedIds(targets, ORDER);
  const hasOrderPermissions = useAllHasPermission(
    orderIds.map(id => mapping.entities?.orders?.[id]?.ownedBy).filter(Boolean)
  );
  const totalOrders = orderIds.length;
  const itemIds = targetedIds(targets, ORDER_ITEM);
  const hasItemPermissions = useAllHasPermission(
    itemIds.map(id => mapping.entities?.orderItems?.[id]?.ownedBy).filter(Boolean)
  );
  const totalOrderItems = itemIds.length;
  const batchIds = targetedIds(targets, BATCH);
  const hasBatchPermissions = useAllHasPermission(
    batchIds.map(id => mapping.entities?.batches?.[id]?.ownedBy).filter(Boolean)
  );
  const totalBatches = batchIds.length;
  const containerIds = targetedIds(targets, CONTAINER);
  const hasContainerPermissions = useAllHasPermission(
    containerIds.map(id => mapping.entities?.containers?.[id]?.ownedBy).filter(Boolean)
  );
  const totalContainers = containerIds.length;
  const shipmentIds = targetedIds(targets, SHIPMENT);
  const hasShipmentPermissions = useAllHasPermission(
    shipmentIds.map(id => mapping.entities?.shipments?.[id]?.ownedBy).filter(Boolean)
  );
  const totalShipments = shipmentIds.length;

  const hasPermission = (permission: string | Array<string>) => {
    switch (source) {
      case ORDER:
        return hasOrderPermissions(permission);
      case ORDER_ITEM:
        return hasItemPermissions(permission);
      case BATCH:
        return hasBatchPermissions(permission);
      case CONTAINER:
        return hasContainerPermissions(permission);
      case SHIPMENT:
        return hasShipmentPermissions(permission);
      default:
        return false;
    }
  };

  const allowToUpdate = () => {
    switch (source) {
      case ORDER:
        return hasPermission([ORDER_UPDATE, ORDER_SET_TAGS]);
      case ORDER_ITEM:
        return hasPermission([ORDER_ITEMS_UPDATE, ORDER_ITEMS_SET_TAGS]);
      case BATCH:
        return hasPermission([BATCH_UPDATE, BATCH_SET_TAGS]);
      case CONTAINER:
        return hasPermission([CONTAINER_UPDATE, CONTAINER_SET_TAGS]);
      case SHIPMENT:
        return hasPermission([SHIPMENT_UPDATE, SHIPMENT_SET_TAGS]);
      default:
        return false;
    }
  };

  const onCancel = React.useCallback(() => {
    dispatch({
      type: 'TAGS_END',
      payload: {},
    });
  }, [dispatch]);

  React.useEffect(() => {
    const isLoaded = () => {
      switch (source) {
        case ORDER:
          return ordersResult.called && !ordersResult.loading;
        case ORDER_ITEM:
          return orderItemsResult.called && !orderItemsResult.loading;
        case BATCH:
          return batchesResult.called && !batchesResult.loading;
        case CONTAINER:
          return containersResult.called && !containersResult.loading;
        case SHIPMENT:
          return shipmentsResult.called && !shipmentsResult.loading;

        default:
          return false;
      }
    };
    if (isProcessing && isLoaded()) {
      const tagIds = tags.map(tag => tag.id);
      const ordersInput =
        source === ORDER
          ? (ordersResult.data?.ordersByIDs ?? []).map(order => {
              return {
                id: order.id,
                input: {
                  tagIds: [...new Set([...order.tags.map(tag => tag.id), ...tagIds])],
                },
              };
            })
          : [];

      const orderItemsInput =
        source === ORDER_ITEM
          ? (orderItemsResult.data?.orderItemsByIDs ?? []).map(item => {
              return {
                id: item.id,
                input: {
                  tagIds: [...new Set([...item.tags.map(tag => tag.id), ...tagIds])],
                },
              };
            })
          : [];

      const batchesInput =
        source === BATCH
          ? (batchesResult.data?.batchesByIDs ?? []).map(item => {
              return {
                id: item.id,
                input: {
                  tagIds: [...new Set([...item.tags.map(tag => tag.id), ...tagIds])],
                },
              };
            })
          : [];
      const containersInput =
        source === CONTAINER
          ? (containersResult.data?.containersByIDs ?? []).map(item => {
              return {
                id: item.id,
                input: {
                  tagIds: [...new Set([...item.tags.map(tag => tag.id), ...tagIds])],
                },
              };
            })
          : [];
      const shipmentsInput =
        source === SHIPMENT
          ? (shipmentsResult.data?.shipmentsByIDs ?? []).map(item => {
              return {
                id: item.id,
                input: {
                  tagIds: [...new Set([...item.tags.map(tag => tag.id), ...tagIds])],
                },
              };
            })
          : [];
      updateEntities({
        variables: {
          orders: ordersInput,
          orderItems: orderItemsInput,
          batches: batchesInput,
          containers: containersInput,
          shipments: shipmentsInput,
        },
      })
        .then(result => {
          onSuccess((result.data?.entitiesUpdateMany?.orders ?? []).map(order => order.id));
        })
        .catch(onCancel);
    }
  }, [
    batchesResult.called,
    batchesResult.data,
    batchesResult.loading,
    containersResult.called,
    containersResult.data,
    containersResult.loading,
    isProcessing,
    onCancel,
    onSuccess,
    orderItemsResult.called,
    orderItemsResult.data,
    orderItemsResult.loading,
    ordersResult,
    shipmentsResult.called,
    shipmentsResult.data,
    shipmentsResult.loading,
    source,
    tags,
    updateEntities,
  ]);

  const onConfirm = () => {
    dispatch({
      type: 'TAGS_START',
      payload: {},
    });
    switch (source) {
      case ORDER:
        loadOrders({
          variables: { ids: orderIds },
        });
        break;
      case ORDER_ITEM:
        loadOrderItems({ variables: { ids: itemIds } });
        break;
      case BATCH:
        loadBatches({ variables: { ids: batchIds } });
        break;
      case CONTAINER:
        loadContainers({ variables: { ids: containerIds } });
        break;
      case SHIPMENT:
        loadShipments({ variables: { ids: shipmentIds } });
        break;

      default:
        break;
    }
  };

  const noPermission = !allowToUpdate();

  if (noPermission) {
    return (
      <Dialog isOpen={isOpen} width="450px">
        <div className={DialogStyle}>
          <h3 className={ConfirmMessageStyle}>
            <FormattedMessage
              id="modules.RelationMap.tags.noPermission"
              defaultMessage="At least one {source} {entity} selected does not allow you to add tags.Please reselect and try again."
              values={{
                source,
                entity: <Icon icon={source.toUpperCase()} />,
              }}
            />
          </h3>
          <div className={ButtonsStyle}>
            <CancelButton disabled={Boolean(isProcessing)} onClick={onCancel} />
          </div>
        </div>
      </Dialog>
    );
  }

  return (
    <Dialog isOpen={isOpen} width="450px">
      <div className={DialogStyle}>
        <h3 className={ConfirmMessageStyle}>
          {isProcessing ? (
            <FormattedMessage
              id="modules.RelationMap.tags.add"
              defaultMessage="Adding tags to add to the {source} that you have selected."
              values={{
                source: (
                  <>
                    {totalOrders > 0 && source === ORDER && (
                      <>
                        {totalOrders} <Icon icon="ORDER" />
                      </>
                    )}
                    {totalOrderItems > 0 && source === ORDER_ITEM && (
                      <>
                        {totalOrderItems} <Icon icon="ORDER_ITEM" />
                      </>
                    )}
                    {totalBatches > 0 && source === BATCH && (
                      <>
                        {totalBatches} <Icon icon="BATCH" />
                      </>
                    )}
                    {totalContainers > 0 && source === CONTAINER && (
                      <>
                        {totalContainers} <Icon icon="CONTAINER" />
                      </>
                    )}
                    {totalShipments > 0 && source === SHIPMENT && (
                      <>
                        {totalShipments} <Icon icon="SHIPMENT" />
                      </>
                    )}
                  </>
                ),
              }}
            />
          ) : (
            <FormattedMessage
              id="modules.RelationMap.tags.guideline"
              defaultMessage="Select tags to add to the {source} that you have selected."
              values={{
                source: (
                  <>
                    {totalOrders > 0 && source === ORDER && (
                      <>
                        {totalOrders} <Icon icon="ORDER" />
                      </>
                    )}
                    {totalOrderItems > 0 && source === ORDER_ITEM && (
                      <>
                        {totalOrderItems} <Icon icon="ORDER_ITEM" />
                      </>
                    )}
                    {totalBatches > 0 && source === BATCH && (
                      <>
                        {totalBatches} <Icon icon="BATCH" />
                      </>
                    )}
                    {totalContainers > 0 && source === CONTAINER && (
                      <>
                        {totalContainers} <Icon icon="CONTAINER" />
                      </>
                    )}
                    {totalShipments > 0 && source === SHIPMENT && (
                      <>
                        {totalShipments} <Icon icon="SHIPMENT" />
                      </>
                    )}
                  </>
                ),
              }}
            />
          )}
        </h3>
        <FieldItem
          vertical
          label={
            <Label height="30px">
              <FormattedMessage id="modules.Orders.tags" defaultMessage="TAGS" />
            </Label>
          }
          input={
            <TagsInput
              id="tags"
              name="tags"
              tagType={source}
              values={tags}
              onChange={setTags}
              onClickRemove={tag => setTags(tags.filter(({ id }) => tag.id !== id))}
              editable={
                isProcessing
                  ? { set: false, remove: false }
                  : {
                      set: hasPermission(TAG_LIST) && allowToUpdate(),
                      remove: allowToUpdate(),
                    }
              }
            />
          }
        />
        <div className={ButtonsStyle}>
          <CancelButton disabled={Boolean(isProcessing)} onClick={onCancel} />
          <SaveButton
            isLoading={Boolean(isProcessing)}
            disabled={Boolean(isProcessing) || tags.length === 0}
            onClick={onConfirm}
          />
        </div>
      </div>
    </Dialog>
  );
}
