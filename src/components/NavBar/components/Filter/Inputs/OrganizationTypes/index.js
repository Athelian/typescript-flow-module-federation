// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { CheckboxInput, Label } from 'components/Form';
import partnerMessages from 'modules/partner/messages';
import messages from '../../messages';
import { CheckboxWrapperStyle } from './style';

type Props = {
  value: Array<string>,
  readonly: boolean,
  onChange: (Array<string>) => void,
};

const Types = {
  Importer: partnerMessages.importer,
  Exporter: partnerMessages.exporter,
  Supplier: partnerMessages.supplier,
  Forwarder: partnerMessages.forwarder,
  Warehouser: partnerMessages.warehouser,
};

const OrganizationTypes = ({ value, onChange, readonly }: Props) => {
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
        <FormattedMessage {...messages.organizationTypes} />
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

export default OrganizationTypes;
