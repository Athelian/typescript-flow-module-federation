// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import LabelIcon from '..';

export default function TagLabelIcon() {
  return (
    <LabelIcon color="TAG">
      <FormattedMessage id="modules.RelationMap.label.tag" defaultMessage="Tag" />{' '}
      <Icon icon="TAG" />
    </LabelIcon>
  );
}
