// @flow
import * as React from 'react';
import type { IntervalInput, TaskDateBinding } from 'generated/graphql';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import { CellInputWrapperStyle } from 'components/Sheet/CellRenderer/Cell/CellInput/Common/style';
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
}: InputProps<
  {
    binding: ?TaskDateBinding,
    interval: ?IntervalInput,
    date: ?(string | Date),
  },
  ContextProps
>) => {
  return (
    <div className={CellInputWrapperStyle}>
      <BaseTaskBindingInput
        readOnly={readonly}
        binding={value?.binding}
        interval={value?.interval}
        date={value?.date ?? ''}
        entity={context?.parentEntity}
        type={context?.type}
        handleChange={onChange}
      />
    </div>
  );
};

export default TaskBindingInput;
