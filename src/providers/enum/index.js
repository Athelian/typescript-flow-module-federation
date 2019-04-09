// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import query from './query';

function enumSelector(data: ?Object) {
  return getByPathWithDefault([], '__type.enumValues', data);
}

type Props = {
  enumType: string,
  children: ({ loading: boolean, error: any, data: any }) => React.Node,
};

const EnumProvider = ({ enumType, children }: Props) => (
  <Query query={query} variables={{ enumType }} fetchPolicy="cache-first">
    {({ loading, error, data }) =>
      children({
        loading,
        error,
        data: enumSelector(data),
      })
    }
  </Query>
);

export default EnumProvider;
