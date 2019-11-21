// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import LabelIcon from '..';

export default function ContainersLabelIcon() {
  return (
    <LabelIcon color="CONTAINER">
      <FormattedMessage id="modules.RelationMap.label.containers" defaultMessage="Containers" />{' '}
      <Icon icon="CONTAINER" />
    </LabelIcon>
  );
}
