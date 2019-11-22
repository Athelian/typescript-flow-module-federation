// @flow
import { MessageDescriptor } from 'react-intl';

export type FilterConfig = {
  entity: string,
  field: string,
  type: string,
  message: MessageDescriptor,
  defaultValue?: any,
  hidden?: boolean,
};

export type FilterState = {
  entity: string | null,
  field: string | null,
  type: string | null,
  value: any,
};

export type FilterInputProps<T> = {
  value: T,
  readonly: boolean,
  onChange: T => void,
};
