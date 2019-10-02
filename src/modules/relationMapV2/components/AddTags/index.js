// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { useAllHasPermission } from 'components/Context/Permissions';
import { RelationMapContext } from 'modules/relationMapV2/components/OrderFocus/store';
import { Entities } from 'modules/relationMapV2/store';
import { ORDER, ORDER_ITEM, BATCH, CONTAINER, SHIPMENT } from 'modules/relationMapV2/constants';
import { TAG_LIST } from 'modules/permission/constants/tag';
import { ORDER_UPDATE, ORDER_SET_TAGS } from 'modules/permission/constants/order';
import { BATCH_UPDATE, BATCH_SET_TAGS } from 'modules/permission/constants/batch';
import { ORDER_ITEMS_UPDATE, ORDER_ITEMS_SET_TAGS } from 'modules/permission/constants/orderItem';
import { CONTAINER_UPDATE, CONTAINER_SET_TAGS } from 'modules/permission/constants/container';
import { SHIPMENT_UPDATE, SHIPMENT_SET_TAGS } from 'modules/permission/constants/shipment';
import { BaseButton } from 'components/Buttons';
import { FieldItem, Label, TagsInput } from 'components/Form';
import FormattedNumber from 'components/FormattedNumber';
import Tag from 'components/Tag';
import {
  ordersByIDsQuery,
  orderItemsByIDsQuery,
  batchesByIDsQuery,
  containersByIDsQuery,
  shipmentsByIDsQuery,
} from './query';
import ActionDialog, {
  OrdersLabelIcon,
  OrderLabelIcon,
  ItemsLabelIcon,
  ItemLabelIcon,
  BatchesLabelIcon,
  BatchLabelIcon,
  ContainerLabelIcon,
  ContainersLabelIcon,
  ShipmentLabelIcon,
  ShipmentsLabelIcon,
  TagsLabelIcon,
  TagLabelIcon,
} from '../ActionDialog';
import { entitiesUpdateManyMutation } from './mutation';
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

  let dialogMessage = null;
  let dialogSubMessage = null;
  let entityLabel = null;
  let numOfEntity = null;

  if (noPermission) {
    // No permission to add tags
    switch (source) {
      case ORDER:
        entityLabel = <OrderLabelIcon />;
        break;
      case ORDER_ITEM:
        entityLabel = <ItemLabelIcon />;
        break;
      case BATCH:
        entityLabel = <BatchLabelIcon />;
        break;
      case CONTAINER:
        entityLabel = <ContainerLabelIcon />;
        break;
      case SHIPMENT:
        entityLabel = <ShipmentLabelIcon />;
        break;
      default:
        break;
    }
    dialogMessage = (
      <FormattedMessage
        id="modules.RelationMap.addTags.noPermission"
        defaultMessage="At least one {entityLabel} selected does not allow you to add tags."
        values={{ entityLabel }}
      />
    );
    dialogSubMessage = (
      <FormattedMessage
        id="modules.RelationMap.actions.tryAgain"
        defaultMessage="Please reselect and try again."
      />
    );
  } else {
    switch (source) {
      case ORDER:
        numOfEntity = <FormattedNumber value={totalOrders} />;
        entityLabel = totalOrders > 1 ? <OrdersLabelIcon /> : <OrderLabelIcon />;
        break;
      case ORDER_ITEM:
        numOfEntity = <FormattedNumber value={totalOrderItems} />;
        entityLabel = totalOrderItems > 1 ? <ItemsLabelIcon /> : <ItemLabelIcon />;
        break;
      case BATCH:
        numOfEntity = <FormattedNumber value={totalBatches} />;
        entityLabel = totalBatches > 1 ? <BatchesLabelIcon /> : <BatchLabelIcon />;
        break;
      case CONTAINER:
        numOfEntity = <FormattedNumber value={totalContainers} />;
        entityLabel = totalContainers > 1 ? <ContainersLabelIcon /> : <ContainerLabelIcon />;
        break;
      case SHIPMENT:
        numOfEntity = <FormattedNumber value={totalShipments} />;
        entityLabel = totalShipments > 1 ? <ShipmentsLabelIcon /> : <ShipmentLabelIcon />;
        break;
      default:
        break;
    }
    if (isProcessing) {
      // Is currently adding tags

      dialogMessage = (
        <FormattedMessage
          id="modules.RelationMap.addTags.addingTo"
          defaultMessage="Adding {tagsLabel} {selectedTags} to {numOfEntity} {entityLabel} ..."
          values={{
            tagsLabel: tags.length > 1 ? <TagsLabelIcon /> : <TagLabelIcon />,
            selectedTags: (
              <span>
                {tags.map(tag => (
                  <span style={{ marginRight: '5px' }}>
                    <Tag tag={tag} />
                  </span>
                ))}
              </span>
            ),
            numOfEntity,
            entityLabel,
          }}
        />
      );
    } else {
      // Has permission to add tags
      dialogMessage = (
        <FormattedMessage
          id="modules.RelationMap.addTags.message1"
          defaultMessage="Select {tagsLabel} to add to the {numOfEntity} {entityLabel} that you have selected"
          values={{
            tagsLabel: <TagsLabelIcon />,
            numOfEntity,
            entityLabel,
          }}
        />
      );
    }
  }

  return (
    <ActionDialog
      isOpen={isOpen}
      isProcessing={isProcessing}
      onCancel={onCancel}
      title={<FormattedMessage id="modules.RelationMap.label.addTags" defaultMessage="ADD TAGS" />}
      dialogMessage={dialogMessage}
      dialogSubMessage={dialogSubMessage}
      buttons={
        <BaseButton
          label={
            <FormattedMessage id="modules.RelationMap.label.addTags" defaultMessage="ADD TAGS" />
          }
          icon="TAG"
          disabled={isProcessing || noPermission || tags.length === 0}
          onClick={onConfirm}
        />
      }
    >
      {!(isProcessing || noPermission) && (
        <FieldItem
          vertical
          label={
            <Label height="30px">
              <FormattedMessage id="modules.RelationMap.label.tags" defaultMessage="TAGS" />
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
              width="340px"
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
      )}
    </ActionDialog>
  );
}
