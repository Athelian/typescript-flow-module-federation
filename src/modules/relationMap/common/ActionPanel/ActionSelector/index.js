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
        <Label>
          <FormattedMessage {...messages.selected} />
        </Label>
        <button className={style.CancelButtonStyle} type="button" onClick={onCancelTarget}>
          <Icon icon="CANCEL" />
        </button>
        <div className={style.SelectedWrapperStyle}>
          {!!totalOrder && (
            <Label>
              {` ${totalOrder} `}
              <FormattedMessage {...messages.ordersLabel} />
            </Label>
          )}
          {!!totalOrderItem && (
            <Label>
              {` ${totalOrderItem} `}
              <FormattedMessage {...messages.itemsLabel} />
            </Label>
          )}
          {!!totalBatch && (
            <Label>
              {` ${totalBatch} `}
              <FormattedMessage {...messages.batchesLabel} />
            </Label>
          )}
          {!!totalShipment && (
            <Label>
              {` ${totalShipment} `}
              <FormattedMessage {...messages.shipmentsLabel} />
            </Label>
          )}
        </div>
      </div>
      <div className={style.ChildrenWrapperStyle}>{children}</div>
    </div>
  );
};

export default ActionSelector;
