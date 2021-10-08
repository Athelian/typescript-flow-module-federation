// @flow
import * as React from 'react';
import { Router } from '@reach/router';
import withForbidden from 'hoc/withForbidden';
import { NAVIGATION_NETWORK_PARTNERS } from 'modules/permission/constants/navigation';
import { PARTNER_FORM } from 'modules/permission/constants/partner';
import PartnerListModule from './index.list';
import PartnerFormModule from './index.form';

const PartnerFormModuleWrapper = withForbidden(PartnerFormModule, PARTNER_FORM);
const PartnerModuleListWrapper = withForbidden(PartnerListModule, NAVIGATION_NETWORK_PARTNERS);

const PartnerApp = () => (
  <Router>
    <PartnerModuleListWrapper path="/" />
    <PartnerFormModuleWrapper path=":partnerId" />
  </Router>
);

export default PartnerApp;
