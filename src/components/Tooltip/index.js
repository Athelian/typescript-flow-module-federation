// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { WarningTooltip, InfoTooltip, ErrorTooltip } from 'components/Tooltips';
import TooltipMessage from './TooltipMessage';
import ChangedValueTooltip from './Tooltip';

const getTooltip = (error, warning, info) => {
  if (error) return { type: 'error', icon: 'WARNING' };
  if (warning) return { type: 'warning', icon: 'WARNING' };
  if (info) return { type: 'info', icon: 'INFO' };
  return { type: 'edited', icon: 'INFO' };
};

type Props = {
  info?: string | React.Node,
  error?: string | React.Node,
  warning?: string | React.Node,
  oldValue?: string,
  newValue?: string,
  description?: string,
};

const defaultProps = {
  info: '',
  error: '',
  warning: '',
  oldValue: '',
  newValue: '',
  description: '',
};

function Tooltip({ error, warning, info, oldValue, newValue, description }: Props) {
  const tooltip = getTooltip(error, warning, info);
  return oldValue && newValue ? (
    <ChangedValueTooltip
      type={tooltip.type}
      content={
        <TooltipMessage
          title={error || warning || info}
          oldValue={oldValue}
          newValue={newValue}
          description={description}
        />
      }
    >
      <Icon icon={tooltip.icon} />
    </ChangedValueTooltip>
  ) : (
    <React.Fragment>
      {error && <ErrorTooltip error={error} />}
      {warning && <WarningTooltip warning={warning} />}
      {info && <InfoTooltip info={info} />}
    </React.Fragment>
  );
}

Tooltip.defaultProps = defaultProps;

export default Tooltip;
export { TooltipMessage };
