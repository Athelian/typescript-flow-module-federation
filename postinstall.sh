#!/bin/sh
yarn flow-typed
yarn apollo-fragments
cp node_modules/downshift/flow-typed/npm/downshift_v2.x.x.js.flow flow-typed/npm/downshift_v2.x.x.js.flow
