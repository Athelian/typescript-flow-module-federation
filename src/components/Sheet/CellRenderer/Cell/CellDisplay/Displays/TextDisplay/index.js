// @flow
import * as React from 'react';
import type { DisplayProps } from 'components/Sheet/CellRenderer/Cell/CellDisplay/types';
import {
  CellDisplayWrapperStyle,
  DisplayContentStyle,
} from 'components/Sheet/CellRenderer/Cell/CellDisplay/Common/style';

const TextDisplay = ({ value }: DisplayProps<string | null>) => (
  <div className={CellDisplayWrapperStyle}>
    <span className={DisplayContentStyle}>{value}</span>
  </div>
);

export default TextDisplay;
