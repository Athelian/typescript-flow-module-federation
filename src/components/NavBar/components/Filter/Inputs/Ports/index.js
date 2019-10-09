// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Label } from 'components/Form';
import { BaseButton } from 'components/Buttons';
import Icon from 'components/Icon';
import messages from '../../messages';
import PortInput from './PortInput';
import { PortsWrapperStyle, PortWrapperStyle, RemoveButtonStyle } from './style';

type Props = {
  value: Array<{ seaport?: string, airport?: string }>,
  readonly: boolean,
  onChange: (Array<{ seaport?: string, airport?: string }>) => void,
};

const Ports = ({ value, readonly, onChange }: Props) => {
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
