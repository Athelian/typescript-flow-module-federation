// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import LabelIcon from '..';

export default function FilesLabelIcon() {
  return (
    <LabelIcon color="DOCUMENT">
      <FormattedMessage id="modules.RelationMap.label.files" defaultMessage="Documents" />{' '}
      <Icon icon="DOCUMENT" />
    </LabelIcon>
  );
}
