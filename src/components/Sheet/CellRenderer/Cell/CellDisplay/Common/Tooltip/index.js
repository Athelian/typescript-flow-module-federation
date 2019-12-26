// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Tooltip as BaseTooltip } from 'components/Tooltip';
import TooltipIcon from 'components/Form/FormTooltip/TooltipIcon';
import type { TooltipProps } from 'components/Sheet/CellRenderer/Cell/CellDisplay/types';
import { TooltipWrapperStyle } from './style';

const Tooltip = ({ message, type }: TooltipProps) => (
  <div className={TooltipWrapperStyle}>
    <BaseTooltip message={<FormattedMessage {...message} />}>
      <TooltipIcon type={type} hasInfo={false} />
    </BaseTooltip>
  </div>
);

export default Tooltip;
