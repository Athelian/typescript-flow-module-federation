// @flow
import * as React from 'react';
import FormattedNumber from 'components/FormattedNumber';
import type { DisplayProps } from 'components/Sheet/CellRenderer/Cell/CellDisplay/types';
import {
  CellDisplayWrapperStyle,
  DisplayContentStyle,
} from 'components/Sheet/CellRenderer/Cell/CellDisplay/Common/style';

const NumberDisplay = ({ value }: DisplayProps<number | null>) => (
  <div className={CellDisplayWrapperStyle}>
    <span className={DisplayContentStyle}>
      <FormattedNumber value={value} />
    </span>
  </div>
);

export default NumberDisplay;
