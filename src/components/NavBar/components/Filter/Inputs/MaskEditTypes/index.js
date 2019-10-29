// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Label, RadioInput } from 'components/Form';
import tableTemplateMessage from 'modules/tableTemplate/messages';
import messages from '../../messages';
import { RadiosWrapperStyle } from './style';

type Props = {
  value: Array<string>,
  readonly: boolean,
  onChange: (Array<string>) => void,
};

const Types = {
  Order: tableTemplateMessage.order,
  OrderSheet: tableTemplateMessage.orderSheet,
  ShipmentSheet: tableTemplateMessage.shipmentSheet,
};

const MaskEditTypes = ({ value, onChange, readonly }: Props) => (
  <>
    <Label height="30px">
      <FormattedMessage {...messages.maskEditTypes} />
    </Label>

    <div className={RadiosWrapperStyle}>
      {Object.entries(Types).map(([type, message]) => (
        <RadioInput
          key={type}
          selected={value === type}
          onToggle={() => onChange(type)}
          editable={!readonly}
        >
          <FormattedMessage {...message} />
        </RadioInput>
      ))}
    </div>
  </>
);

export default MaskEditTypes;
