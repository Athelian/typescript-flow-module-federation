// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import LabelIcon from '..';

export default function ShipmentLabelIcon() {
  return (
    <LabelIcon color="SHIPMENT">
      <FormattedMessage id="modules.RelationMap.label.shipment" defaultMessage="Shipment" />{' '}
      <Icon icon="SHIPMENT" />
    </LabelIcon>
  );
}
