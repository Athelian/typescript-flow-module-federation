// @flow
import * as React from 'react';
import Permission from 'components/common/Permission';
import type { PermissionProps } from 'components/common/Permission/type.js.flow';
import type { NumberInputProps } from './type.js.flow';
import BaseNumberInput from './BaseNumberInput';

type Props = PermissionProps & NumberInputProps;

export default function NumberInput(props: Props) {
  const { permissions, ...rest } = props;
  return (
    <Permission permissions={permissions}>
      {allowActions => <BaseNumberInput {...rest} {...allowActions} />}
    </Permission>
  );
}
