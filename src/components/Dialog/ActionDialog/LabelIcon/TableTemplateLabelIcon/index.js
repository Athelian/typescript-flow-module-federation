// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import LabelIcon from '..';

export default function TableTemplateLabelIcon() {
  return (
    <LabelIcon color="TEMPLATE">
      <FormattedMessage id="components.dialogs.tableTemplate.label." defaultMessage="Template" />{' '}
      <Icon icon="TEMPLATE" />
    </LabelIcon>
  );
}
