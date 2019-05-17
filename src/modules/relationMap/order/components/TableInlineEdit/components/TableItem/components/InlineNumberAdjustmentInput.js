// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { DefaultStyle, NumberInput } from 'components/Form';
import { NewButton } from 'components/Buttons';
import { useNumberInput } from 'modules/form/hooks';
import emitter from 'utils/emitter';
import InlineSelectEnumInput from './InlineSelectEnumInput';
import { InlineRowStyle } from './style';

type OptionalProps = {
  isRequired: boolean,
  value: ?{
    quantity: number,
    type: string,
  },
};

type Props = OptionalProps & {
  name: string,
  id: string,
};

const defaultProps = {
  isRequired: false,
  value: null,
};

export default function InlineNumberAdjustmentInput({ name, value, isRequired, id }: Props) {
  const hasQuantityYet = !!value;
  const { hasError, isFocused, ...inputHandlers } = useNumberInput(
    value && value.quantity ? value.quantity : 0,
    {
      isRequired,
    }
  );
  return hasQuantityYet ? (
    <div className={InlineRowStyle}>
      <DefaultStyle width="97.5px" type="text" isFocused={isFocused} hasError={hasError}>
        <InlineSelectEnumInput
          value={value && value.type ? value.type : ''}
          enumType="BatchQuantityRevisionType"
          id={`input-${id}`}
          name={`${name}.type`}
          width="97.5px"
        />
      </DefaultStyle>
      <DefaultStyle width="97.5px" type="number" isFocused={isFocused} hasError={hasError}>
        <NumberInput
          name={`${name}.quantity`}
          id={`input-${id}`}
          {...inputHandlers}
          onBlur={() => {
            inputHandlers.onBlur();
            emitter.emit('INLINE_CHANGE', {
              hasError,
              name: `${name}.quantity`,
              value: inputHandlers.value,
            });
          }}
          align="right"
        />
      </DefaultStyle>
    </div>
  ) : (
    <NewButton
      label={<FormattedMessage id="components.button.newQuantity" defaultMessage="NEW QUANTITY" />}
      onClick={() => {
        emitter.emit('INLINE_CHANGE', {
          name,
          hasError: false,
          value: {
            quantity: 0,
            type: 'Other',
          },
        });
      }}
      id={`input-${id}`}
    />
  );
}

InlineNumberAdjustmentInput.defaultProps = defaultProps;
