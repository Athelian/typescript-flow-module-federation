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
      const value = toFloatNullable(required && e.target.value === '' ? 0 : e.target.value);
      // $FlowFixMe
      e.target.value = value; // eslint-disable-line no-param-reassign

      if (onBlur) {
        onBlur({
          ...e,
          target: {
            ...e.target,
            value,
          },
        });
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
        /* $FlowFixMe This comment suppresses an error found when upgrading
         * Flow to v0.112.0. To view the error, delete this comment and run
         * Flow. */
        {...rest}
      />
    );
  }
);

export default NumberInput;
