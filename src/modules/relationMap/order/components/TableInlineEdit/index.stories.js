import * as React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import TableInlineEdit from './index';

storiesOf('RelationMap/TableInlineEdit', module).add('without selected field', () => (
  <TableInlineEdit onSave={action('onSave')} onCancel={action('onCancel')} />
));
