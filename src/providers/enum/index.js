// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import query from './query';

type Props = {
  enumType: string,
  children: React.Node,
};

const EnumProvider = ({ enumType, children }: Props) => (
  <Query query={query} variables={{ enumType }}>
    {children}
  </Query>
);

export default EnumProvider;
