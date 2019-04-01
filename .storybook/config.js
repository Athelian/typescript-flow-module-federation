import { configure, addDecorator } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withA11y } from '@storybook/addon-a11y';

addDecorator(withInfo);
addDecorator(withA11y);

// automatically import all files ending in *.stories.js
function loadStories() {
  const req = require.context('../src', true, /\.stories\.(js|jsx)$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
