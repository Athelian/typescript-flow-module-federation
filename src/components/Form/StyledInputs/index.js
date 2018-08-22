// @flow
import { type PureInputProps, pureInputDefaultProps } from 'components/Form/PureInputs';

export type StyledInputProps = PureInputProps & {
  disabled?: boolean,
  hasError?: boolean,
  forceHoverStyle?: boolean,
};

export const styledInputDefaultProps = {
  ...pureInputDefaultProps,
  disabled: false,
  hasError: false,
  forceHoverStyle: false,
};

export default styledInputDefaultProps;
