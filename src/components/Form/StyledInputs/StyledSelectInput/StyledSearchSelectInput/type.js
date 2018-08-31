// @flow
import {
  type StyledSelectInputProps,
  defaultStyledSelectInputProps,
} from 'components/Form/StyledInputs/StyledSelectInput/type';

type OptionalProps = {
  onSearch: string => void,
};

export type StyledSearchSelectInputProps = StyledSelectInputProps & OptionalProps;

export const defaultStyledSearchSelectInputProps = {
  ...defaultStyledSelectInputProps,
  onSearch: () => {},
};

export default defaultStyledSearchSelectInputProps;
