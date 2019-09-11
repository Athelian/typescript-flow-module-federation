// @flow
import * as React from 'react';
import FormattedName from 'components/FormattedName';
import { WrapperStyle, UserStyle } from './style';

type Props = {
  users: Array<{ id: string, firstName: string, lastName: string }>,
  isFirstRow: boolean,
  size: number,
};

const Users = ({ users, isFirstRow, size }: Props) => {
  return (
    <div className={WrapperStyle(isFirstRow, size)}>
      {users.map(user => (
        <span key={user.id} className={UserStyle(isFirstRow)}>
          <FormattedName firstName={user.firstName} lastName={user.lastName} />
        </span>
      ))}
    </div>
  );
};

export default Users;
