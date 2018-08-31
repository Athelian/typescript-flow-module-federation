// @flow
import {
  type PureDateInputProps,
  defaultPureDateInputProps,
} from 'components/Form/PureInputs/PureDateInput/type';
import { type StyledInputProps, defaultStyledInputProps } from 'components/Form/StyledInputs/type';

type OptionalProps = StyledInputProps & {
  pureInputOptions: PureDateInputProps,
};

export type StyledDateInputProps = OptionalProps;

export const defaultStyledDateInputProps = {
  ...defaultStyledInputProps,
  pureInputOptions: defaultPureDateInputProps,
};

export default defaultStyledDateInputProps;
