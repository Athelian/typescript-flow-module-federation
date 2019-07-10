// @flow
import * as React from 'react';
import client from 'apollo';
import emitter from 'utils/emitter';
import { getByPath } from 'utils/fp';
import logger from 'utils/logger';
import { decodeId } from 'utils/id';
import { orderItemAutoDateQuery } from './query';
import { mappingDate } from '../mappingDate';
import { autoCalculateDate, bindingRelateField } from '../autoCalculateDate';
import type { Offset, BindingField, Duration } from '../type.js.flow';

type Props = {
  values: Object,
  entity: Object,
  location: Object,
  task: Object,
  setTaskValue: Function,
};

export const MappingFields = {
  OrderItemOrderIssuedAt: 'issuedAt',
  OrderItemOrderDeliveryDate: 'deliveryDate',
  ProjectDueDate: 'milestone.project.dueDate',
  MilestoneDueDate: 'milestone.dueDate',
  TaskStartDate: 'startDate',
  TaskDueDate: 'dueDate',
};

export default function OrderItemValueSpy({ entity, values, task, location, setTaskValue }: Props) {
  React.useEffect(() => {
    emitter.addListener('FIND_ORDERITEM_VALUE', (bindingData: mixed) => {
      const field = getByPath('field', bindingData);
      const selectedField: BindingField = getByPath('selectedField', bindingData);
      const autoDateDuration: Duration = getByPath('autoDateDuration', bindingData);
      const autoDateOffset: Offset = getByPath('autoDateOffset', bindingData);
      const hasCircleBindingError: boolean = getByPath('hasCircleBindingError', bindingData);
      logger.warn({
        field,
        selectedField,
        autoDateDuration,
        autoDateOffset,
        hasCircleBindingError,
      });

      if (hasCircleBindingError) {
        setTaskValue('dueDate', '');
        setTaskValue('startDate', '');
        return;
      }

      const { pathname } = location;
      const isUnderOrderModule = pathname.includes('/order/');
      const [, activeType, orderItemId] = pathname.split('/') || [];
      logger.warn({
        field,
        selectedField,
        orderItemId,
        location,
        entity,
        activeType,
      });
      // We will query the order data if open a task on relation map or from order item detail
      if (!isUnderOrderModule) {
        const entityId =
          orderItemId && activeType === 'order-item' ? decodeId(orderItemId) : task.entity.id;
        logger.warn('query order data for id', client, entityId);
        // TODO: This flag will be used for showing loading on UI
        emitter.emit('LIVE_VALUE_PROCESS', true);
        client
          .query({
            query: orderItemAutoDateQuery,
            variables: { id: entityId },
            fetchPolicy: 'cache-first',
          })
          .then(({ data }) => {
            emitter.emit('LIVE_VALUE_PROCESS', false);

            logger.warn('order item data', data);
            const { order } = data.orderItem;
            let date = mappingDate({
              field,
              task,
              values: order,
              mappingFields: MappingFields,
            });
            date = autoCalculateDate({
              autoDateDuration,
              date,
              autoDateOffset,
              field,
              setTaskValue,
              selectedField,
            });
            bindingRelateField({
              selectedField,
              task,
              date,
              setTaskValue,
            });
          });
      } else {
        let date = mappingDate({ field, task, values, mappingFields: MappingFields });
        date = autoCalculateDate({
          autoDateDuration,
          date,
          autoDateOffset,
          field,
          setTaskValue,
          selectedField,
        });
        bindingRelateField({
          selectedField,
          date,
          task,
          setTaskValue,
        });
      }
    });

    return () => {
      emitter.removeAllListeners('FIND_ORDERITEM_VALUE');
    };
  });
  return null;
}
