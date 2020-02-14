/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { ViewerContext } from 'contexts/Viewer';
import NotificationsDropdown from './index';

storiesOf('NotificationsDropdown', module)
  .add('empty list', () => (
    <ViewerContext.Provider
      value={{
        authenticated: true,
        setAuthenticated: () => {},
        user: {},
        organization: {},
        notifications: {
          nodes: [],
        },
      }}
    >
      <NotificationsDropdown isOpen />{' '}
    </ViewerContext.Provider>
  ))
  .add('short list', () => <NotificationsDropdown isOpen />)
  .add('long list', () => <NotificationsDropdown isOpen totalMoreItems={2} />);
