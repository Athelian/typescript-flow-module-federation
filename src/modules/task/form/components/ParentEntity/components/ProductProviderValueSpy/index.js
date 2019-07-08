// @flow
import * as React from 'react';
import emitter from 'utils/emitter';
import { getByPath } from 'utils/fp';
import logger from 'utils/logger';
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
  ProjectDueDate: 'milestone.project.dueDate',
  MilestoneDueDate: 'milestone.dueDate',
  TaskStartDate: 'startDate',
  TaskDueDate: 'dueDate',
};

export default function ProductProviderValueSpy({
  values,
  task,
  inParentEntityForm,
  setTaskValue,
}: Props) {
  React.useEffect(() => {
    emitter.addListener('FIND_PRODUCTPROVIDER_VALUE', (bindingData: mixed) => {
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
    });

    return () => {
      emitter.removeAllListeners('FIND_PRODUCTPROVIDER_VALUE');
    };
  });
  return null;
}
