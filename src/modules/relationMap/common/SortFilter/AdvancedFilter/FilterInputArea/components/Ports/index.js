// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { FieldItem, Label } from 'components/Form';
import { PortsWrapperStyle } from './style';
import messages from '../messages';
import { EnumArrayInput } from '..';

type OptionalProps = {
  loadPorts?: Array<Object>,
  dischargePorts?: Array<Object>,
  firstTransitPorts?: Array<Object>,
  secondTransitPorts?: Array<Object>,
};

type Props = OptionalProps & {
  portType: 'Seaport' | 'Airport',
  onChangeLoadPorts: Function,
  onChangeDischargePorts: Function,
  onChangeFirstTransitPorts: Function,
  onChangeSecondTransitPorts: Function,
};

export default function Ports({
  portType,
  loadPorts,
  dischargePorts,
  firstTransitPorts,
  secondTransitPorts,
  onChangeLoadPorts,
  onChangeDischargePorts,
  onChangeFirstTransitPorts,
  onChangeSecondTransitPorts,
}: Props) {
  return (
    <div className={PortsWrapperStyle}>
      <FieldItem
        vertical
        label={
          <Label>
            <FormattedMessage {...messages.loadPort} />
          </Label>
        }
        input={
          <EnumArrayInput enumType={portType} values={loadPorts} onChange={onChangeLoadPorts} />
        }
      />

      <FieldItem
        vertical
        label={
          <Label>
            <FormattedMessage {...messages.dischargePort} />
          </Label>
        }
        input={
          <EnumArrayInput
            enumType={portType}
            values={dischargePorts}
            onChange={onChangeDischargePorts}
          />
        }
      />

      <FieldItem
        vertical
        label={
          <Label>
            <FormattedMessage {...messages.firstTransitPort} />
          </Label>
        }
        input={
          <EnumArrayInput
            enumType={portType}
            values={firstTransitPorts}
            onChange={onChangeFirstTransitPorts}
          />
        }
      />

      <FieldItem
        vertical
        label={
          <Label>
            <FormattedMessage {...messages.secondTransitPort} />
          </Label>
        }
        input={
          <EnumArrayInput
            enumType={portType}
            values={secondTransitPorts}
            onChange={onChangeSecondTransitPorts}
          />
        }
      />
    </div>
  );
}
