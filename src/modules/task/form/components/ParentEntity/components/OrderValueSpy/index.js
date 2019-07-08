// @flow
import * as React from 'react';
import type { Order, Task } from 'generated/graphql';
import client from 'apollo';
import emitter from 'utils/emitter';
import { getByPath } from 'utils/fp';
import logger from 'utils/logger';
import { START_DATE, DUE_DATE } from 'modules/task/form/components/TaskInfoSection/constants';
import { calculateDate, findDuration } from 'modules/task/form/components/TaskInfoSection/helpers';
import { orderAutoDateQuery } from './query';

type Props = {
  values: Object,
  inParentEntityForm: boolean,
  task: Object,
  setTaskValue: Function,
};

type Duration = ?{ metric: 'days' | 'weeks' | 'months', value: number };
type Offset = ?'before' | ?'after';
type BindingField = 'startDate' | 'dueDate';

export const MappingFields = {
  OrderIssuedAt: 'issuedAt',
  ProjectDueDate: 'milestone.project.dueDate',
  MilestoneDueDate: 'milestone.dueDate',
  TaskStartDate: 'startDate',
  TaskDueDate: 'dueDate',
};

const mappingDate = ({
  field,
  task,
  values,
}: {
  field: string,
  task: Task,
  values: Order,
}): ?(string | Date) => {
  const path = MappingFields[field] || 'N/A';
  if (field.includes('DueDate') || field.includes('StartDate')) {
    return getByPath(path, task);
  }

  return getByPath(path, values);
};

function autoCalculateDate({
  autoDateDuration,
  date,
  autoDateOffset,
  field,
  setTaskValue,
  selectedField,
}: {|
  autoDateDuration: Duration,
  date: ?(string | Date),
  autoDateOffset: Offset,
  field: string,
  setTaskValue: Function,
  selectedField: string,
|}) {
  let result = date;
  if (autoDateDuration) {
    result = calculateDate({
      date,
      duration: autoDateDuration.metric,
      offset:
        autoDateOffset === 'after'
          ? Math.abs(autoDateDuration.value)
          : -Math.abs(autoDateDuration.value),
    });
  }
  if (![START_DATE, DUE_DATE].includes(field)) {
    logger.warn({
      field,
    });
    setTaskValue(selectedField, result);
    emitter.emit('LIVE_VALUE', field, result);
  } else {
    logger.warn({
      selectedField,
    });
    setTaskValue(selectedField, result);
  }
  return result;
}

function bindingRelateField({
  selectedField,
  task,
  setTaskValue,
  date,
}: {
  selectedField: BindingField,
  task: Task,
  setTaskValue: Function,
  date: ?(string | Date),
}) {
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

  if (selectedField === 'dueDate') {
    if (task.startDateBinding === DUE_DATE) {
      const { weeks, months, days } = task.startDateInterval || {};
      setTaskValue(
        'startDate',
        calculateDate({
          date,
          duration: findDuration({ weeks, months }),
          offset: weeks || months || days,
        })
      );
    }
  }
}

export default function OrderValueSpy({ values, task, inParentEntityForm, setTaskValue }: Props) {
  React.useEffect(() => {
    emitter.addListener('FIND_ORDER_VALUE', (bindingData: mixed) => {
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
        let date = mappingDate({ field, task, values });
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
            query: orderAutoDateQuery,
            variables: { id: entityId },
            fetchPolicy: 'cache-first',
          })
          .then(({ data }) => {
            emitter.emit('LIVE_VALUE_PROCESS', false);
            let date = mappingDate({ field, task, values: data.order });
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
      emitter.removeAllListeners('FIND_ORDER_VALUE');
    };
  });
  return null;
}
