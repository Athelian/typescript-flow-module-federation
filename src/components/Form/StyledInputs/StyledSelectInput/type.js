// @flow
import { type PureInputProps, defaultPureInputProps } from 'components/Form/PureInputs/type';
import { type StyledInputProps, defaultStyledInputProps } from 'components/Form/StyledInputs/type';

export type StyledSelectInputProps = PureInputProps &
  StyledInputProps & {
    items: Array<any>,
    itemToString: any => string,
    itemToValue: any => any,
  };

export const defaultStyledSelectInputProps = {
  ...defaultPureInputProps,
  ...defaultStyledInputProps,
};

export default defaultStyledSelectInputProps;
