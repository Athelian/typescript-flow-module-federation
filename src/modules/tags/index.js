// @flow
import * as React from 'react';
import { Router } from '@reach/router';
import TagListContainer from './index.list';
import TagFormContainer from './index.form';

const TagApp = () => (
  <Router>
    <TagListContainer path="/" />
    <TagFormContainer path=":tagId" />
  </Router>
);

export default TagApp;
