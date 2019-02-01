// @flow
import React from 'react';
import { BooleanValue } from 'react-values';
import { Label } from 'components/Form';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import { BaseButton } from 'components/Buttons';
import ConfirmDialog from 'components/Dialog/ConfirmDialog';
import messages from 'modules/relationMap/messages';
import ConfirmMessage from './ConfirmMessage';
import { LabelConnectStyle, GroupLabelButtonStyle, Panel, FlatButtonStyle } from './style';

type Props = {
  onReset: Function,
  onConfirm: Function,
};

const ApplyPanel = ({ onReset, onConfirm }: Props) => {
  return (
    <Panel>
      <Label className={LabelConnectStyle}>
        s
        <FormattedMessage {...messages.connect} />
        <Icon icon="CONNECT" />
      </Label>
      <Label className={GroupLabelButtonStyle}>
        <FormattedMessage {...messages.askConnectToOrder} />
        <BaseButton label="CLEAR" className={FlatButtonStyle} onClick={onReset} />
        <BaseButton
          icon="CONFIRM"
          label={<FormattedMessage id="components.NavBar.filter.apply" defaultMessage="APPLY" />}
          onClick={onConfirm}
        />
        <BooleanValue>
          {({ value: isOpen, set: dialogToggle }) => (
            <ConfirmDialog
              isOpen={isOpen}
              onRequestClose={() => dialogToggle('isOpen', false)}
              onCancel={() => dialogToggle('isOpen', false)}
              message={
                <ConfirmMessage
                  selectAllBatch
                  totalDiff={0}
                  hasDiffCurrency={false}
                  baseCurrency=""
                  diffCurrency=""
                />
              }
              onConfirm={onConfirm}
            />
          )}
        </BooleanValue>
      </Label>
    </Panel>
  );
};

export default ApplyPanel;
