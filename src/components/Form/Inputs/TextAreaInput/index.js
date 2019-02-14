// @flow
import * as React from 'react';
import { injectIntl, type IntlShape } from 'react-intl';
import { type InputProps, defaultInputProps } from 'components/Form/Inputs/type';
import { isNullOrUndefined } from 'utils/fp';
import messages from 'components/Form/Inputs/messages';
import { TextAreaReadOnlyStyle } from './style';

type Props = InputProps & {
  intl: IntlShape,
};

// $FlowFixMe it is an open issue on flow https://github.com/facebook/flow/issues/6103
const TextAreaInput = React.forwardRef(
  (
    { intl, value, align, readOnly, readOnlyWidth, readOnlyHeight, placeholder, ...rest }: Props,
    ref
  ) =>
    readOnly ? (
      <div
        className={TextAreaReadOnlyStyle({ align, readOnlyWidth, readOnlyHeight })}
        ref={ref}
        {...rest}
      >
        {value}
      </div>
    ) : (
      <textarea
        style={{ textAlign: align }}
        value={value || ''}
        placeholder={
          isNullOrUndefined(placeholder)
            ? intl.formatMessage(messages.defaultPlaceholder)
            : placeholder
        }
        ref={ref}
        {...rest}
        spellCheck={false}
      />
    )
);

TextAreaInput.defaultProps = defaultInputProps;

export default injectIntl(TextAreaInput);
