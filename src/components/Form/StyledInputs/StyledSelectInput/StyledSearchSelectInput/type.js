// @flow
import {
  type StyledSelectInputProps,
  defaultStyledSelectInputProps,
} from 'components/Form/StyledInputs/StyledSelectInput/type';

export type StyledSearchSelectInputProps = StyledSelectInputProps & {
  onSearch: string => void,
};

export const defaultStyledSearchSelectInputProps = {
  ...defaultStyledSelectInputProps,
  onSearch: () => {},
};

export default defaultStyledSearchSelectInputProps;
