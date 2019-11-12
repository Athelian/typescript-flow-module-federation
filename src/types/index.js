// @flow

export type UserAvatarType = {
  id: string,
  firstName: string,
  lastName: string,
};

export type MetricValue = {
  value: number,
  metric: string,
};

export type FieldDefinition = {
  id: string,
  name: string,
  entityType: string,
  sort: number,
};

export type SortDirection = 'ASCENDING' | 'DESCENDING';
export type SortBy = { [string]: SortDirection };
export type FilterBy = Object;
