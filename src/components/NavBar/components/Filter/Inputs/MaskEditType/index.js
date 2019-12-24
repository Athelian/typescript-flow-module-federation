// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Label, RadioInput } from 'components/Form';
import tableTemplateMessage from 'modules/tableTemplate/messages';
import messages from '../../messages';
import type { FilterInputProps } from '../../types';
import { RadiosWrapperStyle } from './style';

const Types = {
  OrderSheet: tableTemplateMessage.orderSheet,
  BatchSheet: tableTemplateMessage.batchSheet,
  ShipmentSheet: tableTemplateMessage.shipmentSheet,
  ProjectSheet: tableTemplateMessage.projectSheet,
};

const MaskEditType = ({ value, onChange, readonly }: FilterInputProps<string>) => (
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
