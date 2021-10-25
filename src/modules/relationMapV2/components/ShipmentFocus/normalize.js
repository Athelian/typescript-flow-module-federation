import { normalize, schema } from 'normalizr';
import memoize from 'memoize-one';
import isDeepEqual from 'react-fast-compare';

const batch = new schema.Entity('batches');
const container = new schema.Entity('containers');
const orderItem = new schema.Entity('orderItems');
const shipment = new schema.Entity('shipments');
const order = new schema.Entity('orders');
const ownedBy = new schema.Entity('organizations');
const hit = new schema.Entity('hits');
const entity = new schema.Entity(
  'entity',
  {},
  { idAttribute: value => `${value.id}-${value.__typename}` }
);
const entityHit = new schema.Entity('entityHits');
entityHit.define({
  entity,
});
hit.define({
  entityHits: [entityHit],
});

batch.define({
  orderItem,
  shipment,
  container,
  ownedBy,
});

container.define({
  shipment,
  ownedBy,
});

orderItem.define({
  order,
  ownedBy,
});

order.define({
  ownedBy,
});

shipment.define({
  batches: [batch],
  containers: [container],
  ownedBy,
});

export default memoize(originalData => {
  const { entities } = normalize(originalData, { shipments: [shipment] });
  return entities;
}, isDeepEqual);

export const normalizeEntity = memoize(originalData => {
  const { entities } = normalize(originalData, { hits: [hit] });
  return entities;
}, isDeepEqual);

/**
 * Return an object which shows the relation of an entity to other entites
 */
export const getRelations = memoize(originalData => {
  const relations = originalData.reduce(
    (arr, shipmentEntity) => {
      const shipmentId = shipmentEntity.id;

      const containerMap = shipmentEntity.containers.reduce((containerArr, containerEntity) => {
        if (containerEntity?.id) {
          // eslint-disable-next-line
          containerArr[containerEntity.id] = {
            shipment: shipmentId,
          };
        }

        return containerArr;
      }, {});

      const { batches, orderItems, orders } = shipmentEntity.batches.reduce(
        (mapArr, batchEntity) => {
          const { container: containerEntity, orderItem: orderItemEntity } = batchEntity;

          if (batchEntity?.id) {
            // eslint-disable-next-line no-param-reassign
            mapArr.batches[batchEntity.id] = {
              shipment: shipmentId,
              container: containerEntity?.id,
              // orderItem: orderItemEntity?.id,
              // order: orderItemEntity?.orderEntity?.id,
              // productProvider: orderItemEntity?.productProvider?.id,
              // product: orderItemEntity?.productProvider?.product?.id,
            };
          }

          if (orderItemEntity?.id) {
            // eslint-disable-next-line no-param-reassign
            mapArr.orderItems[orderItemEntity.id] = {
              shipment: shipmentId,
              container: containerEntity?.id,
            };
          }

          if (orderItemEntity?.order?.id) {
            // eslint-disable-next-line no-param-reassign
            mapArr.orders[orderItemEntity?.order?.id] = {
              shipment: shipmentId,
              container: containerEntity?.id,
            };
          }

          return mapArr;
        },
        {
          batches: {},
          orderItems: {},
          orders: {},
        }
      );

      // eslint-disable-next-line no-param-reassign
      arr.batches = {
        ...arr.batches,
        ...batches,
      };

      // eslint-disable-next-line no-param-reassign
      arr.containers = {
        ...arr.containers,
        ...containerMap,
      };

      // eslint-disable-next-line no-param-reassign
      arr.orderItems = {
        ...arr.orderItems,
        ...orderItems,
      };

      // eslint-disable-next-line no-param-reassign
      arr.orders = {
        ...arr.orders,
        ...orders,
      };

      return arr;
    },
    {
      containers: {},
      shipments: {},
      batches: {},
      orders: {},
      orderItems: {},
      product: {},
      productProvider: {},
    }
  );

  return relations;
}, isDeepEqual);
