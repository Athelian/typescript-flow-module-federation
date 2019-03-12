/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { Provider } from 'unstated';
import { IntlProvider } from 'react-intl';
import { ObjectValue } from 'react-values';
import StoryBookWrapper from 'components/StoryBookWrapper';
import { Label } from 'components/Form';
import { TaskCard } from 'components/Cards';

storiesOf('Card', module).add('Task Card', () => (
  <StoryBookWrapper>
    <IntlProvider>
      <Provider>
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
              assignedTo: [
                { id: '3', firstName: 'Kevin', lastName: 'Nguyen' },
                { id: '4', firstName: 'Kevin', lastName: 'Nguyen' },
                { id: '5', firstName: 'Kevin', lastName: 'Nguyen' },
                { id: '6', firstName: 'Kevin', lastName: 'Nguyen' },
              ],
              tags: [{ id: '7', name: 'tag', color: '#cccccc' }],
            },
          }}
        >
          {({ value: { task } }) => (
            <>
              <Label>EDITABLE DEFAULT</Label>
              <TaskCard task={task} editable position={1} />
              <Label>EDITABLE IN PROGRESS</Label>
              <TaskCard
                task={{
                  ...task,
                  inProgressBy: { id: '1', firstName: 'Kevin', lastName: 'Nguyen' },
                }}
                editable
                position={1}
              />
              <Label>EDITABLE COMPLETE</Label>
              <TaskCard
                task={{
                  ...task,
                  inProgressBy: { id: '1', firstName: 'Kevin', lastName: 'Nguyen' },
                  completedBy: { id: '1', firstName: 'Kevin', lastName: 'Nguyen' },
                  completedAt: '2019-01-01',
                }}
                editable
                position={1}
              />
              <Label>READ ONLY</Label>
              <TaskCard task={task} editable={false} position={1} />
            </>
          )}
        </ObjectValue>
      </Provider>
    </IntlProvider>
  </StoryBookWrapper>
));
