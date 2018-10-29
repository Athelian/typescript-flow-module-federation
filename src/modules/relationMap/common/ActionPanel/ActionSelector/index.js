// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Label } from 'components/Form';
import messages from 'modules/relationMap/messages';
import * as style from '../style';

type Props = {
  children: React.Node,
  target: Object,
};

const getTotal = (target, type) => (target ? Object.keys(target[type] || {}).length : 0);

const ActionSelector = ({ children, target }: Props) => {
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
        <div>
          {!!totalOrder && (
            <Label>
              {` ${totalOrder} `}
              <FormattedMessage {...messages.ordersLabel} />
            </Label>
          )}
          {!!totalOrderItem && (
            <Label>
              {` ${totalOrderItem} `}
              <FormattedMessage {...messages.productsTab} />
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
