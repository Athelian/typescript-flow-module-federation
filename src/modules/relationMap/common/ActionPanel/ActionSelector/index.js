// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Label } from 'components/Form';
import Icon from 'components/Icon';
import messages from 'modules/relationMap/messages';
import * as style from '../style';

type Props = {
  children: React.Node,
  target: Object,
  onCancelTarget: Function,
};

const getTotal = (target, type) => (target ? Object.keys(target[type] || {}).length : 0);

const ActionSelector = ({ children, target, onCancelTarget }: Props) => {
  const totalOrder = getTotal(target, 'order');
  const totalOrderItem = getTotal(target, 'orderItem');
  const totalBatch = getTotal(target, 'batch');
  const totalShipment = getTotal(target, 'shipment');
  return (
    <div className={style.ActionSection1WrapperStyle}>
      <div className={style.ActionsSelectedStyle}>
        <button className={style.CancelButtonStyle} type="button" onClick={onCancelTarget}>
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
};

export default ActionSelector;
