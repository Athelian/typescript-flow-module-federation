// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import LabelIcon from '..';

export default function FileLabelIcon() {
  return (
    <LabelIcon color="DOCUMENT">
      <FormattedMessage id="modules.RelationMap.label.file" defaultMessage="Document" />{' '}
      <Icon icon="DOCUMENT" />
    </LabelIcon>
  );
}
