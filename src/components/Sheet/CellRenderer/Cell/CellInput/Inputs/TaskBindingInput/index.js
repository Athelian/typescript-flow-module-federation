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
  extra,
}: InputProps<{
  binding: ?TaskDateBinding,
  interval: ?IntervalInput,
  date: ?(string | Date),
}>) => {
  const parentEntity: 'Order' | 'Batch' | 'Shipment' | 'Project' | 'Milestone' =
    extra?.parentEntity ?? 'Order';
  const type: 'startDate' | 'dueDate' = extra?.parentEntity ?? 'startDate';

  return (
    <div className={CellInputWrapperStyle}>
      <BaseTaskBindingInput
        readOnly={readonly}
        binding={value?.binding}
        interval={value?.interval}
        date={value?.date ?? ''}
        entity={parentEntity}
        type={type}
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
