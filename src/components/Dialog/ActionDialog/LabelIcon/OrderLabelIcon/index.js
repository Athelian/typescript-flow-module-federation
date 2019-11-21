// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import LabelIcon from '..';

export default function OrderLabelIcon() {
  return (
    <LabelIcon color="ORDER">
      <FormattedMessage id="modules.RelationMap.label.order" defaultMessage="Order" />{' '}
      <Icon icon="ORDER" />
    </LabelIcon>
  );
}
