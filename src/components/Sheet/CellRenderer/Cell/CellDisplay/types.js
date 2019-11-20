// @flow

export type DisplayProps<T, E = any> = {|
  value: T,
  entity: {
    id: string,
    type: string,
  } | null,
  extra: E,
|};
