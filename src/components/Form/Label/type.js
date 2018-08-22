// @flow
import * as React from 'react';

export type LabelProps = {
  required?: boolean,
  children: React.Node,
};

export const labelDefaultProps = {
  required: false,
};

export default labelDefaultProps;
