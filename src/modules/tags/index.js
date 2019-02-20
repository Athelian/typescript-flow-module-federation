// @flow
import * as React from 'react';
import { Router } from '@reach/router';
import { TAG_LIST, TAG_CREATE, TAG_GET } from 'modules/permission/constants/tag';
import usePermission from 'hooks/usePermission';
import TagListModule from './index.list';
import TagFormModule from './index.form';

const TagApp = () => {
  const { hasPermission } = usePermission();
  const allowList = hasPermission(TAG_LIST);
  const allowCreate = hasPermission(TAG_CREATE);
  const allowGet = hasPermission(TAG_GET);
  return (
    <Router>
      {allowList && <TagListModule path="/" />}
      {allowCreate && <TagFormModule path="new" />}
      {allowCreate && <TagFormModule path="clone/:tagId" />}
      {allowGet && <TagFormModule path=":tagId" />}
    </Router>
  );
};

export default TagApp;
