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

const Types = ['Importer', 'Exporter', 'Supplier', 'Forwarder', 'Warehouser'];

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
        {Types.map(type => (
          <div className={CheckboxWrapperStyle}>
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

export default OrganizationTypes;
