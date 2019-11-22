// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Label } from 'components/Form';
import { BaseButton } from 'components/Buttons';
import Icon from 'components/Icon';
import messages from '../../messages';
import type { FilterInputProps } from '../../types';
import PortInput from './PortInput';
import { PortsWrapperStyle, PortWrapperStyle, RemoveButtonStyle } from './style';

const Ports = ({
  value,
  readonly,
  onChange,
}: FilterInputProps<Array<{ seaport?: string, airport?: string }>>) => {
  const hasWeakPort = !value.every(v => !!v.seaport || !!v.airport);

  return (
    <>
      <Label height="30px">
        <FormattedMessage {...messages.ports} />
      </Label>

      <div className={PortsWrapperStyle}>
        {value.map((port, index) => {
          return (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              className={PortWrapperStyle}
            >
              <PortInput
                value={port}
                onChange={newPort => onChange(value.map((v, i) => (i === index ? newPort : v)))}
                readonly={readonly}
              />
              <button
                type="button"
                className={RemoveButtonStyle}
                onClick={() => onChange(value.filter((v, i) => i !== index))}
              >
                <Icon icon="REMOVE" />
              </button>
            </div>
          );
        })}

        <BaseButton
          icon="ADD"
          label={<FormattedMessage {...messages.addPort} />}
          backgroundColor="TEAL"
          hoverBackgroundColor="TEAL_DARK"
          disabled={hasWeakPort}
          onClick={() => onChange([...value, {}])}
        />
      </div>
    </>
  );
};

export default Ports;
