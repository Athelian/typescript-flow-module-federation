// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { BooleanValue } from 'react-values';
import { Label } from 'components/Form';
import Icon from 'components/Icon';
import { BaseButton } from 'components/Buttons';
import ConfirmDialog from 'components/Dialog/ConfirmDialog';
import messages from 'modules/relationMap/messages';
import ConfirmMessage from './ConfirmMessage';
import * as style from './style';

const { MoveToOrderPanelWrapper } = style;

const MoveToOrderPanel = () => (
  <MoveToOrderPanelWrapper>
    <div className={style.SubPanel}>
      <Label className={style.LabelConnectStyle}>
        <FormattedMessage {...messages.connect} />
        <Icon icon="CONNECT" />
      </Label>
      <Label className={style.GroupLabelButtonLeftStyle}>
        <FormattedMessage {...messages.select} />
        <Label color="ORDER" className={style.GroupLabelButtonStyle}>
          <Icon icon="ORDER" />
          <FormattedMessage {...messages.ordersTab} />
        </Label>
        <FormattedMessage {...messages.toConnectToTheList} />
      </Label>
    </div>
    <div className={style.SubPanel}>
      <Label className={style.GroupLabelButtonStyle}>
        <FormattedMessage {...messages.connectTo} />
        <BaseButton
          icon="ADD"
          label={<FormattedMessage {...messages.newOrder} className={style.PanelButtonStyle} />}
          onClick={console.warn}
        />
      </Label>
    </div>
    <BooleanValue>
      {({ value: isOpen, set: dialogToggle }) => (
        <>
          <Label className={style.GroupLabelButtonStyle}>
            <BaseButton
              icon="CLEAR"
              label={<FormattedMessage {...messages.delete} />}
              className={style.PanelButtonStyle}
              onClick={() => dialogToggle(true)}
            />
          </Label>
          <ConfirmDialog
            onRequestClose={() => dialogToggle(false)}
            onCancel={() => dialogToggle(false)}
            isOpen={isOpen}
            message={<ConfirmMessage />}
            onConfirm={console.warn}
          />
        </>
      )}
    </BooleanValue>
  </MoveToOrderPanelWrapper>
);

export default MoveToOrderPanel;
