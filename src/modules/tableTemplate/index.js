// @flow
import * as React from 'react';
import { Router } from '@reach/router';
import TableTemplateList from './index.list';

const TableTemplateModule = () => (
  <Router>
    <TableTemplateList path="/" />
  </Router>
);

export default TableTemplateModule;
