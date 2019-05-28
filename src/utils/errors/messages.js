// @flow
import { defineMessages } from 'react-intl';

export default defineMessages({
  apiErrorMessage: {
    id: 'global.apiErrorMessage',
    defaultMessage: 'There was an error. Please try again later.',
  },
  apiEntityNotFoundErrorMessage: {
    id: 'global.apiEntityNotFoundErrorMessage',
    defaultMessage:
      'Sorry, but this data has been deleted. Please refresh the page and review the logs to see more details',
  },
  notFoundErrorMessage: {
    id: 'global.notFoundErrorMessage',
    defaultMessage:
      'You are using some data that no longer exists. Please refresh the page and try again.',
  },
});
