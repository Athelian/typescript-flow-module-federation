// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { FieldItem, Label } from 'components/Form';
import { PortsWrapperStyle } from './style';
import messages from '../messages';
import { EnumArrayInput } from '..';

type Props = {
  portType: 'Seaport' | 'Airport',
};

export default function Ports({ portType }: Props) {
  return (
    <div className={PortsWrapperStyle}>
      <FieldItem
        vertical
        label={
          <Label>
            <FormattedMessage {...messages.loadPort} />
          </Label>
        }
        input={<EnumArrayInput enumType={portType} />}
      />

      <FieldItem
        vertical
        label={
          <Label>
            <FormattedMessage {...messages.dischargePort} />
          </Label>
        }
        input={<EnumArrayInput enumType={portType} />}
      />

      <FieldItem
        vertical
        label={
          <Label>
            <FormattedMessage {...messages.firstTransitPort} />
          </Label>
        }
        input={<EnumArrayInput enumType={portType} />}
      />

      <FieldItem
        vertical
        label={
          <Label>
            <FormattedMessage {...messages.secondTransitPort} />
          </Label>
        }
        input={<EnumArrayInput enumType={portType} />}
      />
    </div>
  );
}
