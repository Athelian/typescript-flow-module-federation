// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import FormattedNumber from 'components/FormattedNumber';
import type { DisplayProps } from 'components/Sheet/CellRenderer/Cell/CellDisplay/types';
import { CellDisplayWrapperStyle } from 'components/Sheet/CellRenderer/Cell/CellDisplay/Common/style';
import { DelayStyle } from './style';

const DateDifferenceDisplay = ({ value }: DisplayProps<number | null>) => (
  <div className={CellDisplayWrapperStyle}>
    <span className={DelayStyle(value || 0)}>
      {value === null ? (
        <FormattedMessage id="components.cards.na" defaultMessage="N/A" />
      ) : (
        <>
          {!!value && value > 0 && '+'}
          {!!value && <FormattedNumber value={value} />}
        </>
      )}
    </span>
  </div>
);

export default DateDifferenceDisplay;
