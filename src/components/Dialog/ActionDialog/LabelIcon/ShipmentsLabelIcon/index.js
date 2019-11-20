// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import LabelIcon from '..';

export default function ShipmentsLabelIcon() {
  return (
    <LabelIcon color="SHIPMENT">
      <FormattedMessage id="modules.RelationMap.label.shipments" defaultMessage="Shipments" />{' '}
      <Icon icon="SHIPMENT" />
    </LabelIcon>
  );
}
