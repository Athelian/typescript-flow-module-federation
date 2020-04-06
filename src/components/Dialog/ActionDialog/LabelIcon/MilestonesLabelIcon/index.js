// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import LabelIcon from '..';

export default function MilestonesLabelIcon() {
  return (
    <LabelIcon color="MILESTONE">
      <FormattedMessage id="modules.RelationMap.label.milestones" defaultMessage="Milestones" />{' '}
      <Icon icon="MILESTONE" />
    </LabelIcon>
  );
}
