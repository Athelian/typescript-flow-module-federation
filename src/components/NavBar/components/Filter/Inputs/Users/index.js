// @flow
import * as React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { FormattedMessage } from 'react-intl';
import { Label, UserAssignmentInput } from 'components/Form';
import { useAuthorizedViewer } from 'contexts/Viewer';
import messages from '../../messages';
import { usersByIDsQuery } from './query';

type Props = {
  value: Array<string>,
  readonly: boolean,
  onChange: (Array<string>) => void,
};

const Users = ({ value, readonly, onChange }: Props) => {
  const { organization } = useAuthorizedViewer();
  const { data } = useQuery(usersByIDsQuery, {
    variables: { ids: value },
    fetchPolicy: 'cache-and-network',
  });

  return (
    <>
      <Label height="30px">
        <FormattedMessage {...messages.users} />
      </Label>

      <UserAssignmentInput
        users={data?.usersByIDs ?? []}
        name="users"
        onChange={(name, users) => onChange(users.map(u => u.id))}
        editable={!readonly}
        groupIds={[organization.id]}
      />
    </>
  );
};

export default Users;
