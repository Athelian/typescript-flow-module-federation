// @flow
import gql from 'graphql-tag';
import { milestoneFormFragment, userAvatarFragment } from 'graphql';

export const milestoneFormQuery = gql`
  query($id: ID!) {
    milestone(id: $id) {
      ...milestoneFormFragment
    }
  }

  ${milestoneFormFragment}
  ${userAvatarFragment}
`;

export default milestoneFormQuery;
