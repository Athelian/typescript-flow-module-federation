// @flow
import type { Notification } from 'generated/graphql';
import { encodeId } from 'utils/id';
import { parseRoute } from 'utils/entity';

export const parseUrl = (notification: Notification) => {
  let id = notification?.entity?.id;

  if (!id) return '.';

  let typeName = notification?.entity?.__typename;

  // Since we don't have Milestone view, so get parent entity (project) to show.
  if (typeName === 'Milestone' && notification?.milestone.__typename === 'Milestone') {
    typeName = 'Project';
    id = notification?.milestone.project.id;
  }

  return `/${parseRoute(typeName).toLowerCase()}/${encodeId(id)}`;
};

export default parseUrl;
