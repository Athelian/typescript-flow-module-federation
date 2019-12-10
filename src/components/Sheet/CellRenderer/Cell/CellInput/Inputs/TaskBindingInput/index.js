// @flow
import * as React from 'react';
import type { IntervalInput, TaskDateBinding } from 'generated/graphql';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import { CellInputWrapperStyle } from 'components/Sheet/CellRenderer/Cell/CellInput/Common/style';
import BaseTaskBindingInput from './components/BaseTaskBindingInput';

const TaskBindingInput = ({
  value,
  readonly,
  onChange,
}: InputProps<{
  parentEntity: 'Order' | 'Batch' | 'Shipment' | 'Project' | 'Milestone',
  type: 'startDate' | 'dueDate',
  binding: ?TaskDateBinding,
  interval: ?IntervalInput,
  date: ?(string | Date),
}>) => {
  return (
    <div className={CellInputWrapperStyle}>
      <BaseTaskBindingInput
        binding={value?.binding}
        interval={value?.interval}
        readOnly={readonly}
        entity={value?.parentEntity}
        date={value?.date ?? ''}
        type={value?.type}
        handleChange={values => {
          console.warn({
            values,
            onChange,
          });
        }}
      />
    </div>
  );
};

export default TaskBindingInput;
