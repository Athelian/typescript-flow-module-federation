import * as emotion from 'emotion';
/* eslint-disable import/no-extraneous-dependencies */
import { createSerializer } from 'jest-emotion';

expect.addSnapshotSerializer(createSerializer(emotion));
