/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { ObjectValue } from 'react-values';
import { TaskStatusInput, ToggleInput, Label } from 'components/Form';
import { IN_PROGRESS, COMPLETED } from 'components/Form/TaskStatusInput/constants';

storiesOf('Form/Inputs/Task Status Input', module).add('Task Status Input', () => (
  <ObjectValue
    defaultValue={{
      activeUser: {
        firstName: 'Kevin',
        lastName: 'Nguyen',
      },
      showActiveUser: true,
      status: 'InProgress',
      editable: true,
    }}
  >
    {({ value, set }) => {
      const { editable, showActiveUser, status } = value;

      return (
        <>
          <TaskStatusInput
            {...value}
            onClick={() => (status === IN_PROGRESS ? set('status', COMPLETED) : {})}
            onClickUser={() => (status === COMPLETED ? set('status', IN_PROGRESS) : {})}
          />
          <ToggleInput
            toggled={showActiveUser}
            onToggle={() => set('showActiveUser', !showActiveUser)}
          >
            <Label>SHOW ACTIVE USER</Label>
          </ToggleInput>
          <ToggleInput toggled={editable} onToggle={() => set('editable', !editable)}>
            <Label>EDITABLE</Label>
          </ToggleInput>
        </>
      );
    }}
  </ObjectValue>
));
