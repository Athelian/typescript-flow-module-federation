// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import LabelIcon from '..';

export default function EndProductLabelIcon() {
  return (
    <LabelIcon color="PRODUCT_PROVIDER">
      <FormattedMessage id="modules.RelationMap.label.endProduct" defaultMessage="End Product" />{' '}
      <Icon icon="PRODUCT_PROVIDER" />
    </LabelIcon>
  );
}
