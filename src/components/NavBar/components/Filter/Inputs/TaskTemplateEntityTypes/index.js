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

const Types = [
  'Product',
  'ProductProvider',
  'Order',
  'OrderItem',
  'Batch',
  'Shipment',
  'Container',
];

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
        {Types.map(type => (
          <div key={type} className={CheckboxWrapperStyle}>
            <CheckboxInput
              checked={value.includes(type)}
              onToggle={handleToggle(type)}
              disabled={readonly}
            />
            <span>{type}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default TaskTemplateEntityTypes;
