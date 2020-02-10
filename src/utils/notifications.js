// @flow
import type { Notification } from 'generated/graphql';
import { encodeId } from 'utils/id';
import { parseRoute } from 'utils/entity';

export const parseUrl = (notification: Notification) => {
  const id = notification?.entity?.id;

  if (!id) return '.';

  const typeName = notification?.entity?.__typename;

  return `/${parseRoute(typeName).toLowerCase()}/${encodeId(id)}`;
};

export default parseUrl;
