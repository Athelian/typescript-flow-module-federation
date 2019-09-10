// @flow

export const transformField = (
  basePath: string,
  entity: Object | null,
  field: string,
  permissions: ((string) => boolean) => boolean
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
        },
        data: {
          value: entity[field],
          path: `${basePath}.${field}`,
          field,
          permissions,
          ownedBy: entity.ownedBy.id,
        },
        forbidden: false,
      };
  }
};

export default transformField;
