/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { Provider } from 'unstated';
import { IntlProvider } from 'react-intl';
import { ObjectValue } from 'react-values';
import StoryBookWrapper from 'components/StoryBookWrapper';
import { ToggleInput, Label } from 'components/Form';
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
              tags: [],
            },
            editable: true,
          }}
        >
          {({ value: { task, editable }, set }) => (
            <>
              <TaskCard task={task} editable={editable} position={1} />
              <ToggleInput toggled={editable} onToggle={() => set('editable', !editable)}>
                <Label>EDITABLE</Label>
              </ToggleInput>
            </>
          )}
        </ObjectValue>
      </Provider>
    </IntlProvider>
  </StoryBookWrapper>
));
