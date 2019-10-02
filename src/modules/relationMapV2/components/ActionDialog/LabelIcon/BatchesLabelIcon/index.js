// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import LabelIcon from '..';

export default function BatchesLabelIcon() {
  return (
    <LabelIcon color="BATCH">
      <FormattedMessage id="modules.RelationMap.label.batches" defaultMessage="Batches" />{' '}
      <Icon icon="BATCH" />
    </LabelIcon>
  );
}
