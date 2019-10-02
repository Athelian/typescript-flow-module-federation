// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import LabelIcon from '..';

export default function OrdersLabelIcon() {
  return (
    <LabelIcon color="ORDER">
      <FormattedMessage id="modules.RelationMap.label.orders" defaultMessage="Orders" />{' '}
      <Icon icon="ORDER" />
    </LabelIcon>
  );
}
