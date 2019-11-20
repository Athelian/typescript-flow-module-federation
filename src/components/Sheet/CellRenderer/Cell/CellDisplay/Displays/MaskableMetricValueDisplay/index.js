// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Tooltip } from 'components/Tooltip';
import type { MetricValue } from 'types';
import type { DisplayProps } from 'components/Sheet/CellRenderer/Cell/CellDisplay/types';
import {
  CellDisplayWrapperStyle,
  DisplayContentStyle,
} from 'components/Sheet/CellRenderer/Cell/CellDisplay/Common/style';
import MetricValueDisplay from 'components/Sheet/CellRenderer/Cell/CellDisplay/Displays/MetricValueDisplay';
import messages from 'components/Sheet/messages';

// eslint-disable-next-line flowtype/space-after-type-colon
const MaskableMetricValueDisplay = ({
  value,
  extra,
}: // eslint-disable-next-line flowtype/generic-spacing
DisplayProps<
  MetricValue | null,
  {
    message: React.Node,
  }
>) =>
  value ? (
    <MetricValueDisplay value={value} entity={null} extra={null} />
  ) : (
    <div className={CellDisplayWrapperStyle}>
      <Tooltip message={extra.message}>
        <span className={DisplayContentStyle}>
          <FormattedMessage {...messages.invalidMetricValue} />
        </span>
      </Tooltip>
    </div>
  );

export default MaskableMetricValueDisplay;
