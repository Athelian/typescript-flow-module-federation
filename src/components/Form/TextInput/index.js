// @flow
import * as React from 'react';
import Permission from 'components/common/Permission';
import type { PermissionProps } from 'components/common/Permission/type.js.flow';
import type { TextInputProps } from './type.js.flow';
import BaseTextInput from './BaseTextInput';

type Props = PermissionProps & TextInputProps;

export default function TextInput(props: Props) {
  const { permissions, ...rest } = props;
  return (
    <Permission permissions={permissions}>
      {allowActions => <BaseTextInput {...rest} {...allowActions} />}
    </Permission>
  );
}
