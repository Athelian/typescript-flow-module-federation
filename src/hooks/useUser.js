// @flow
import { useAuthorizedViewer } from 'contexts/Viewer';

const useUser = () => {
  const { user, organization } = useAuthorizedViewer();

  return {
    user,
    organization,
    isOwnerBy: (ownerId: string) => !ownerId || ownerId === organization.id,
    isImporter: (): boolean => {
      const { types = [] } = organization;
      return types.includes('Importer');
    },
    isForwarder: (): boolean => {
      const { types = [] } = organization;
      return types.includes('Forwarder');
    },
    isExporter: (): boolean => {
      const { types = [] } = organization;
      return types.includes('Exporter');
    },
    isWarehouser: (): boolean => {
      const { types = [] } = organization;
      return types.includes('Warehouser');
    },
    isSupplier: (): boolean => {
      const { types = [] } = organization;
      return types.includes('Supplier');
    },
  };
};

export default useUser;
