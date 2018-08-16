// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import query from './query';

type Props = {
  enumType: string,
  children: React.Node,
};

const EnumProvider = ({ enumType, children }: Props) => (
  <Query query={query} variables={{ enumType }}>
    {({ loading, data }) =>
      children({
        data: !loading && data ? getByPathWithDefault([], '__type.enumValues', data) : [],
        loading,
      })
    }
  </Query>
);

export default EnumProvider;
