// @flow
import * as React from 'react';
import faWarning from '@fortawesome/fontawesome-pro-solid/faExclamationTriangle';
import Tooltip from '../Tooltip';
import { WarningButtonStyle, WarningStyle } from './style';

type Props = {
  warning: string | React.Node,
};

const WarningTooltip = ({ warning }: Props) => (
  <Tooltip
    value={warning}
    icon={faWarning}
    preShow
    showDuration={2000}
    iconStyle={WarningButtonStyle}
    tooltipStyle={WarningStyle}
  />
);

export default WarningTooltip;
