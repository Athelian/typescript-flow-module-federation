/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import apolloStorybookDecorator from 'apollo-storybook-react';
import { range } from 'lodash';
import faker from 'faker';
import { Provider } from 'unstated';
import { IntlProvider } from 'react-intl';
import { ObjectValue } from 'react-values';
import StoryBookWrapper from 'components/StoryBookWrapper';
import typeDefs from 'generated/schema.graphql';
import { Label } from 'components/Form';
import { TaskCard } from 'components/Cards';

const baseUserMock = () => {
  return {
    id: faker.random.uuid(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    role: 'default',
    tags: [],
    __typename: 'User',
  };
};

const mocks = {
  User: () => {
    return baseUserMock();
  },
  UserPayloadPagination: () => {
    return {
      nodes: range(10).map(baseUserMock),
      page: 1,
      totalPage: 1,
    };
  },
};

storiesOf('Card', module)
  .addDecorator(
    apolloStorybookDecorator({
      typeDefs,
      mocks,
      resolverValidationOptions: {
        requireResolversForResolveType: false,
      },
    })
  )
  .add('Task Card', () => (
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
                assignedTo: [baseUserMock()],
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
  ))
  .add('Task Card for template', () => (
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
                assignedTo: [baseUserMock()],
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
            {({ value: { task } }) => (
              <>
                <Label>EDITABLE DEFAULT</Label>
                <TaskCard task={task} editable position={1} isInTemplate />
                <Label>READ ONLY</Label>
                <TaskCard task={task} editable={false} position={1} isInTemplate />
              </>
            )}
          </ObjectValue>
        </Provider>
      </IntlProvider>
    </StoryBookWrapper>
  ))
  .add('Task Card for approvable', () => (
    <StoryBookWrapper>
      <IntlProvider>
        <Provider>
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
                assignedTo: [baseUserMock(), baseUserMock()],
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
  ))
  .add('Task Card with approvable', () => (
    <StoryBookWrapper>
      <IntlProvider>
        <Provider>
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
                assignedTo: [baseUserMock(), baseUserMock()],
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
  ))
  .add('Task Card with reject', () => (
    <StoryBookWrapper>
      <IntlProvider>
        <Provider>
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
                assignedTo: [baseUserMock(), baseUserMock()],
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
