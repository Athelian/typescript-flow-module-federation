// @flow
import React from 'react';
import Icon from 'components/Icon';
import { FormattedMessage } from 'react-intl';
import { BaseButton } from 'components/Buttons';
import { Label } from 'components/Form';
import messages from 'modules/relationMap/messages';
import { colors } from 'styles/common';
import * as style from './style';

type Props = {
  onClick: Function,
};
const ClonePanel = ({ onClick }: Props) => (
  <div className={style.ContainerWrapper}>
    <div className={style.Header}>
      <Icon icon="CLONE" />
      <Label color={colors.TEAL}>
        <FormattedMessage {...messages.clone} />
      </Label>
    </div>
    <BaseButton
      icon="CONFIRM"
      label={<FormattedMessage id="components.NavBar.filter.apply" defaultMessage="APPLY" />}
      onClick={onClick}
    />
  </div>
);

export default ClonePanel;
