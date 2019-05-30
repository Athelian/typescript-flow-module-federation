// @flow
import { useContext } from 'react';
import { UserContext } from 'modules/user';

const useUser = () => {
  const { user } = useContext(UserContext);
  const { group } = user;

  return {
    user,
    group,
    isOwnerBy: (ownerId: string) => !ownerId || ownerId === group.id,
    isImporter: (): boolean => {
      const { types = [] } = group;
      return types.includes('Importer');
    },
    isForwarder: (): boolean => {
      const { types = [] } = group;
      return types.includes('Forwarder');
    },
    isExporter: (): boolean => {
      const { types = [] } = group;
      return types.includes('Exporter');
    },
  };
};

export default useUser;
