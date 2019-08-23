// @flow

export const transformField = (
  basePath: string | null,
  entity: Object | null,
  field: string,
  permissions: () => boolean
) => {
  if (entity === null) {
    return {
      entity: null,
      data: null,
      empty: true,
      forbidden: false,
    };
  }

  switch (entity.__typename) {
    case 'Forbidden':
      return {
        entity: null,
        data: null,
        empty: false,
        forbidden: true,
      };
    default:
      return {
        entity: {
          id: entity.id,
          type: entity.__typename,
          field,
          permissions,
          ownedBy: entity.ownedBy.id,
        },
        data: {
          value: entity[field],
          path: basePath ? `${basePath}.${field}` : field,
        },
        empty: false,
        forbidden: false,
      };
  }
};
