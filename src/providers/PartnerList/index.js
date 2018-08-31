// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import query from './query.graphql';

type Props = {
  types: Array<string>,
  children: any,
};

class PartnerList extends React.PureComponent<Props> {
  render() {
    const { children, types } = this.props;
    return (
      <Query query={query} variables={{ page: 1, perPage: 20, filterBy: { types } }}>
        {({ loading, data, error }) =>
          children({
            data:
              !loading && data
                ? getByPathWithDefault([], 'viewer.user.group.partners.nodes', data)
                : [],
            loading,
            error,
          })
        }
      </Query>
    );
  }
}

export default PartnerList;
