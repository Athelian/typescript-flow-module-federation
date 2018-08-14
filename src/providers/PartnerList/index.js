// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import query from './query.graphql';

type Props = {
  children: any,
};

class PartnerList extends React.PureComponent<Props> {
  render() {
    const { children } = this.props;
    return (
      <Query query={query} variables={{ page: 1, perPage: 20 }}>
        {({ loading, data }) =>
          children({
            data:
              !loading && data ? getByPathWithDefault([], 'viewer.group.partners.nodes', data) : [],
            loading,
          })
        }
      </Query>
    );
  }
}

export default PartnerList;
