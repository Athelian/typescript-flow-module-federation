/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import faker from 'faker';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import ApprovalInput from './index';

storiesOf('GTV/Inputs', module)
  .add('ApprovalInput with default props', () => (
    <ApprovalInput
      onChange={action('change')}
      onBlur={action('blur')}
      onFocus={action('focus')}
      value={null}
    />
  ))
  .add('ApprovalInput with user', () => (
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
  ));
