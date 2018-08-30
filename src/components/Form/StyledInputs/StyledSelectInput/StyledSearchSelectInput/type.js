// @flow
import {
  type StyledSelectInputProps,
  defaultStyledSelectInputProps,
} from 'components/Form/StyledInputs/StyledSelectInput/type';
import { defaultPureInputProps } from 'components/Form/PureInputs/type';

export type StyledSearchSelectInputProps = StyledSelectInputProps & {
  onSearch: string => void,
};

export const defaultStyledSearchSelectInputProps = {
  ...defaultPureInputProps,
  ...defaultStyledSelectInputProps,
  onSearch: () => {},
};

export default defaultStyledSearchSelectInputProps;
