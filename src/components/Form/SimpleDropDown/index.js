// @flow
import * as React from 'react';
import Permission from 'components/common/Permission';
import type { PermissionProps } from 'components/common/Permission/type.js.flow';
import type { SimpleDropDownProps } from './type.js.flow';
import BaseDropDown from './BaseDropDown';

type Props = PermissionProps & SimpleDropDownProps;

export default function SimpleDropDown(props: Props) {
  const { permissions, isFullEdit, ...rest } = props;
  return (
    <Permission permissions={permissions}>
      {allowActions => <BaseDropDown {...rest} {...allowActions} />}
    </Permission>
  );
}
