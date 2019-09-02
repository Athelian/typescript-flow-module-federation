// @flow
import { useHasPermissions } from 'components/Context/Permissions';
import useUser from 'hooks/useUser';

/**
 * @deprecated Use instead hook useHasPermissions
 */
const PermissionConsumer = ({ children }: { children: Function }) => {
  const { organization } = useUser();
  const hasPermission = useHasPermissions(organization?.id);

  return children(hasPermission);
};

export default PermissionConsumer;
