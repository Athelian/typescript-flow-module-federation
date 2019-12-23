// @flow
import * as React from 'react';
import { Router } from '@reach/router';
import withForbidden from 'hoc/withForbidden';
import { DOCUMENT_LIST } from 'modules/permission/constants/file';
import DocumentListModule from './index.list';
import DocumentFormModule from './index.form';

const DocumentListModuleWrapper = withForbidden(DocumentListModule, DOCUMENT_LIST);

const DocumentApp = () => (
  <Router>
    <DocumentListModuleWrapper path="/" />
    <DocumentFormModule path=":documentId" />
  </Router>
);

export default DocumentApp;
