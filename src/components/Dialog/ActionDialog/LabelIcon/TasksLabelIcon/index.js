// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import LabelIcon from '..';

export default function TasksLabelIcon() {
  return (
    <LabelIcon color="TASK">
      <FormattedMessage id="modules.RelationMap.label.tasks" defaultMessage="Tasks" />{' '}
      <Icon icon="TASK" />
    </LabelIcon>
  );
}
