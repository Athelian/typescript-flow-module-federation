/* eslint-disable */
// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { useApolloClient } from '@apollo/react-hooks';
import { extractForbiddenId } from 'utils/data';
import { useAllHasPermission } from 'contexts/Permissions';
import { Entities, FocusedView } from 'modules/relationMapV2/store';
import { ORDER, ORDER_ITEM, BATCH, CONTAINER, SHIPMENT } from 'modules/relationMapV2/constants';
import { TAG_GET } from 'modules/permission/constants/tag';
import { ORDER_UPDATE, ORDER_SET_TAGS } from 'modules/permission/constants/order';
import { BATCH_UPDATE, BATCH_SET_TAGS } from 'modules/permission/constants/batch';
import { ORDER_ITEMS_UPDATE, ORDER_ITEMS_SET_TAGS } from 'modules/permission/constants/orderItem';
import { CONTAINER_UPDATE, CONTAINER_SET_TAGS } from 'modules/permission/constants/container';
import { SHIPMENT_EDIT, SHIPMENT_SET_TAGS } from 'modules/permission/constants/shipment';
import { BaseButton } from 'components/Buttons';
import { FieldItem, Label, TagsInput } from 'components/Form';
import FormattedNumber from 'components/FormattedNumber';
import Tag from 'components/Tag';
import {
  targetedIds,
  findOrderIdByItem,
  findParentIdsByBatch,
  findOrderIdsByContainer,
  findOrderIdsByShipment,
  findShipmentIdByContainer,
  findShipmentIdByBatch,
  findShipmentIdsByOrderItem,
  findShipmentIdsByOrder,
} from 'modules/relationMapV2/helpers';
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
} from 'components/Dialog/ActionDialog';
import {
  ordersByIDsQuery,
  orderItemsByIDsQuery,
  batchesByIDsQuery,
  containersByIDsQuery,
  shipmentsByIDsQuery,
} from './query';
import { shipmentPartialQuery } from './../../query';
import { entitiesUpdateManyMutation } from './mutation';

type Props = {|
  onSuccess: (ids: Array<string>) => void,
|};

/**
 * Used on shipments, containers, orders and order items
 */
export default function AddTags({ onSuccess }: Props) {
  const { mapping } = Entities.useContainer();
  const client = useApolloClient();
  const [tags, setTags] = React.useState([]);
  const { dispatch, state, selectors } = FocusedView.useContainer();
  const [isLoading, setIsLoading] = React.useState();
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
  const isOpenRef = React.useRef(isOpen);
  isOpenRef.current = isOpen;

  React.useEffect(() => {
    return () => {
      // runs when tags modal closes
      if (isOpen) setTags([]);
    };
  }, [isOpen]);

  const { orderIds, itemIds, batchIds, containerIds, shipmentIds } = React.useMemo(() => {
    return {
      orderIds: targetedIds(targets, ORDER),
      itemIds: targetedIds(targets, ORDER_ITEM),
      batchIds: targetedIds(targets, BATCH),
      containerIds: targetedIds(targets, CONTAINER),
      shipmentIds: targetedIds(targets, SHIPMENT),
    };
  }, [targets]);

  React.useEffect(() => {
    // if open and tag data for chosen entities are not ready
    if (!isOpen) {
      return;
    }
    // orderIds
    // orderIds.map(id => mapping.entities?.orders?.[id]?.ownedBy).filter(Boolean)
    // itemIds
    // itemIds.map(id => mapping.entities?.orderItems?.[id]?.ownedBy)
    // batchIds
    // batchIds.map(id => mapping.entities?.batches?.[id]?.ownedBy)
    // containerIds
    // containerIds.map(id => mapping.entities?.containers?.[id]?.ownedBy)
    // shipmentIds
    // shipmentIds.map(id => mapping.entities?.shipments?.[id]?.ownedBy)

    const orderOwners = orderIds.map(id => mapping.entities?.orders?.[id]?.ownedBy);
    const itemOwners = itemIds.map(id => mapping.entities?.orderItems?.[id]?.ownedBy);
    const batchOwners = batchIds.map(id => mapping.entities?.batches?.[id]?.ownedBy);
    const containerOwners = containerIds.map(id => mapping.entities?.containers?.[id]?.ownedBy);
    const shipmentOwners = shipmentIds.map(id => mapping.entities?.shipments?.[id]?.ownedBy);

    console.log(
      'owners are',
      orderOwners,
      itemOwners,
      batchOwners,
      containerOwners,
      shipmentOwners
    );

    const hasUndefined =
      orderOwners.some(owner => !owner) ||
      itemOwners.some(owner => !owner) ||
      batchOwners.some(owner => !owner) ||
      shipmentOwners.some(owner => !owner) ||
      containerOwners.some(owner => !owner);
    console.log('hasUndefined', hasUndefined);

    // if undefined then means that it either parent is forbidden
    // or parent is from summary query
    if (hasUndefined) {
      console.log('mapping.entities', mapping.entities);
      console.log(containerIds);
      // TODO: check if shipment view or order view here
      const isShipmentView = true;

      const shipmentIds = Object.keys(mapping?.entities?.shipments).reduce((set, shipmentId) => {
        // TODO: can improve perf here
        const shipmentHasContainer = mapping?.entities?.shipments[
          shipmentId
        ]?.containers.some(containerId => containerIds.includes(containerId));

        if (shipmentHasContainer) {
          set.add(shipmentId);
        }

        return set;
      }, new Set());

      console.log('shipment ids are ', [...shipmentIds]);

      if (shipmentIds.size) {
        console.log('shipment ids are ', [...shipmentIds]);
        client
          .query({
            query: shipmentPartialQuery,
            variables: {
              ids: [...shipmentIds],
            },
            fetchPolicy: 'network-only',
          })
          .then(result => {
            console.log('result is ', result);
          });
      }
      // TODO: set loading to true somewhere
    }
    /* 
      entities that are needed to load
      orders ownedBy
      orderItems ownedBy
      batches ownedBy
      containers ownedBy
    */
    // load things here
    // client.query blblabala. use isOpenRef
  }, [isOpen, orderIds]);

  const hasOrderPermissions = useAllHasPermission(
    orderIds.map(id => mapping.entities?.orders?.[id]?.ownedBy).filter(Boolean)
  );

  const totalOrders = orderIds.length;
  const hasItemPermissions = useAllHasPermission(
    itemIds.map(id => mapping.entities?.orderItems?.[id]?.ownedBy).filter(Boolean)
  );
  const totalOrderItems = itemIds.length;
  const hasBatchPermissions = useAllHasPermission(
    batchIds.map(id => mapping.entities?.batches?.[id]?.ownedBy).filter(Boolean)
  );
  const totalBatches = batchIds.length;
  console.log('[debug] targets', targets);
  console.log('[debug] container Ids are', containerIds);

  // TODO: take note of permissions
  const hasContainerPermissions = useAllHasPermission(
    containerIds.map(id => mapping.entities?.containers?.[id]?.ownedBy).filter(Boolean)
  );

  console.log(
    '[debug] hasContainerPermissions ',
    containerIds.map(id => mapping.entities?.containers?.[id]?.ownedBy)
  );

  const totalContainers = containerIds.length;
  const hasShipmentPermissions = useAllHasPermission(
    shipmentIds.map(id => mapping.entities?.shipments?.[id]?.ownedBy).filter(Boolean)
  );

  console.log(
    '[debug] hasShipmentPermissions ',
    shipmentIds.map(id => mapping.entities?.shipments?.[id]?.ownedBy)
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
        return hasPermission([SHIPMENT_EDIT, SHIPMENT_SET_TAGS]);
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
                  tagIds: [
                    ...new Set([...order.tags.map(tag => extractForbiddenId(tag).id), ...tagIds]),
                  ].filter(Boolean),
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
                  tagIds: [
                    ...new Set([...item.tags.map(tag => extractForbiddenId(tag).id), ...tagIds]),
                  ].filter(Boolean),
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
                  tagIds: [
                    ...new Set([...item.tags.map(tag => extractForbiddenId(tag).id), ...tagIds]),
                  ].filter(Boolean),
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
                  tagIds: [
                    ...new Set([...item.tags.map(tag => extractForbiddenId(tag).id), ...tagIds]),
                  ].filter(Boolean),
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
                  tagIds: [
                    ...new Set([...item.tags.map(tag => extractForbiddenId(tag).id), ...tagIds]),
                  ].filter(Boolean),
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
          if (selectors.isOrderFocus) {
            const ids = (result.data?.entitiesUpdateMany?.orders ?? []).map(order => order.id);
            if ((result.data?.entitiesUpdateMany?.orderItems ?? []).length) {
              (result.data?.entitiesUpdateMany?.orderItems ?? []).forEach(item => {
                const parentOrderId = findOrderIdByItem({
                  orderItemId: item.id,
                  entities: mapping.entities,
                  viewer: state.viewer,
                });
                if (parentOrderId) {
                  ids.push(parentOrderId);
                }
              });
            }
            if ((result.data?.entitiesUpdateMany?.batches ?? []).length) {
              (result.data?.entitiesUpdateMany?.batches ?? []).forEach(batch => {
                const [, parentOrderId] = findParentIdsByBatch({
                  batchId: batch.id,
                  entities: mapping.entities,
                  viewer: state.viewer,
                });
                if (parentOrderId) {
                  ids.push(parentOrderId);
                }
              });
            }

            if ((result.data?.entitiesUpdateMany?.containers ?? []).length) {
              (result.data?.entitiesUpdateMany?.containers ?? []).forEach(container =>
                ids.push(
                  ...findOrderIdsByContainer({
                    viewer: state.viewer,
                    containerId: container.id,
                    entities: mapping.entities,
                  })
                )
              );
            }
            if ((result.data?.entitiesUpdateMany?.shipments ?? []).length) {
              (result.data?.entitiesUpdateMany?.shipments ?? []).forEach(shipment =>
                ids.push(
                  ...findOrderIdsByShipment({
                    shipmentId: shipment.id,
                    entities: mapping.entities,
                    viewer: state.viewer,
                  })
                )
              );
            }
            onSuccess(ids);
          } else {
            const ids = (result.data?.entitiesUpdateMany?.shipments ?? []).map(
              shipment => shipment.id
            );

            console.log('[debug] update shipment ids are', JSON.parse(JSON.stringify(ids)));
            if ((result.data?.entitiesUpdateMany?.containers ?? []).length) {
              (result.data?.entitiesUpdateMany?.containers ?? []).forEach(container =>
                ids.push(findShipmentIdByContainer(container.id, mapping.entities))
              );
              console.log('[debug] update containers ids are', JSON.parse(JSON.stringify(ids)));
            }
            if ((result.data?.entitiesUpdateMany?.batches ?? []).length) {
              ids.push(
                ...(result.data?.entitiesUpdateMany?.batches ?? []).map(batch =>
                  findShipmentIdByBatch(batch.id, mapping.entities)
                )
              );
            }
            if ((result.data?.entitiesUpdateMany?.orderItems ?? []).length) {
              ids.push(
                ...(result.data?.entitiesUpdateMany?.orderItems ?? []).flatMap(item =>
                  findShipmentIdsByOrderItem(item.id, mapping.entities)
                )
              );
            }
            if ((result.data?.entitiesUpdateMany?.orders ?? []).length) {
              ids.push(
                ...(result.data?.entitiesUpdateMany?.orders ?? []).flatMap(order =>
                  findShipmentIdsByOrder(order.id, mapping.entities)
                )
              );
            }
            onSuccess(ids);
          }
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
    mapping.entities,
    onCancel,
    onSuccess,
    orderItemsResult.called,
    orderItemsResult.data,
    orderItemsResult.loading,
    ordersResult,
    selectors.isOrderFocus,
    shipmentsResult.called,
    shipmentsResult.data,
    shipmentsResult.loading,
    source,
    state.viewer,
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
        console.log('load containers', containerIds);
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
                  <span key={tag.id} style={{ marginRight: '5px' }}>
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
          disabled={noPermission || tags.length === 0}
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
                      set: hasPermission(TAG_GET) && allowToUpdate(),
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
