// @flow
import * as React from 'react';
import Permission from 'components/common/Permission';
import type { PermissionProps } from 'components/common/Permission/type.js.flow';
import TagListProvider from 'providers/TagListProvider';
import type { TagsQueryType } from 'providers/TagListProvider/type.js.flow';
import type { Props as TagsInputProps } from './type.js.flow';
import BaseTagsInput from './BaseTagsInput';

type Props = PermissionProps & TagsInputProps & { tagType: TagsQueryType };

export default function TagsInput(props: Props) {
  const { permissions, tagType, ...rest } = props;
  return (
    <TagListProvider tagType={tagType}>
      {({ data }) => (
        <Permission permissions={permissions}>
          {allowActions => <BaseTagsInput tags={data} {...rest} {...allowActions} />}
        </Permission>
      )}
    </TagListProvider>
  );
}
