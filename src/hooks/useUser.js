// @flow
import { useContext } from 'react';
import { UserContext } from 'modules/user';

const useUser = () => {
  const { user } = useContext(UserContext);
  const { group } = user;

  return {
    isOwnerBy: (ownerId: string) => !ownerId || ownerId === group.id,
    isImporter: (): boolean => {
      const { types = [] } = group;
      return types.includes('Importer');
    },
  };
};

export default useUser;
