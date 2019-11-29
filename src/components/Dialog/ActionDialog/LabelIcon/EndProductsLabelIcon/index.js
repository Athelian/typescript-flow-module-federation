// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import LabelIcon from '..';

export default function EndProductsLabelIcon() {
  return (
    <LabelIcon color="PRODUCT_PROVIDER">
      <FormattedMessage id="modules.RelationMap.label.endProducts" defaultMessage="End Products" />{' '}
      <Icon icon="PRODUCT_PROVIDER" />
    </LabelIcon>
  );
}
