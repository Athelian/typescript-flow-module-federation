import { configure, addDecorator } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { checkA11y } from '@storybook/addon-a11y';

addDecorator((story, context) => withInfo()(story)(context));
addDecorator(checkA11y);

function importAll(req) {
  req.keys().forEach(filename => req(filename));
}

function loadStories() {
  let req;
  req = require.context('../src', true, /\.stories\.(js|jsx)$/);
  importAll(req);
}

configure(loadStories, module);
