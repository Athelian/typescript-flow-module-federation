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
    isUsingLegacyFeatures: (): boolean => {
      // NOTE: should remove when NRM and GTV are ready
      return ['b9o2ju6rhpo001fg5hi0', 'bhucejdeqsa2ksd16460'].includes(organization.id);
    },
  };
};

export default useUser;
