// @flow
import * as React from 'react';
import FormattedNumber from 'components/FormattedNumber';
import type { DisplayProps } from 'components/Sheet/CellRenderer/Cell/CellDisplay/types';
import { CellDisplayWrapperStyle } from 'components/Sheet/CellRenderer/Cell/CellDisplay/Common/style';
import { DelayStyle } from './style';

const DifferenceDateDisplay = ({ value }: DisplayProps<number | null>) => (
  <div className={CellDisplayWrapperStyle}>
    <span className={DelayStyle(!!value && value > 0)}>
      {!!value && value > 0 && '+'}
      {!!value && <FormattedNumber value={value} />}
    </span>
  </div>
);

export default DifferenceDateDisplay;
