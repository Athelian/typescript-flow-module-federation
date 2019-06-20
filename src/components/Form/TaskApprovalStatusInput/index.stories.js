/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { ObjectValue } from 'react-values';
import { TaskApprovalStatusInput, ToggleInput, Label } from 'components/Form';

storiesOf('Form/Inputs/Task Approval Status Input', module).add(
  'Task Approval Status Input',
  () => (
    <>
      <ObjectValue
        defaultValue={{
          showUser: true,
          editable: true,
        }}
      >
        {({ value, set }) => {
          const { editable, showUser } = value;

          return (
            <>
              <TaskApprovalStatusInput
                {...value}
                approval={{
                  approvedBy: { id: 1, firstName: 'Kevin', lastName: 'Nguyen' },
                  approvedAt: new Date(),
                }}
                rejection={null}
              />
              <ToggleInput toggled={showUser} onToggle={() => set('showUser', !showUser)}>
                <Label>SHOW USER</Label>
              </ToggleInput>
              <ToggleInput toggled={editable} onToggle={() => set('editable', !editable)}>
                <Label>EDITABLE</Label>
              </ToggleInput>
            </>
          );
        }}
      </ObjectValue>

      <ObjectValue
        defaultValue={{
          showUser: true,
          editable: true,
        }}
      >
        {({ value, set }) => {
          const { editable, showUser } = value;

          return (
            <>
              <TaskApprovalStatusInput
                {...value}
                approval={null}
                rejection={{
                  rejectedBy: { id: 1, firstName: 'Kevin', lastName: 'Nguyen' },
                  rejectedAt: new Date(),
                }}
              />
              <ToggleInput toggled={showUser} onToggle={() => set('showUser', !showUser)}>
                <Label>SHOW USER</Label>
              </ToggleInput>
              <ToggleInput toggled={editable} onToggle={() => set('editable', !editable)}>
                <Label>EDITABLE</Label>
              </ToggleInput>
            </>
          );
        }}
      </ObjectValue>
    </>
  )
);
