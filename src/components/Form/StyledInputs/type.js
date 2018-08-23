// @flow
import { type PureInputProps, pureInputDefaultProps } from 'components/Form/PureInputs/type';

export type StyledInputProps = PureInputProps & {
  hasError?: boolean,
  disabled?: boolean,
  forceHoverStyle?: boolean,
  width?: string,
};

export const styledInputDefaultProps = {
  ...pureInputDefaultProps,
  hasError: false,
  disabled: false,
  forceHoverStyle: false,
  width: '100%',
};

export type StyledInputStates = {
  isFocused: boolean,
};

export default styledInputDefaultProps;
