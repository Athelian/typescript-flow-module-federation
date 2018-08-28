// @flow
import {
  type PureSelectInputProps,
  defaultPureSelectInputProps,
} from 'components/Form/PureInputs/PureSelectInput/type';

export type PureSearchSelectInputProps = PureSelectInputProps & {
  onSearch: string => void,
};

export const defaultPureSearchSelectInputProps = {
  ...defaultPureSelectInputProps,
  onSearch: () => {},
};

export default defaultPureSearchSelectInputProps;
