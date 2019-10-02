// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import LabelIcon from '..';

export default function ContainerLabelIcon() {
  return (
    <LabelIcon color="CONTAINER">
      <FormattedMessage id="modules.RelationMap.label.container" defaultMessage="Container" />{' '}
      <Icon icon="CONTAINER" />
    </LabelIcon>
  );
}
