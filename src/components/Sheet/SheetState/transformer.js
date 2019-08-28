// @flow

export const transformField = (
  basePath: string,
  entity: Object | null,
  field: string,
  permissions: () => boolean
) => {
  if (entity === null) {
    return {
      entity: null,
      data: null,
      forbidden: false,
    };
  }

  switch (entity.__typename) {
    case 'Forbidden':
    case 'NotFound':
      return {
        entity: null,
        data: null,
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
          path: `${basePath}.${field}`,
        },
        forbidden: false,
      };
  }
};
