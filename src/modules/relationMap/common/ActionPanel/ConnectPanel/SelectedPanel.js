// @flow
import React from 'react';
import { Label } from 'components/Form';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import { BaseButton } from 'components/Buttons';
import messages from 'modules/relationMap/messages';
import * as style from './style';

const { SelectedPanelWrapper } = style;

type Props = {
  type: 'SHIPMENT' | 'ORDER',
};

const SelectedPanel = ({ type }: Props) => {
  let text;
  let button;
  switch (type) {
    default:
    case 'SHIPMENT':
      text = <FormattedMessage {...messages.shipmentsTab} />;
      button = (
        <BaseButton
          icon="ADD"
          label={<FormattedMessage {...messages.newShipment} className={style.PanelButtonStyle} />}
        />
      );
      break;
    case 'ORDER':
      text = <FormattedMessage {...messages.ordersTab} />;
      button = (
        <BaseButton
          icon="ADD"
          label={<FormattedMessage {...messages.newOrder} className={style.PanelButtonStyle} />}
        />
      );
  }

  return (
    <SelectedPanelWrapper>
      <div className={style.SubPanel}>
        <Label className={style.LabelConnectStyle}>
          <FormattedMessage {...messages.connect} />
          <Icon icon="CONNECT" />
        </Label>
        <Label className={style.GroupLabelButtonLeftStyle}>
          <FormattedMessage {...messages.select} />
          <Label color={type} className={style.GroupLabelButtonStyle}>
            <Icon icon={type} />
            {text}
          </Label>
          <FormattedMessage {...messages.toConnectToTheList} />
        </Label>
      </div>

      <div className={style.SubPanel}>
        <Label className={style.GroupLabelButtonStyle}>
          <FormattedMessage {...messages.connectTo} />
          {button}
        </Label>
      </div>
      <Label className={style.GroupLabelButtonStyle}>
        <BaseButton icon="CLEAR" label="Disconnect" className={style.PanelButtonStyle} />
      </Label>
    </SelectedPanelWrapper>
  );
};

SelectedPanel.defaultProps = {
  type: 'SHIPMENT',
};

export default SelectedPanel;
