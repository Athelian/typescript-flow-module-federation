// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { CheckboxInput, Label } from 'components/Form';
import taskTemplateMessage from 'modules/taskTemplate/messages';
import messages from '../../messages';
import type { FilterInputProps } from '../../types';
import { CheckboxWrapperStyle } from './style';

const Types = {
  Product: taskTemplateMessage.product,
  ProductProvider: taskTemplateMessage.endProduct,
  Order: taskTemplateMessage.order,
  OrderItem: taskTemplateMessage.orderItem,
  Batch: taskTemplateMessage.batch,
  Shipment: taskTemplateMessage.shipment,
  Container: taskTemplateMessage.container,
};

const TaskTemplateEntityTypes = ({
  value,
  onChange,
  readonly,
}: FilterInputProps<Array<string>>) => {
  const handleToggle = (type: string) => () => {
    if (value.includes(type)) {
      onChange(value.filter(t => t !== type));
    } else {
      onChange([...value, type]);
    }
  };

  return (
    <>
      <Label height="30px">
        <FormattedMessage {...messages.taskTemplateEntityTypes} />
      </Label>

      <div>
        {Object.entries(Types).map(([type, message]) => (
          <div key={type} className={CheckboxWrapperStyle}>
            <CheckboxInput
              checked={value.includes(type)}
              onToggle={handleToggle(type)}
              disabled={readonly}
            />
            <span>
              <FormattedMessage {...message} />
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

export default TaskTemplateEntityTypes;
