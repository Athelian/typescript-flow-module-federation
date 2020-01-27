/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import faker from 'faker';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { ViewerContext } from 'contexts/Viewer';
import ApprovalInput from './index';

storiesOf('GTV/Inputs', module)
  .add('ApprovalInput with default props', () => (
    <ViewerContext.Provider
      value={{
        authenticated: true,
        setAuthenticated: () => {},
        user: {},
        organization: {},
      }}
    >
      <ApprovalInput
        onChange={action('change')}
        onBlur={action('blur')}
        onFocus={action('focus')}
        value={null}
      />
    </ViewerContext.Provider>
  ))
  .add('ApprovalInput with user', () => (
    <ViewerContext.Provider
      value={{
        authenticated: true,
        setAuthenticated: () => {},
        user: {},
        organization: {},
      }}
    >
      <ApprovalInput
        onChange={action('change')}
        onBlur={action('blur')}
        onFocus={action('focus')}
        value={{
          user: {
            id: faker.random.uuid(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
          },
          date: new Date(),
        }}
      />
    </ViewerContext.Provider>
  ));
