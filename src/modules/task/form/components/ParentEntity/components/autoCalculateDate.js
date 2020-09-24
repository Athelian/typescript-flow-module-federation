// @flow
import { START_DATE, DUE_DATE } from 'utils/task';
import { calculateBindingDate } from 'utils/date';
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
  timezone,
}: {|
  autoDateDuration: Duration,
  date: ?string,
  autoDateOffset: Offset,
  field: string,
  setTaskValue: Function,
  selectedField: string,
  timezone: string,
|}) {
  let result = date;

  if (autoDateDuration) {
    const dateInterval = {
      [(autoDateDuration.metric: string)]:
        autoDateOffset === 'after'
          ? Math.abs(autoDateDuration.value)
          : -Math.abs(autoDateDuration.value),
    };
    result = calculateBindingDate(date, dateInterval, timezone);
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
  timezone,
}: {|
  selectedField: BindingField,
  task: Task,
  setTaskValue: Function,
  date: ?string,
  timezone: string,
|}) {
  if (selectedField === 'startDate') {
    if (task.dueDateBinding === START_DATE) {
      setTaskValue('dueDate', calculateBindingDate(date, task.dueDateInterval, timezone));
    }
  }
  if (selectedField === 'dueDate') {
    if (task.startDateBinding === DUE_DATE) {
      setTaskValue('startDate', calculateBindingDate(date, task.startDateInterval, timezone));
    }
  }
}
