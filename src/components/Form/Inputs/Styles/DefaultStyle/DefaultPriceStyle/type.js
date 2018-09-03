// @flow

export type OptionalProps = {
  currency: ?string,
  isFocused: boolean,
  hasError: boolean,
  disabled: boolean,
  forceHoverStyle: boolean,
  width: string,
  height: string,
};

export const defaultProps = {
  currency: null,
  isFocused: false,
  hasError: false,
  disabled: false,
  forceHoverStyle: false,
  width: '100%',
  height: '30px',
};

export default defaultProps;
