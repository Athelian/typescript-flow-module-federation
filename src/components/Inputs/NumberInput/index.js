// @flow
import * as React from 'react';
import { useIntl } from 'react-intl';
import messages from 'components/Form/Inputs/messages';
import { toFloatNullable } from 'utils/number';

type Props = React.ElementProps<'input'>;

const NumberInput = React.forwardRef<Props, HTMLInputElement>(
  ({ required, placeholder, onChange, onBlur, ...rest }: Props, ref) => {
    const intl = useIntl();

    const handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
      if (!onChange) {
        return;
      }

      onChange({
        ...e,
        target: {
          ...e.target,
          value: toFloatNullable(e.target.value),
        },
      });
    };

    const handleBlur = (e: SyntheticFocusEvent<HTMLInputElement>) => {
      // $FlowFixMe
      if (required && e.target.value === '') {
        // $FlowFixMe
        e.target.value = 0; // eslint-disable-line no-param-reassign
      }

      if (onBlur) {
        onBlur(e);
      }
    };

    return (
      <input
        ref={ref}
        required={required}
        placeholder={placeholder || intl.formatMessage(messages.defaultPlaceholder)}
        type="number"
        onChange={handleChange}
        onBlur={handleBlur}
        {...rest}
      />
    );
  }
);

export default NumberInput;
