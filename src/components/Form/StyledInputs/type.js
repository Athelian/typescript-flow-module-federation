// @flow
import { type PureInputProps, pureInputDefaultProps } from 'components/Form/PureInputs/type';

export type StyledInputProps = PureInputProps & {
  hasError?: boolean,
  disabled?: boolean,
  forceHoverStyle?: boolean,
};

export const styledInputDefaultProps = {
  ...pureInputDefaultProps,
  hasError: false,
  disabled: false,
  forceHoverStyle: false,
};

export type StyledInputStates = {
  isFocused: boolean,
};

export default styledInputDefaultProps;
