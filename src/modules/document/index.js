// @flow
import * as React from 'react';
import { Router, Redirect } from '@reach/router';
import withForbidden from 'hoc/withForbidden';
import { DOCUMENT_LIST } from 'modules/permission/constants/file';
import DocumentListModule from './index.list';
import DocumentFormModule from './index.form';

const DocumentListModuleWrapper = withForbidden(DocumentListModule, DOCUMENT_LIST);

const DocumentApp = () => (
  <Router>
    {/* $FlowFixMe Flow typed is not updated yet */}
    <Redirect path="/" from="/" to="/document/cards" noThrow />
    <DocumentListModuleWrapper path="/cards" />
    <DocumentFormModule path=":documentId" />
  </Router>
);

export default DocumentApp;
