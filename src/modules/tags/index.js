// @flow
import * as React from 'react';
import { Router } from '@reach/router';
import withForbidden from 'hoc/withForbidden';
import { TAG_CREATE, TAG_LIST } from 'modules/permission/constants/tag';
import TagListModule from './index.list';
import TagFormModule from './index.form';

const TagFormModuleCreationWrapper = withForbidden(TagFormModule, TAG_CREATE);
const TagModuleListWrapper = withForbidden(TagListModule, TAG_LIST);

const TagApp = () => (
  <Router>
    <TagModuleListWrapper path="/" />
    <TagFormModuleCreationWrapper path="new" />
    <TagFormModuleCreationWrapper path="clone/:tagId" />
    <TagFormModule path=":tagId" />
  </Router>
);

export default TagApp;
