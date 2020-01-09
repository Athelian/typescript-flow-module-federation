// @flow
import * as React from 'react';
import BaseNumberInput from 'components/Inputs/NumberInput';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import { CellDisplayWrapperStyle } from 'components/Sheet/CellRenderer/Cell/CellDisplay/Common/style';
import {
  CellInputWrapperStyle,
  InputStyle,
} from 'components/Sheet/CellRenderer/Cell/CellInput/Common/style';
import SearchSelectEnumInput from '../SearchSelectEnumInput';

type PriceValue = {
  value: number,
  metric: string,
};

const PriceInput = ({ value: priceValue, onChange, readonly }: InputProps<PriceValue>) => {
  const { value = 0, metric = 'USD' } = priceValue || {};
  return (
    <div className={CellInputWrapperStyle}>
      <BaseNumberInput
        className={InputStyle}
        value={value === null ? '' : value}
        required
        onChange={e =>
          onChange({
            value: e.target.value,
            metric,
          })
        }
        disabled={readonly}
      />
      <div className={CellDisplayWrapperStyle}>
        <SearchSelectEnumInput.Currency
          readonly={readonly}
          value={metric}
          onChange={newCurrency =>
            onChange({
              value,
              metric: newCurrency || 'USD',
            })
          }
          extra={{}}
          context={{}}
          forceBlur={() => {}}
          forceFocus={() => {}}
          focus
        />
      </div>
    </div>
  );
};

export default PriceInput;
