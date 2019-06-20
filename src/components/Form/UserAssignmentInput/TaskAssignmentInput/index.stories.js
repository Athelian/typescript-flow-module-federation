/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { ObjectValue } from 'react-values';
import { TaskAssignmentInput } from 'components/Form';

storiesOf('Form/Inputs/Task Assignment Input', module).add('Task Assignment Input', () => (
  <ObjectValue
    defaultValue={{
      users: [
        { id: '1', firstName: 'Kevin', lastName: 'Nguyen' },
        { id: '2', firstName: 'Bob', lastName: 'Bill' },
      ],
      activeUserId: '2',
    }}
  >
    {({ value, set: setFieldValue }) => (
      <TaskAssignmentInput
        {...value}
        onChange={setFieldValue}
        onActivateUser={id => setFieldValue('activeUserId', id)}
        onDeactivateUser={() => setFieldValue('activeUserId', null)}
        editable
      />
    )}
  </ObjectValue>
));
