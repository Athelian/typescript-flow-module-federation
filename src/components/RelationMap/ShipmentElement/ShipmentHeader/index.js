// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import * as style from './style';

type OptionalProps = {
  isCollapsed: boolean,
};

type Props = OptionalProps & {
  isChecked: boolean,
  onToggle: Function,
  label: string,
  ordersNo: number,
  batchesNo: number,
};

const defaultProps = {
  isCollapsed: false,
};

const ENABLE_ACTION_CHECK = false;

const ShipmentHeader = ({
  isChecked,
  isCollapsed,
  onToggle,
  label,
  ordersNo,
  batchesNo,
}: Props) => (
  <>
    <div className={style.ShipmentActionsWrapperStyle(isChecked, ENABLE_ACTION_CHECK)}>
      {ENABLE_ACTION_CHECK && (
        <button
          type="button"
          className={style.ShipmentActionCheckStyle(isChecked)}
          tabIndex={-1}
          onClick={onToggle}
        >
          <Icon icon="ORDER_SELECT" />
        </button>
      )}
      <div className={style.ShipmentActionLabelStyle}>{label}</div>
      <div />
      <button
        type="button"
        className={style.ShipmentActionToggleButtonStyle}
        tabIndex={-1}
        onClick={onToggle}
      >
        {isCollapsed ? 'ALL' : 'HIDE'}
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

ShipmentHeader.defaultProps = defaultProps;

export default ShipmentHeader;
