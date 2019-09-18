// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { RelationMapContext } from 'modules/relationMapV2/components/OrderFocus/store';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { ORDER, ORDER_ITEM, BATCH, CONTAINER, SHIPMENT } from 'modules/relationMapV2/constants';
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
  const totalOrders = orderIds.length;
  const itemIds = targetedIds(targets, ORDER_ITEM);
  const totalOrderItems = itemIds.length;
  const batchIds = targetedIds(targets, BATCH);
  const totalBatches = batchIds.length;
  const containerIds = targetedIds(targets, CONTAINER);
  const totalContainers = containerIds.length;
  const shipmentIds = targetedIds(targets, SHIPMENT);
  const totalShipments = shipmentIds.length;

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

  return (
    <Dialog isOpen={isOpen} width="450px">
      <div className={DialogStyle}>
        <h3 className={ConfirmMessageStyle}>
          Select tags to add to the{' '}
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
          that you have selected
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
              // TODO: check permission cross entities
              editable={
                isProcessing
                  ? { set: false, remove: false }
                  : {
                      set: true,
                      remove: true,
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
