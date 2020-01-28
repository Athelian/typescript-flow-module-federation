// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import LabelIcon from '..';

export default function MilestoneLabelIcon() {
  return (
    <LabelIcon color="MILESTONE">
      <FormattedMessage id="modules.RelationMap.label.milestone" defaultMessage="Milestone" />{' '}
      <Icon icon="MILESTONE" />
    </LabelIcon>
  );
}
