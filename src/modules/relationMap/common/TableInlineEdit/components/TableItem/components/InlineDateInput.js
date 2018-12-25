// @flow
import * as React from 'react';
import { DefaultStyle, DateInput } from 'components/Form';
import emitter from 'utils/emitter';
import { useDateInput } from 'modules/form/hooks';

type OptionalProps = {
  isRequired: boolean,
};

type Props = OptionalProps & {
  name: string,
  value: string,
  id: string,
};

const defaultProps = {
  isRequired: false,
};

export default function InlineDateInput({ name, value, isRequired, id }: Props) {
  const { hasError, isFocused, ...inputHandlers } = useDateInput(value, { isRequired });
  return (
    <DefaultStyle type="date" isFocused={isFocused} hasError={hasError}>
      <DateInput
        id={`input-${id}`}
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
        align="left"
      />
    </DefaultStyle>
  );
}

InlineDateInput.defaultProps = defaultProps;
