// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import LabelIcon from '..';

export default function BatchLabelIcon() {
  return (
    <LabelIcon color="BATCH">
      <FormattedMessage id="modules.RelationMap.label.batch" defaultMessage="Batch" />{' '}
      <Icon icon="BATCH" />
    </LabelIcon>
  );
}
