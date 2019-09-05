// @flow
import { useViewerHasPermissions } from 'components/Context/Permissions';

/**
 * @deprecated Use instead hook useViewerHasPermissions
 */
const PermissionConsumer = ({ children }: { children: Function }) => {
  const hasPermission = useViewerHasPermissions();

  return children(hasPermission);
};

export default PermissionConsumer;
