// @flow
import * as React from 'react';
import { injectIntl, type IntlShape, FormattedMessage } from 'react-intl';
import FormattedNumber from 'components/FormattedNumber';
import { Display } from 'components/Form';
import { type InputProps, defaultInputProps } from 'components/Form/Inputs/type';
import NumberInput from '../NumberInput';
import { DaysWrapperStyle } from './style';

type OptionalProps = {
  nullable: boolean,
};

type Props = OptionalProps &
  InputProps & {
    intl: IntlShape,
  };

const defaultProps = {
  ...defaultInputProps,
  nullable: false,
};

const DayInput = ({
  intl,
  value,
  align,
  readOnly,
  readOnlyWidth,
  readOnlyHeight,
  nullable,
  ...rest
}: Props) => {
  return readOnly ? (
    <Display align={align} width={readOnlyWidth} height={readOnlyHeight}>
      <FormattedNumber value={value} />{' '}
      <FormattedMessage id="components.inputs.days" defaultMessage="Days" />
    </Display>
  ) : (
    <>
      <NumberInput value={value} align={align} {...rest} />
      <div className={DaysWrapperStyle({ height: readOnlyHeight, align })}>
        <FormattedMessage id="components.inputs.days" defaultMessage="Days" />
      </div>
    </>
  );
};

DayInput.defaultProps = defaultProps;

export default injectIntl(DayInput);
