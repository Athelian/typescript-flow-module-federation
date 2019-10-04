import * as React from 'react';
import { configure, addDecorator } from '@storybook/react';
import apolloStorybookDecorator from 'apollo-storybook-react';
import { withInfo } from '@storybook/addon-info';
import { withA11y } from '@storybook/addon-a11y';
import { withConsole } from '@storybook/addon-console';
import { Provider } from 'unstated';
import { IntlProvider } from 'react-intl';
import { IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { ViewerContext } from 'components/Context/Viewer';
import StoryBookWrapper from 'components/StoryBookWrapper';
import introspectionQueryResultData from 'generated/fragmentTypes.json';
import typeDefs from 'generated/schema.graphql';
import mocks from './mocks';

addDecorator(withInfo);
addDecorator(withA11y);
addDecorator((storyFn, context) => withConsole()(storyFn)(context));
addDecorator(
  apolloStorybookDecorator({
    typeDefs,
    mocks,
    resolverValidationOptions: {
      requireResolversForResolveType: false,
    },
    cacheOptions: {
      fragmentMatcher: new IntrospectionFragmentMatcher({
        introspectionQueryResultData,
      }),
    },
  })
);

addDecorator(storyFn => (
  <Provider>
    <IntlProvider locale="en">
      <ViewerContext.Provider
        value={{
          authenticated: true,
          setAuthenticated: () => {},
          user: {},
          organization: {},
        }}
      >
        <StoryBookWrapper>{storyFn()}</StoryBookWrapper>
      </ViewerContext.Provider>
    </IntlProvider>
  </Provider>
));

// automatically import all files ending in *.stories.js
function loadStories() {
  const req = require.context('../src', true, /\.stories\.(js|jsx)$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
