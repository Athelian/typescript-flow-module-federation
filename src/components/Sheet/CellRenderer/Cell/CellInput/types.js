// @flow

export type InputProps<T, C = any, E = any> = {|
  value: ?T,
  context: ?C,
  extra: ?E,
  onChange: (value: ?T, force?: boolean) => void,
  focus: boolean,
  forceFocus: () => void,
  forceBlur: () => void,
  readonly: boolean,
|};
