import * as React from 'react';
import { Provider } from 'unstated';
import { IntlProvider } from 'react-intl';
/* eslint-disable import/no-extraneous-dependencies */
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import TableInlineEdit from './index';

storiesOf('RelationMap/TableInlineEdit', module).add('without selected field', () => (
  <Provider>
    <IntlProvider locale="en">
      <TableInlineEdit
        onSave={action('onSave')}
        onCancel={action('onCancel')}
        onExpand={action('onExpand')}
      />
    </IntlProvider>
  </Provider>
));
