// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import LabelIcon from '..';

export default function ItemLabelIcon() {
  return (
    <LabelIcon color="ORDER_ITEM">
      <FormattedMessage id="modules.RelationMap.label.item" defaultMessage="Item" />{' '}
      <Icon icon="ORDER_ITEM" />
    </LabelIcon>
  );
}
