// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import * as style from './style';

type Props = {
  isChecked: boolean,
  onToggle: Function,
  label: string,
  ordersNo: number,
  batchesNo: number,
};

const ShipmentHeaderActions = ({ isChecked, onToggle, label, ordersNo, batchesNo }: Props) => (
  <>
    <div className={style.ShipmentActionsWrapperStyle(isChecked)}>
      <button
        type="button"
        className={style.ShipmentActionCheckStyle(isChecked)}
        tabIndex={-1}
        onClick={onToggle}
      >
        <Icon icon="ORDER_SELECT" />
      </button>
      <div className={style.ShipmentActionLabelStyle}>{label}</div>
      <div />
      <button
        type="button"
        className={style.ShipmentActionToggleButtonStyle}
        tabIndex={-1}
        onClick={onToggle}
      >
        {isChecked ? 'HIDE' : 'ALL'}
      </button>
      <div className={style.ShipmentActionSummaryStyle}>
        <Icon icon="ORDER" />
        <span>{ordersNo}</span>
        <Icon icon="BATCH" />
        <span>{batchesNo}</span>
      </div>
    </div>
  </>
);

export default ShipmentHeaderActions;
