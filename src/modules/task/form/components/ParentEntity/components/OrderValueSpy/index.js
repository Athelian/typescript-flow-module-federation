// @flow
import * as React from 'react';
import client from 'apollo';
import emitter from 'utils/emitter';
import { getByPath } from 'utils/fp';
import logger from 'utils/logger';
import { START_DATE } from 'modules/task/form/components/TaskInfoSection/constants';
import { calculateDate } from 'modules/task/form/components/TaskInfoSection/helpers';
import { orderDetailQuery } from './query';

type Props = {
  values: Object,
  task: Object,
  setTaskValue: Function,
};

const MappingFields = {
  OrderIssuedAt: 'issuedAt',
};

export default function OrderValueSpy({ values, task, setTaskValue }: Props) {
  React.useEffect(() => {
    emitter.addListener(
      'FIND_ORDER_VALUE',
      async ({
        field,
        entityId,
        selectedField,
        autoDateDuration,
        autoDateOffset,
      }: {
        field: string,
        entityId: string,
        selectedField: string,
        autoDateDuration?: Object,
        autoDateOffset?: Object,
      }) => {
        logger.warn({
          field,
          entityId,
          selectedField,
        });

        if (values.id) {
          let date = getByPath(MappingFields[field] || 'N/A', values);
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
              setTaskValue('dueDate', date);
            }
          }
        } else {
          logger.warn('query order data for id', client);
          // TODO: This flag will be used for showing loading on UI
          emitter.emit('LIVE_VALUE_PROCESS', true);
          const { data } = await client.query({
            query: orderDetailQuery,
            variables: { id: entityId },
            fetchPolicy: 'cache-first',
          });
          emitter.emit('LIVE_VALUE_PROCESS', false);

          let date = getByPath(MappingFields[field] || 'N/A', data.order);
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
              setTaskValue('dueDate', date);
            }
          }
        }
      }
    );

    return () => {
      emitter.removeAllListeners('FIND_ORDER_VALUE');
    };
  });
  return null;
}
