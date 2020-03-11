// @flow
import * as React from 'react';
import client from 'apollo';
import emitter from 'utils/emitter';
import { getByPath } from 'utils/fp';
import logger from 'utils/logger';
import { batchAutoDateQuery } from './query';
import type { Offset, BindingField, Duration } from '../type.js.flow';
import { autoCalculateDate, bindingRelateField } from '../autoCalculateDate';
import { mappingDate } from '../mappingDate';

type Props = {
  values: Object,
  inParentEntityForm: boolean,
  task: Object,
  setTaskValue: Function,
};

export const MappingFields = {
  BatchDeliveredAt: 'deliveredAt',
  BatchDesiredAt: 'desiredAt',
  BatchProducedAt: 'producedAt',
  BatchExpiredAt: 'expiredAt',
  ProjectDueDate: 'milestone.project.dueDate',
  MilestoneDueDate: 'milestone.dueDate',
  TaskStartDate: 'startDate',
  TaskDueDate: 'dueDate',
};

export default function BatchValueSpy({ values, task, inParentEntityForm, setTaskValue }: Props) {
  React.useEffect(() => {
    emitter.addListener('FIND_BATCH_VALUE', (bindingData: mixed) => {
      const field = getByPath('field', bindingData);
      const entityId = getByPath('entityId', bindingData);
      const selectedField: BindingField = getByPath('selectedField', bindingData);
      const autoDateDuration: Duration = getByPath('autoDateDuration', bindingData);
      const autoDateOffset: Offset = getByPath('autoDateOffset', bindingData);
      const hasCircleBindingError: boolean = getByPath('hasCircleBindingError', bindingData);
      logger.warn({
        field,
        entityId,
        selectedField,
        autoDateDuration,
        autoDateOffset,
        inParentEntityForm,
        hasCircleBindingError,
      });

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
        });
        bindingRelateField({
          selectedField,
          date,
          task,
          setTaskValue,
        });
      } else {
        logger.warn('query order data for id', client);
        // TODO: This flag will be used for showing loading on UI
        emitter.emit('LIVE_VALUE_PROCESS', true);
        client
          .query({
            query: batchAutoDateQuery,
            variables: { id: entityId },
            fetchPolicy: 'cache-first',
          })
          .then(({ data }) => {
            emitter.emit('LIVE_VALUE_PROCESS', false);
            let date = mappingDate({
              field,
              task,
              values: data.batch,
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
      }
    });

    return () => {
      emitter.removeAllListeners('FIND_BATCH_VALUE');
    };
  });
  return null;
}