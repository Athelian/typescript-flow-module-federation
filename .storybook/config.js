import { configure, addDecorator } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { checkA11y } from '@storybook/addon-a11y';

addDecorator((story, context) => withInfo()(story)(context));
addDecorator(checkA11y);

// automatically import all files ending in *.stories.js
function loadStories() {
  const req = require.context('../src', true, /\.stories\.(js|jsx)$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
