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
        /* $FlowFixMe This comment suppresses an error found when upgrading
         * Flow to v0.112.0. To view the error, delete this comment and run
         * Flow. */
        {...rest}
      />
    );
  }
);

export default TextInput;
