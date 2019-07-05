// @flow
import * as React from 'react';
import type { Order, Task } from 'generated/graphql';
import client from 'apollo';
import emitter from 'utils/emitter';
import { getByPath } from 'utils/fp';
import logger from 'utils/logger';
import { START_DATE } from 'modules/task/form/components/TaskInfoSection/constants';
import { decodeId } from 'utils/id';
import { calculateDate, findDuration } from 'modules/task/form/components/TaskInfoSection/helpers';
import { orderItemAutoDateQuery } from './query';

type Props = {
  values: Object,
  entity: Object,
  location: Object,
  task: Object,
  setTaskValue: Function,
};

export const MappingFields = {
  OrderItemOrderIssuedAt: 'issuedAt',
  ProjectDueDate: 'milestone.project.dueDate',
  MilestoneDueDate: 'milestone.dueDate',
};

const mappingDate = ({ field, task, values }: { field: string, task: Task, values: Order }) => {
  const path = MappingFields[field] || 'N/A';
  if (path.includes('milestone')) {
    return getByPath(path, task);
  }

  return getByPath(path, values);
};

export default function OrderItemValueSpy({ entity, values, task, location, setTaskValue }: Props) {
  React.useEffect(() => {
    emitter.addListener('FIND_ORDERITEM_VALUE', (bindingData: mixed) => {
      const field = getByPath('field', bindingData);
      const selectedField = getByPath('selectedField', bindingData);
      const autoDateDuration = getByPath('autoDateDuration', bindingData);
      const autoDateOffset = getByPath('autoDateOffset', bindingData);
      const { pathname } = location;
      const isUnderRelationMapOrProject =
        pathname.includes('/relation-map') || pathname.includes('/project');
      const [, activeType, orderItemId] = pathname.split('/') || [];
      logger.warn({
        field,
        selectedField,
        orderItemId,
        location,
        entity,
      });
      // We will query the order data if open a task on relation map or from order item detail
      if (isUnderRelationMapOrProject || (orderItemId && activeType === 'order-item')) {
        const entityId = isUnderRelationMapOrProject ? entity.id : decodeId(orderItemId);
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

            let date = mappingDate({ field, task, values: order });
            if (autoDateDuration) {
              date = calculateDate({
                date,
                duration: autoDateDuration.metric,
                offset:
                  autoDateOffset === 'after' ? autoDateDuration.value : -autoDateDuration.value,
              });
            }

            if (field !== START_DATE) {
              setTaskValue(selectedField, date);
              emitter.emit('LIVE_VALUE', field, date);
            } else {
              setTaskValue(
                selectedField,
                autoDateDuration
                  ? calculateDate({
                      date: task.startDate,
                      duration: autoDateDuration.metric,
                      offset:
                        autoDateOffset === 'after'
                          ? autoDateDuration.value
                          : -autoDateDuration.value,
                    })
                  : task.startDate
              );
            }

            // we need to set the due date if those field are binding together
            if (selectedField === 'startDate') {
              if (task.dueDateBinding === START_DATE) {
                const { weeks, months, days } = task.dueDateInterval || {};
                setTaskValue(
                  'dueDate',
                  calculateDate({
                    date,
                    duration: findDuration({ weeks, months }),
                    offset: weeks || months || days,
                  })
                );
              }
            }
          });
      } else {
        let date = mappingDate({ field, task, values });
        if (autoDateDuration) {
          date = calculateDate({
            date,
            duration: autoDateDuration.metric,
            offset: autoDateOffset === 'after' ? autoDateDuration.value : -autoDateDuration.value,
          });
        }
        if (field !== START_DATE) {
          setTaskValue(selectedField, date);
          emitter.emit('LIVE_VALUE', field, date);
        } else {
          setTaskValue(
            selectedField,
            autoDateDuration
              ? calculateDate({
                  date: task.startDate,
                  duration: autoDateDuration.metric,
                  offset:
                    autoDateOffset === 'after' ? autoDateDuration.value : -autoDateDuration.value,
                })
              : task.startDate
          );
        }

        // we need to set the due date if those field are binding together
        if (selectedField === 'startDate') {
          if (task.dueDateBinding === START_DATE) {
            const { weeks, months, days } = task.dueDateInterval || {};
            setTaskValue(
              'dueDate',
              calculateDate({
                date,
                duration: findDuration({ weeks, months }),
                offset: weeks || months || days,
              })
            );
          }
        }
      }
    });

    return () => {
      emitter.removeAllListeners('FIND_ORDERITEM_VALUE');
    };
  });
  return null;
}
