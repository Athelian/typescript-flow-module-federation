// @flow
import * as React from 'react';
import type { Product, Task } from 'generated/graphql';
import client from 'apollo';
import emitter from 'utils/emitter';
import { getByPath } from 'utils/fp';
import logger from 'utils/logger';
import { START_DATE } from 'modules/task/form/components/TaskInfoSection/constants';
import { calculateDate, findDuration } from 'modules/task/form/components/TaskInfoSection/helpers';

type Props = {
  values: Object,
  inParentEntityForm: boolean,
  task: Object,
  setTaskValue: Function,
};

export const MappingFields = {
  ProjectDueDate: 'milestone.project.dueDate',
  MilestoneDueDate: 'milestone.dueDate',
};

const mappingDate = ({ field, task, values }: { field: string, task: Task, values: Product }) => {
  const path = MappingFields[field] || 'N/A';
  if (path.includes('milestone')) {
    return getByPath(path, task);
  }

  return getByPath(path, values);
};

export default function ProductValueSpy({ values, task, inParentEntityForm, setTaskValue }: Props) {
  React.useEffect(() => {
    emitter.addListener('FIND_PRODUCT_VALUE', (bindingData: mixed) => {
      const field = getByPath('field', bindingData);
      const entityId = getByPath('entityId', bindingData);
      const selectedField = getByPath('selectedField', bindingData);
      const autoDateDuration = getByPath('autoDateDuration', bindingData);
      const autoDateOffset = getByPath('autoDateOffset', bindingData);
      logger.warn({
        field,
        entityId,
        selectedField,
        inParentEntityForm,
      });

      if (inParentEntityForm) {
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
      } else {
        logger.warn('query product data for id', client);
      }
    });

    return () => {
      emitter.removeAllListeners('FIND_PRODUCT_VALUE');
    };
  });
  return null;
}
