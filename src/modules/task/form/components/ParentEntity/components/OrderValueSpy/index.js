// @flow
import * as React from 'react';
import client from 'apollo';
import emitter from 'utils/emitter';
import { getByPath } from 'utils/fp';
import logger from 'utils/logger';
import useUser from 'hooks/useUser';
import { orderAutoDateQuery } from './query';
import { mappingDate } from '../mappingDate';
import { autoCalculateDate, bindingRelateField } from '../autoCalculateDate';
import type { Offset, BindingField, Duration } from '../type.js.flow';

type Props = {
  values: Object,
  inParentEntityForm: boolean,
  task: Object,
  setTaskValue: Function,
};

export const MappingFields = {
  OrderIssuedAt: 'issuedAt',
  OrderDeliveryDate: 'deliveryDate',
  ProjectDueDate: 'milestone.project.dueDate',
  MilestoneDueDate: 'milestone.dueDate',
  TaskStartDate: 'startDate',
  TaskDueDate: 'dueDate',
};

export default function OrderValueSpy({ values, task, inParentEntityForm, setTaskValue }: Props) {
  const { user } = useUser();
  React.useEffect(() => {
    emitter.addListener('FIND_ORDER_VALUE', (bindingData: mixed) => {
      const field = getByPath('field', bindingData);
      const entityId = getByPath('entityId', bindingData);
      const selectedField: BindingField = getByPath('selectedField', bindingData);
      const autoDateDuration: Duration = getByPath('autoDateDuration', bindingData);
      const autoDateOffset: Offset = getByPath('autoDateOffset', bindingData);
      const hasCircleBindingError: boolean = getByPath('hasCircleBindingError', bindingData);

      if (hasCircleBindingError) {
        setTaskValue('dueDate', '');
        setTaskValue('startDate', '');
        return;
      }

      if (inParentEntityForm) {
        let date = mappingDate({ field, task, values, mappingFields: MappingFields });
        date = autoCalculateDate({
          autoDateDuration,
          date,
          autoDateOffset,
          field,
          setTaskValue,
          selectedField,
          timezone: user.timezone,
        });
        bindingRelateField({
          selectedField,
          date,
          task,
          setTaskValue,
          timezone: user.timezone,
        });
      } else {
        logger.warn('query order data for id', client);
        // TODO: This flag will be used for showing loading on UI
        emitter.emit('LIVE_VALUE_PROCESS', true);
        client
          .query({
            query: orderAutoDateQuery,
            variables: { id: entityId },
            fetchPolicy: 'cache-first',
          })
          .then(({ data }) => {
            emitter.emit('LIVE_VALUE_PROCESS', false);
            let date = mappingDate({
              field,
              task,
              values: data.order,
              mappingFields: MappingFields,
            });
            date = autoCalculateDate({
              autoDateDuration,
              date,
              autoDateOffset,
              field,
              setTaskValue,
              selectedField,
              timezone: user.timezone,
            });
            bindingRelateField({
              selectedField,
              task,
              date,
              setTaskValue,
              timezone: user.timezone,
            });
          });
      }
    });

    return () => {
      emitter.removeAllListeners('FIND_ORDER_VALUE');
    };
  });
  return null;
}
