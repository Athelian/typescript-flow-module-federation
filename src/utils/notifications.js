// @flow
import type { Notification } from 'generated/graphql';
import { encodeId } from 'utils/id';
import { parseRoute } from 'utils/entity';

export const parseUrl = (notification: Notification) => {
  let id = notification?.entity?.id;

  if (!id) return '.';

  let typeName = notification?.entity?.__typename;

  // Since we don't have Milestone view, so get parent entity (project) to show.
  if (typeName === 'Milestone' && notification?.entity?.project !== undefined) {
    typeName = 'Project';
    id = notification?.entity?.project.id;
  } else if (typeName === 'ProductProvider' && notification?.entity?.product !== undefined) {
    typeName = 'Product';
    id = notification?.entity?.product.id;
  } else if (typeName === 'File') {
    typeName = 'Document';
  }

  return `/${parseRoute(typeName).toLowerCase()}/${encodeId(id)}`;
};

export default parseUrl;
