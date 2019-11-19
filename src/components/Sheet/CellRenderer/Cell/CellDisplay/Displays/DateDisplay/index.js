// @flow
import * as React from 'react';
import FormattedDate from 'components/FormattedDate';
import type { DisplayProps } from 'components/Sheet/CellRenderer/Cell/CellDisplay/types';
import {
  CellDisplayWrapperStyle,
  DisplayContentStyle,
} from 'components/Sheet/CellRenderer/Cell/CellDisplay/Common/style';

const DateDisplay = ({ value }: DisplayProps<Date | string | null>) => (
  <div className={CellDisplayWrapperStyle}>
    <span className={DisplayContentStyle}>
      <FormattedDate value={value} />
    </span>
  </div>
);

export default DateDisplay;
