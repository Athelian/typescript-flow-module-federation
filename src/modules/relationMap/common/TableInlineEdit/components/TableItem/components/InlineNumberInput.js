// @flow
import * as React from 'react';
import { DefaultStyle, NumberInput } from 'components/Form';
import emitter from 'utils/emitter';
import { useNumberInput } from 'modules/relationMap/common/TableInlineEdit/hooks';

type OptionalProps = {
  isRequired: boolean,
};

type Props = OptionalProps & {
  name: string,
  value: number,
};

const defaultProps = {
  isRequired: false,
};

export default function InlineNumberInput({ name, value, isRequired }: Props) {
  const { hasError, isFocused, ...inputHandlers } = useNumberInput(value, { isRequired });
  return (
    <DefaultStyle type="number" isFocused={isFocused} hasError={hasError} forceHoverStyle>
      <NumberInput
        name={name}
        {...inputHandlers}
        onBlur={() => {
          inputHandlers.onBlur();
          emitter.emit('INLINE_CHANGE', {
            name,
            hasError,
            value: inputHandlers.value,
          });
        }}
      />
    </DefaultStyle>
  );
}

InlineNumberInput.defaultProps = defaultProps;
