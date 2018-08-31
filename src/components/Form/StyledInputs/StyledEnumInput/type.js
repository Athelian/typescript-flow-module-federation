// @flow
import {
  type PureSelectInputProps,
  defaultPureSelectInputProps,
} from 'components/Form/PureInputs/PureSelectInput/type';
import { defaultStyledInputProps } from 'components/Form/StyledInputs/type';
import type { StyledSearchSelectInputProps } from '../StyledSelectInput/StyledSearchSelectInput/type';

export type EnumInputProps = StyledSearchSelectInputProps & {
  pureInputOptions: PureSelectInputProps,
  enumType: string,
};

export const defaultStyledEmailInputProps = {
  ...defaultStyledInputProps,
  pureInputOptions: defaultPureSelectInputProps,
};

export default defaultStyledEmailInputProps;
