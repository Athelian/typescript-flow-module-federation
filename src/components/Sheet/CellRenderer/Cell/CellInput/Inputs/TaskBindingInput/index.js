// @flow
import * as React from 'react';
import type { IntervalInput, TaskDateBinding } from 'generated/graphql';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import BaseTaskBindingInput from './components/BaseTaskBindingInput';

type ContextProps = {
  parentEntity: 'Order' | 'Batch' | 'Shipment' | 'Project' | 'Milestone',
  type: 'startDate' | 'dueDate',
};

const TaskBindingInput = ({
  value,
  readonly,
  onChange,
  context,
}: InputProps<{
    binding: ?TaskDateBinding,
    interval: ?IntervalInput,
    date: ?(string | Date),
  },
  ContextProps
>) => {
  return (
    <BaseTaskBindingInput
      readOnly={readonly}
      binding={value?.binding}
      interval={value?.interval}
      date={value?.date ?? ''}
      entity={context?.parentEntity}
      type={context?.type}
      handleChange={onChange}
    />
  );
};

export default TaskBindingInput;
