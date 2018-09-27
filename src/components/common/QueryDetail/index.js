// @flow
import * as React from 'react';
import { navigate } from '@reach/router';
import { Query } from 'react-apollo';
import type { DocumentNode } from 'graphql';
import LoadingIcon from 'components/LoadingIcon';
import { decodeId } from 'utils/id';
import { getByPathWithDefault, getByPath } from 'utils/fp';

type Props = {
  query: DocumentNode,
  detailId: string,
  render: Object => React.Node,
  detailType: string,
};

export default function QueryDetail({ query, detailId, detailType, render }: Props) {
  return (
    <Query query={query} variables={{ id: decodeId(detailId) }} fetchPolicy="network-only">
      {({ loading, data, error }) => {
        if (error) {
          return error.message;
        }

        if (loading) return <LoadingIcon />;
        if (getByPath(detailType, data)) return render(getByPathWithDefault({}, detailType, data));

        navigate(`/${detailType}`);
        return <LoadingIcon />;
      }}
    </Query>
  );
}
