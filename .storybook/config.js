import * as React from 'react';
import { range } from 'lodash';
import faker from 'faker';
import { configure, addDecorator } from '@storybook/react';
import apolloStorybookDecorator from 'apollo-storybook-react';
import { withInfo } from '@storybook/addon-info';
import { withA11y } from '@storybook/addon-a11y';
import { Provider } from 'unstated';
import { IntlProvider } from 'react-intl';
import StoryBookWrapper from 'components/StoryBookWrapper';
import typeDefs from 'generated/schema.graphql';

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

const usersMock = range(10).map(baseUserMock);

const mocks = {
  User: () => {
    return baseUserMock();
  },
  UserPayloadPagination: () => {
    return {
      nodes: usersMock,
      page: 1,
      totalPage: 1,
    };
  },
};

addDecorator(withInfo);
addDecorator(withA11y);
addDecorator(
  apolloStorybookDecorator({
    typeDefs,
    mocks,
    resolverValidationOptions: {
      requireResolversForResolveType: false,
    },
    apolloClientOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'ignore',
      },
      query: {
        fetchPolicy: 'cache-first',
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
  })
);

addDecorator(storyFn => (
  <Provider>
    <IntlProvider locale="en">
      <StoryBookWrapper>{storyFn()}</StoryBookWrapper>
    </IntlProvider>
  </Provider>
));

// automatically import all files ending in *.stories.js
function loadStories() {
  const req = require.context('../src', true, /\.stories\.(js|jsx)$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
