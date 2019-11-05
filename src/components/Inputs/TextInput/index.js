// @flow
import * as React from 'react';
import { useIntl } from 'react-intl';
import messages from 'components/Form/Inputs/messages';

type Props = React.ElementProps<'input'>;

const TextInput = React.forwardRef<Props, HTMLInputElement>(
  ({ placeholder, ...rest }: Props, ref) => {
    const intl = useIntl();
    return (
      <input
        ref={ref}
        placeholder={placeholder || intl.formatMessage(messages.defaultPlaceholder)}
        type="text"
        spellCheck={false}
        {...rest}
      />
    );
  }
);

export default TextInput;
