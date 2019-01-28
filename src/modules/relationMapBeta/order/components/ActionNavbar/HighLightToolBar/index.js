// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Label } from 'components/Form';
import Icon from 'components/Icon';
import messages from 'modules/relationMap/messages';
import * as style from 'modules/relationMap/common/ActionPanel/style';

type Props = {
  onCancel: Function,
  totalOrder: number,
  totalOrderItem: number,
  totalBatch: number,
  totalShipment: number,
};

const HighLightToolBar = ({
  onCancel,
  totalOrder,
  totalOrderItem,
  totalBatch,
  totalShipment,
}: Props) => (
  <div className={style.HighlightBarWrapper}>
    <div className={style.ActionsSelectedStyle}>
      <button className={style.CancelHighlightButton} type="button" onClick={onCancel}>
        <Icon icon="CLEAR" />
      </button>
      <Label className={style.HighlightLabelStyle}>
        <FormattedMessage {...messages.highlighted} />
      </Label>
    </div>
    <div className={style.SelectedWrapperStyle}>
      <Label className={style.ItemHighlightWrapper(!!totalOrder)}>{` ${totalOrder} `}</Label>
      <div className={style.IconHighlightWrapper(!!totalOrder)}>
        <Icon icon="ORDER" />
      </div>
      <Label
        className={style.ItemHighlightWrapper(!!totalOrderItem)}
      >{` ${totalOrderItem} `}</Label>
      <div className={style.IconHighlightWrapper(!!totalOrderItem)}>
        <Icon icon="ORDER_ITEM" />
      </div>

      <Label className={style.ItemHighlightWrapper(!!totalBatch)}>{` ${totalBatch} `}</Label>
      <div className={style.IconHighlightWrapper(!!totalBatch)}>
        <Icon icon="BATCH" />
      </div>

      <Label className={style.ItemHighlightWrapper(!!totalShipment)}>{` ${totalShipment} `}</Label>
      <div className={style.IconHighlightWrapper(!!totalShipment)}>
        <Icon icon="SHIPMENT" />
      </div>
    </div>
  </div>
);

export default HighLightToolBar;
