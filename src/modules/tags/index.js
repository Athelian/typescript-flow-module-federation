// @flow
import * as React from 'react';
import { Router } from '@reach/router';
import withForbidden from 'hoc/withForbidden';
import { TAG_CREATE, TAG_FORM, TAG_LIST } from 'modules/permission/constants/tag';
import TagListModule from './index.list';
import TagFormModule from './index.form';

const TagFormModuleDetailWrapper = withForbidden(TagFormModule, TAG_FORM);
const TagFormModuleCreationWrapper = withForbidden(TagFormModule, TAG_CREATE);
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
