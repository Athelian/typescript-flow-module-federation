// @flow
import { START_DATE, DUE_DATE } from 'utils/task';
import { calculateDate, findDuration } from 'utils/date';
import emitter from 'utils/emitter';
import logger from 'utils/logger';
import type { Task } from 'generated/graphql';
import type { Duration, Offset, BindingField } from './type.js.flow';

export function autoCalculateDate({
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

export function bindingRelateField({
  selectedField,
  task,
  setTaskValue,
  date,
}: {|
  selectedField: BindingField,
  task: Task,
  setTaskValue: Function,
  date: ?(string | Date),
|}) {
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
