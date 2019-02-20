// @flow
import * as React from 'react';
import { Router } from '@reach/router';
import withNotFound from 'hoc/withNotFound';
import withForbidden from 'hoc/withForbidden';
import { TAG_CREATE, TAG_GET, TAG_LIST } from 'modules/permission/constants/tag';
import TagListModule from './index.list';
import TagFormModule from './index.form';

const TagFormModuleWrapper = withNotFound(TagFormModule, 'tagId');
const TagFormModuleDetailWrapper = withForbidden(TagFormModuleWrapper, TAG_GET);
const TagFormModuleCreationWrapper = withForbidden(TagFormModuleWrapper, TAG_CREATE);
const TagModuleListWrapper = withForbidden(TagListModule, TAG_LIST);

const TagApp = () => (
  <Router>
    <TagModuleListWrapper path="/" />
    <TagFormModuleCreationWrapper path="new" />
    <TagFormModuleCreationWrapper path="clone/:tagId" />
    <TagFormModuleDetailWrapper path=":tagId" />
  </Router>
);

export default TagApp;
