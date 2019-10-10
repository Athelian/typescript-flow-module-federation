// @flow
import { useViewerHasPermissions } from 'contexts/Permissions';

/**
 * @deprecated Use instead hook useViewerHasPermissions
 */
const PermissionConsumer = ({ children }: { children: Function }) => {
  const hasPermission = useViewerHasPermissions();

  return children(hasPermission);
};

export default PermissionConsumer;
