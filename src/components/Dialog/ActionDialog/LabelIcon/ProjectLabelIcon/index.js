// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import LabelIcon from '..';

export default function ProjectLabelIcon() {
  return (
    <LabelIcon color="PROJECT">
      <FormattedMessage id="modules.RelationMap.label.project" defaultMessage="Project" />{' '}
      <Icon icon="PROJECT" />
    </LabelIcon>
  );
}
