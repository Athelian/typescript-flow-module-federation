// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import EnumProvider from 'providers/enum';
import { FieldItem, Label, NumberRangeInput } from 'components/Form';
import EnumInput from '../EnumArrayInput/components/EnumInput';
import { PriceRangeWrapperStyle } from './style';
import messages from '../messages';

type OptionalProps = {
  currency: Object,
  min: number,
  max: number,
};

type Props = OptionalProps & {
  onChangeCurrency: Function,
  onChangeMin: Function,
  onChangeMax: Function,
};

export default function PriceRange({
  currency,
  min,
  max,
  onChangeCurrency,
  onChangeMin,
  onChangeMax,
}: Props) {
  return (
    <div className={PriceRangeWrapperStyle}>
      <FieldItem
        vertical
        label={
          <Label>
            <FormattedMessage {...messages.currency} />
          </Label>
        }
        input={
          <EnumProvider enumType="Currency">
            {({ loading, error, data }) => {
              if (loading) return null;
              if (error) return `Error!: ${error}`;

              return (
                <EnumInput
                  data={data}
                  value={currency}
                  onChange={inputValue => onChangeCurrency(inputValue)}
                />
              );
            }}
          </EnumProvider>
        }
      />

      <NumberRangeInput min={min} max={max} onChangeMin={onChangeMin} onChangeMax={onChangeMax} />
    </div>
  );
}
