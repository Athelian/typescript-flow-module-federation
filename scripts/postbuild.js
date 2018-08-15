const shell = require('shelljs');

shell.exec('yarn flow-typed');
shell.exec('yarn apollo-fragments');
shell.cp(
  'node_modules/downshift/flow-typed/npm/downshift_v2.x.x.js.flow',
  'flow-typed/npm/downshift_v2.x.x.js.flow'
);
