/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import QueryFormPermissionContext from 'components/common/QueryForm/context';
import PackagingSections from './index';

storiesOf('PackagingSections', module).add('default props', () => (
  <QueryFormPermissionContext.Provider
    value={{
      isOwner: false,
      permissions: [
        'product.products.update',
        'product.productProviders.update',
        'product.productProviderPackages.create',
        'product.productProviderPackages.delete',
        'product.productProviderPackages.setDefaultPackage',
      ],
    }}
  >
    <PackagingSections />
  </QueryFormPermissionContext.Provider>
));
