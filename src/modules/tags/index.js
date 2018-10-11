// @flow
import * as React from 'react';
import { Router } from '@reach/router';
import TagListModule from './index.list';
import TagFormModule from './index.form';

const TagApp = () => (
  <Router>
    <TagListModule path="/" />
    <TagFormModule path="new" />
    <TagFormModule path="clone/:tagId" />
    <TagFormModule path=":tagId" />
  </Router>
);

export default TagApp;
