// @flow

export type OptionalProps = {
  type: 'standard' | 'date' | 'number' | 'textarea' | 'max-textarea' | 'label' | 'button',
  isFocused: boolean,
  hasError: boolean,
  disabled: boolean,
  forceHoverStyle: boolean,
  width: string,
  height: string,
};

export const defaultProps = {
  type: 'standard',
  isFocused: false,
  hasError: false,
  disabled: false,
  forceHoverStyle: false,
  width: '100%',
  height: '30px',
};

export default defaultProps;
