// @flow
import * as React from 'react';
import Permission from 'components/common/Permission';
import type { PermissionProps } from 'components/common/Permission/type.js.flow';
import type { Props as TagsInputProps } from './type.js.flow';
import BaseTagsInput from './BaseTagsInput';

type Props = PermissionProps & TagsInputProps;

export default function SimpleDropDown(props: Props) {
  const { permissions, ...rest } = props;
  return (
    <Permission permissions={permissions}>
      {allowActions => <BaseTagsInput {...rest} {...allowActions} />}
    </Permission>
  );
}
