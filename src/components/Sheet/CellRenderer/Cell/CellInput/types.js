// @flow

export type InputProps<T, E = any> = {
  value: ?T,
  extra: ?E,
  onChange: (value: ?T, force?: boolean) => void,
  focus: boolean,
  onFocus: () => void,
  onBlur: () => void,
  onKeyDown: (SyntheticKeyboardEvent<HTMLElement>) => void,
  readonly: boolean,
};
