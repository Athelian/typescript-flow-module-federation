/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { ObjectValue } from 'react-values';
import { Label } from 'components/Form';
import { TaskCard } from 'components/Cards';

storiesOf('Card', module)
  .add('Task Card', () => (
    <ObjectValue
      defaultValue={{
        task: {
          id: '1',
          entity: {
            id: '2',
            __typename: 'Order',
            poNo: 'ABC',
          },
          name: 'Task name',
          dueDate: null,
          startDate: null,
          assignedTo: [],
          approvers: [],
          tags: [
            {
              id: 'bicsesovsbnbasgumrk0',
              name: '111',
              description: null,
              color: '#e0c041',
              __typename: 'Tag',
            },
            {
              id: 'bics8lovsbnbasgumrjg',
              name: '111',
              description: null,
              color: '#e0c041',
              __typename: 'Tag',
            },
            {
              id: 'bi4dmb4s7cc75f5td1lg',
              name: 'test for task',
              description: '1',
              color: '#11d1a6',
              __typename: 'Tag',
            },
          ],
        },
      }}
    >
      {({ value: { task }, assign }) => (
        <>
          <Label>EDITABLE DEFAULT</Label>
          <TaskCard
            task={task}
            editable
            position={1}
            saveOnBlur={newTask => assign({ task: newTask })}
          />
          <Label>READ ONLY</Label>
          <TaskCard task={task} editable={false} position={1} />
        </>
      )}
    </ObjectValue>
  ))
  .add('Task Card for template', () => (
    <ObjectValue
      defaultValue={{
        task: {
          id: '1',
          entity: {
            id: '2',
            __typename: 'Order',
            poNo: 'ABC',
          },
          name: 'Task name',
          dueDate: null,
          startDate: null,
          assignedTo: [],
          approvers: [],
          tags: [
            {
              id: 'bicsesovsbnbasgumrk0',
              name: '111',
              description: null,
              color: '#e0c041',
              __typename: 'Tag',
            },
            {
              id: 'bics8lovsbnbasgumrjg',
              name: '111',
              description: null,
              color: '#e0c041',
              __typename: 'Tag',
            },
            {
              id: 'bi4dmb4s7cc75f5td1lg',
              name: 'test for task',
              description: '1',
              color: '#11d1a6',
              __typename: 'Tag',
            },
          ],
        },
      }}
    >
      {({ value: { task }, assign }) => (
        <>
          <Label>EDITABLE DEFAULT</Label>
          <TaskCard
            task={task}
            editable
            position={1}
            isInTemplate
            saveOnBlur={newTask => assign({ task: newTask })}
          />
          <Label>READ ONLY</Label>
          <TaskCard
            task={task}
            editable={false}
            position={1}
            isInTemplate
            saveOnBlur={newTask => assign({ task: newTask })}
          />
        </>
      )}
    </ObjectValue>
  ))
  .add('Task Card with Approval', () => (
    <ObjectValue
      defaultValue={{
        task: {
          id: '1',
          approvable: true,
          entity: {
            id: '2',
            __typename: 'Order',
            poNo: 'ABC',
          },
          name: 'Task name',
          dueDate: null,
          startDate: null,
          assignedTo: [],
          approvers: [],
          tags: [
            {
              id: 'bicsesovsbnbasgumrk0',
              name: '111',
              description: null,
              color: '#e0c041',
              __typename: 'Tag',
            },
            {
              id: 'bics8lovsbnbasgumrjg',
              name: '111',
              description: null,
              color: '#e0c041',
              __typename: 'Tag',
            },
            {
              id: 'bi4dmb4s7cc75f5td1lg',
              name: 'test for task',
              description: '1',
              color: '#11d1a6',
              __typename: 'Tag',
            },
          ],
        },
      }}
    >
      {({ value: { task }, assign }) => (
        <>
          <Label>EDITABLE DEFAULT</Label>
          <TaskCard
            task={task}
            editable
            position={1}
            saveOnBlur={newTask => assign({ task: newTask })}
          />
          <Label>READ ONLY</Label>
          <TaskCard task={task} editable={false} position={1} />
        </>
      )}
    </ObjectValue>
  ))
  .add('Task Card with Approved', () => (
    <ObjectValue
      defaultValue={{
        task: {
          id: '1',
          approvable: true,
          approvalBy: {
            id: 1,
          },
          entity: {
            id: '2',
            __typename: 'Order',
            poNo: 'ABC',
          },
          name: 'Task name',
          dueDate: null,
          startDate: null,
          assignedTo: [],
          approvers: [],
          tags: [
            {
              id: 'bicsesovsbnbasgumrk0',
              name: '111',
              description: null,
              color: '#e0c041',
              __typename: 'Tag',
            },
            {
              id: 'bics8lovsbnbasgumrjg',
              name: '111',
              description: null,
              color: '#e0c041',
              __typename: 'Tag',
            },
            {
              id: 'bi4dmb4s7cc75f5td1lg',
              name: 'test for task',
              description: '1',
              color: '#11d1a6',
              __typename: 'Tag',
            },
          ],
        },
      }}
    >
      {({ value: { task }, assign }) => (
        <>
          <Label>EDITABLE DEFAULT</Label>
          <TaskCard
            task={task}
            editable
            position={1}
            saveOnBlur={newTask => assign({ task: newTask })}
          />
          <Label>READ ONLY</Label>
          <TaskCard task={task} editable={false} position={1} />
        </>
      )}
    </ObjectValue>
  ))
  .add('Task Card with Rejected', () => (
    <ObjectValue
      defaultValue={{
        task: {
          id: '1',
          approvable: true,
          rejectBy: {
            id: 1,
          },
          entity: {
            id: '2',
            __typename: 'Order',
            poNo: 'ABC',
          },
          name: 'Task name',
          dueDate: null,
          startDate: null,
          assignedTo: [],
          approvers: [],
          tags: [
            {
              id: 'bicsesovsbnbasgumrk0',
              name: '111',
              description: null,
              color: '#e0c041',
              __typename: 'Tag',
            },
            {
              id: 'bics8lovsbnbasgumrjg',
              name: '111',
              description: null,
              color: '#e0c041',
              __typename: 'Tag',
            },
            {
              id: 'bi4dmb4s7cc75f5td1lg',
              name: 'test for task',
              description: '1',
              color: '#11d1a6',
              __typename: 'Tag',
            },
          ],
        },
      }}
    >
      {({ value: { task }, assign }) => (
        <>
          <Label>EDITABLE DEFAULT</Label>
          <TaskCard
            task={task}
            editable
            position={1}
            saveOnBlur={newTask => assign({ task: newTask })}
          />
          <Label>READ ONLY</Label>
          <TaskCard task={task} editable={false} position={1} />
        </>
      )}
    </ObjectValue>
  ))
  .add('Task Card for Template with Approval', () => (
    <ObjectValue
      defaultValue={{
        task: {
          id: '1',
          approvable: true,
          entity: {
            id: '2',
            __typename: 'Order',
            poNo: 'ABC',
          },
          name: 'Task name',
          dueDate: null,
          startDate: null,
          assignedTo: [],
          approvers: [],
          tags: [
            {
              id: 'bicsesovsbnbasgumrk0',
              name: '111',
              description: null,
              color: '#e0c041',
              __typename: 'Tag',
            },
            {
              id: 'bics8lovsbnbasgumrjg',
              name: '111',
              description: null,
              color: '#e0c041',
              __typename: 'Tag',
            },
            {
              id: 'bi4dmb4s7cc75f5td1lg',
              name: 'test for task',
              description: '1',
              color: '#11d1a6',
              __typename: 'Tag',
            },
          ],
        },
      }}
    >
      {({ value: { task }, assign }) => (
        <>
          <Label>EDITABLE DEFAULT</Label>
          <TaskCard
            task={task}
            editable
            position={1}
            isInTemplate
            saveOnBlur={newTask => assign({ task: newTask })}
          />
          <Label>READ ONLY</Label>
          <TaskCard
            task={task}
            editable={false}
            position={1}
            isInTemplate
            saveOnBlur={newTask => assign({ task: newTask })}
          />
        </>
      )}
    </ObjectValue>
  ));
