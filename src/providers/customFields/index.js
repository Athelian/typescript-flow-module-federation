// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import { fieldDefinitionsQuery } from 'modules/metadata/query';

type Props = {
  entityType: string,
  children: ({ loading: boolean, error: any, data: any }) => React.Node,
};

const CustomFieldsProvider = ({ entityType, children }: Props) => (
  <Query query={fieldDefinitionsQuery} variables={{ entityType }} fetchPolicy="network-only">
    {({ loading, error, data }) =>
      children({
        loading,
        error,
        data: getByPathWithDefault([], 'fieldDefinitions', data),
      })
    }
  </Query>
);

export default CustomFieldsProvider;
