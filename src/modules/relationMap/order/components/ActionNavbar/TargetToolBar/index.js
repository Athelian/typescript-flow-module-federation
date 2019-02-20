// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import { Label } from 'components/Form';
import messages from 'modules/relationMap/messages';
import * as style from '../style';

type Props = {
  children: React.Node,
  onCancel: Function,
  totalOrder: number,
  totalOrderItem: number,
  totalBatch: number,
  totalShipment: number,
};

export default function TargetToolBar({
  onCancel,
  totalOrder,
  totalOrderItem,
  totalBatch,
  totalShipment,
  children,
}: Props) {
  return (
    <div className={style.ActionSection1WrapperStyle}>
      <div className={style.ActionsSelectedStyle}>
        <button className={style.CancelButtonStyle} type="button" onClick={onCancel}>
          <Icon icon="CLEAR" />
        </button>
        <Label className={style.ActionSelectedLabelStyle}>
          <FormattedMessage {...messages.selected} />
        </Label>

        <div className={style.SelectedWrapperStyle}>
          <Label className={style.ItemWrapper(!!totalOrder)}>{` ${totalOrder} `}</Label>
          <div className={style.IconWrapper(!!totalOrder)}>
            <Icon icon="ORDER" />
          </div>
          <Label className={style.ItemWrapper(!!totalOrderItem)}>{` ${totalOrderItem} `}</Label>
          <div className={style.IconWrapper(!!totalOrderItem)}>
            <Icon icon="ORDER_ITEM" />
          </div>

          <Label className={style.ItemWrapper(!!totalBatch)}>{` ${totalBatch} `}</Label>
          <div className={style.IconWrapper(!!totalBatch)}>
            <Icon icon="BATCH" />
          </div>

          <Label className={style.ItemWrapper(!!totalShipment)}>{` ${totalShipment} `}</Label>
          <div className={style.IconWrapper(!!totalShipment)}>
            <Icon icon="SHIPMENT" />
          </div>
        </div>
      </div>
      <div className={style.ChildrenWrapperStyle}>{children}</div>
    </div>
  );
}
