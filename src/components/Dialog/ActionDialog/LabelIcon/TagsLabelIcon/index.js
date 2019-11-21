// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import LabelIcon from '..';

export default function TagsLabelIcon() {
  return (
    <LabelIcon color="TAG">
      <FormattedMessage id="modules.RelationMap.label.tags" defaultMessage="Tags" />{' '}
      <Icon icon="TAG" />
    </LabelIcon>
  );
}
