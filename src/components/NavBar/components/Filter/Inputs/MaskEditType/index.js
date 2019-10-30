// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Label, RadioInput } from 'components/Form';
import tableTemplateMessage from 'modules/tableTemplate/messages';
import messages from '../../messages';
import { RadiosWrapperStyle } from './style';

type Props = {
  value: string,
  readonly: boolean,
  onChange: string => void,
};

const Types = {
  Order: tableTemplateMessage.order,
  OrderSheet: tableTemplateMessage.orderSheet,
  ShipmentSheet: tableTemplateMessage.shipmentSheet,
};

const MaskEditType = ({ value, onChange, readonly }: Props) => (
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

export default MaskEditType;
