// @flow
import { useContext } from 'react';
import { UserContext } from 'modules/user';

const useUser = () => {
  const { user } = useContext(UserContext);

  return {
    isOwner: (ownerId: string) => ownerId === user.group.id,
  };
};

export default useUser;
