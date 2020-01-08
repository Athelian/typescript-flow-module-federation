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
  amount: number,
  currency: string,
};

const PriceInput = ({ value: priceValue, onChange, readonly }: InputProps<PriceValue>) => {
  const { amount = 0, currency = 'USD' } = priceValue || {};
  return (
    <div className={CellInputWrapperStyle}>
      <BaseNumberInput
        className={InputStyle}
        value={amount === null ? '' : amount}
        required
        onChange={e =>
          onChange({
            amount: e.target.value,
            currency,
          })
        }
        disabled={readonly}
      />
      <div className={CellDisplayWrapperStyle}>
        <SearchSelectEnumInput.Currency
          readonly={readonly}
          value={currency}
          onChange={newCurrency =>
            onChange({
              amount,
              currency: newCurrency || 'USD',
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
