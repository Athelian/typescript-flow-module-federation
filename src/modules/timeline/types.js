// @flow

export type UserInfo = {
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  avatar: ?{
    path: string,
  },
  group: {
    id: string,
    name: string,
  },
  roles: Array<{
    id: string,
    name: string,
  }>,
};

export type CommentItem = {
  id: string,
  createdAt: Date,
  updatedAt: Date,
  createdBy: UserInfo,
  content: string,
};

export type LogItem = {
  id: string,
  translationKey: string,
  parameters: {
    [key: string]: any,
  },
  entityType: string,
  parentEntity: {
    id: string,
  },
  parentEntityType: string,
  createdAt: Date,
  createdBy: UserInfo,
};

export type DateItem = {
  id: string,
  date: Date,
};
