// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { FormattedMessage } from 'react-intl';
import { ApplyButton } from 'components/Buttons';
import { Label } from 'components/Form';
import messages from 'modules/relationMap/messages';
import { AutofillBatchPanelWrapperStyle, AutofillBatchLabelWrapperStyle } from './style';

type Props = {
  onClick: Function,
};

const SplitBalancePanel = ({ onClick }: Props) => (
  <div className={AutofillBatchPanelWrapperStyle}>
    <div className={AutofillBatchLabelWrapperStyle}>
      <Icon icon="ORDER_ITEM" />
      <Label color="TEAL_DARK">
        <FormattedMessage {...messages.autoFillBatch} />
      </Label>
      <Icon icon="BATCH" />
    </div>
    <ApplyButton onClick={onClick} />
  </div>
);

export default SplitBalancePanel;
