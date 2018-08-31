// @flow
import { type StyledInputProps, defaultStyledInputProps } from 'components/Form/StyledInputs/type';
import {
  type ExternPureSelectInputProps,
  defaultPureSelectInputProps,
} from 'components/Form/PureInputs/PureSelectInput/type';

export type StyledSelectInputProps = StyledInputProps & {
  pureInputOptions: ExternPureSelectInputProps,
};

export const defaultStyledSelectInputProps = {
  ...defaultStyledInputProps,
  pureInputOptions: defaultPureSelectInputProps,
};

export default defaultStyledSelectInputProps;
