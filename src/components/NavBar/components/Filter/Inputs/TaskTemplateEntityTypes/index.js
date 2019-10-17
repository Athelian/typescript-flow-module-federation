// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { CheckboxInput, Label } from 'components/Form';
import messages from '../../messages';
import { CheckboxWrapperStyle } from './style';

type Props = {
  value: Array<string>,
  readonly: boolean,
  onChange: (Array<string>) => void,
};

const Types = {
  Product: 'modules.TaskTemplates.product',
  ProductProvider: 'modules.TaskTemplates.endProduct',
  Order: 'modules.TaskTemplates.order',
  OrderItem: 'modules.TaskTemplates.orderItem',
  Batch: 'modules.TaskTemplates.batch',
  Shipment: 'modules.TaskTemplates.shipment',
  Container: 'modules.TaskTemplates.container',
};

const TaskTemplateEntityTypes = ({ value, onChange, readonly }: Props) => {
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
        {Object.entries(Types).map(([type, messageId]) => (
          <div key={type} className={CheckboxWrapperStyle}>
            <CheckboxInput
              checked={value.includes(type)}
              onToggle={handleToggle(type)}
              disabled={readonly}
            />
            <span>
              <FormattedMessage id={messageId} defaultMessage={type} />
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

export default TaskTemplateEntityTypes;
