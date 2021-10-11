// @flow
import * as React from 'react';
import { Router, Redirect } from '@reach/router';
import withForbidden from 'hoc/withForbidden';
import { NAVIGATION_TAGS_LIST } from 'modules/permission/constants/navigation';
import { TAG_CREATE } from 'modules/permission/constants/tag';
import TagListModule from './index.list';
import TagFormModule from './index.form';

const TagFormModuleCreationWrapper = withForbidden(TagFormModule, TAG_CREATE);
const TagModuleListWrapper = withForbidden(TagListModule, NAVIGATION_TAGS_LIST);

const TagApp = () => (
  <Router>
    {/* $FlowFixMe Flow typed is not updated yet */}
    <Redirect path="/" from="/" to="/tags/cards" noThrow />
    <TagModuleListWrapper path="/cards" />
    <TagFormModuleCreationWrapper path="new" />
    <TagFormModuleCreationWrapper path="clone/:tagId" />
    <TagFormModule path=":tagId" />
  </Router>
);

export default TagApp;
