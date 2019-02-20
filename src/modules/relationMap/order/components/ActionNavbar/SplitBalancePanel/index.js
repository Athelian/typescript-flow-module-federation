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
const SplitBalancePanel = ({ onClick }: Props) => (
  <div className={style.ContainerWrapper}>
    <div className={style.Header}>
      <Icon icon="ORDER_ITEM" />
      <Label color={colors.TEAL}>
        <FormattedMessage {...messages.autoFillBatch} />
      </Label>
      <Icon icon="BATCH" />
    </div>
    <BaseButton
      icon="CONFIRM"
      label={<FormattedMessage id="components.NavBar.filter.apply" defaultMessage="APPLY" />}
      onClick={onClick}
    />
  </div>
);

export default SplitBalancePanel;
