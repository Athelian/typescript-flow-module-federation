// @flow

export type InputProps<T> = {
  value: ?T,
  onChange?: (?T) => void,
  focus?: boolean,
  onFocus?: () => void,
  onBlur?: () => void,
  onKeyDown?: () => void,
  readonly?: boolean,
};
