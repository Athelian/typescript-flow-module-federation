// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { FieldItem, Label, DefaultStyle, NumberInput } from 'components/Form';
import { NumberInputsWrapperStyle } from './style';

type OptionalProps = {
  min: number,
  max: number,
  onChangeMin: Function,
  onChangeMax: Function,
};

type Props = OptionalProps;

export default function NumberRangeInput({ min, max, onChangeMin, onChangeMax }: Props) {
  return (
    <div className={NumberInputsWrapperStyle}>
      <FieldItem
        vertical
        label={
          <Label>
            <FormattedMessage id="components.numberRangeInput.min" defaultMessage="MIN" />
          </Label>
        }
        input={
          <DefaultStyle type="number" forceHoverStyle>
            <NumberInput align="left" value={min} onChange={onChangeMin} />
          </DefaultStyle>
        }
      />
      <FieldItem
        vertical
        label={
          <Label>
            <FormattedMessage id="components.numberRangeInput.max" defaultMessage="MAX" />
          </Label>
        }
        input={
          <DefaultStyle type="number" forceHoverStyle>
            <NumberInput align="left" value={max} onChange={onChangeMax} />
          </DefaultStyle>
        }
      />
    </div>
  );
}
