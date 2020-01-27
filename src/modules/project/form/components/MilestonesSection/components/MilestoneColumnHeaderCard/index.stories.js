/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import faker from 'faker';
import { storiesOf } from '@storybook/react';
import { ViewerContext } from 'contexts/Viewer';
import MilestoneColumnHeaderCard from './index';

storiesOf('Project/MilestoneColumnHeaderCard', module).add('with default props', () => (
  <ViewerContext.Provider
    value={{
      authenticated: true,
      setAuthenticated: () => {},
      user: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
      },
      organization: {},
    }}
  >
    <MilestoneColumnHeaderCard provided={{}} milestoneId="" isDragging={false} />
  </ViewerContext.Provider>
));
