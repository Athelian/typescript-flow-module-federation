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
  hasSelectedAllBatches: boolean,
  onReset: Function,
  onConfirm: Function,
};

const ApplyPanel = ({ onReset, onConfirm, hasSelectedAllBatches }: Props) => {
  return (
    <Panel>
      <Label className={LabelConnectStyle}>
        <FormattedMessage {...messages.connect} />
        <Icon icon="CONNECT" />
      </Label>
      <Label className={GroupLabelButtonStyle}>
        <FormattedMessage {...messages.askConnectToOrder} />
        <BaseButton label="CLEAR" className={FlatButtonStyle} onClick={onReset} />
        <BooleanValue>
          {({ value: isOpen, set: dialogToggle }) => (
            <>
              <BaseButton
                icon="CONFIRM"
                label={
                  <FormattedMessage id="components.NavBar.filter.apply" defaultMessage="APPLY" />
                }
                onClick={() => dialogToggle(true)}
              />
              <ConfirmDialog
                isOpen={isOpen}
                onRequestClose={() => dialogToggle(false)}
                onCancel={() => dialogToggle(false)}
                message={
                  <ConfirmMessage
                    selectAllBatch={hasSelectedAllBatches}
                    totalDiff={0}
                    hasDiffCurrency={false}
                    baseCurrency=""
                    diffCurrency=""
                  />
                }
                onConfirm={() =>
                  onConfirm({
                    hasSelectedAllBatches,
                  })
                }
              />
            </>
          )}
        </BooleanValue>
      </Label>
    </Panel>
  );
};

export default ApplyPanel;
